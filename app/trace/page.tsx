"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Trace Studio — personal camera tracing / projection tool.
 *
 * Live rear-camera feed with a semi-transparent reference image floating on
 * top. Look at the screen while your hand draws on the paper underneath.
 * Recording captures ONLY the raw camera stream (your hand + paper) — the
 * overlay lives in the DOM, so it never appears in the saved video.
 *
 * To change the password: run
 *   node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
 * and paste the result into PASS_HASH below.
 */
const PASS_HASH =
  "fcfd075cbe367c158d5cfaa31fa06656a3e68f626388d96ee81b35dda4310b58"; // "butterfly"

const AUTH_KEY = "trace-authed";
const IMAGE_KEY = "trace-image";
const SETTINGS_KEY = "trace-settings";

type Settings = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  bw: boolean;
  invert: boolean;
  mirror: boolean;
  grid: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 0.4,
  bw: false,
  invert: false,
  mirror: false,
  grid: false,
};

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function friendlyLensLabel(label: string, index: number): string {
  const l = label.toLowerCase();
  if (l.includes("ultra wide")) return "0.5×";
  if (l.includes("telephoto")) return "Tele";
  if (l.includes("triple") || l.includes("dual")) return "Auto";
  if (l.includes("front")) return "Front";
  if (l.includes("back")) return "1×";
  return label || `Cam ${index + 1}`;
}

function pickRecorderMime(): string {
  const candidates = [
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=h264",
    "video/webm;codecs=vp9",
    "video/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c))
      return c;
  }
  return "";
}

export default function TracePage() {
  const [auth, setAuth] = useState<"checking" | "locked" | "open">("checking");

  useEffect(() => {
    // sessionStorage only exists client-side, so this must run post-hydration.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuth(sessionStorage.getItem(AUTH_KEY) === "1" ? "open" : "locked");
    } catch {
      setAuth("locked");
    }
  }, []);

  if (auth === "checking") {
    return <div className="fixed inset-0 z-[100] bg-black" />;
  }
  if (auth === "locked") {
    return <PasswordGate onUnlock={() => setAuth("open")} />;
  }
  return <Studio />;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value || busy) return;
    setBusy(true);
    const ok = (await sha256Hex(value)) === PASS_HASH;
    setBusy(false);
    if (ok) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {}
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-xs text-center">
        <div className="text-4xl mb-3">🦋</div>
        <h1 className="text-white text-xl font-semibold mb-1">Trace Studio</h1>
        <p className="text-neutral-400 text-sm mb-6">Private — enter password</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="w-full rounded-xl bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-center outline-none focus:border-neutral-400"
        />
        {error && (
          <p className="text-red-400 text-sm mt-2">Wrong password, try again.</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-white text-black font-medium py-3 active:opacity-70 disabled:opacity-50"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

type Pointer = { x: number; y: number };

function Studio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [locked, setLocked] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [zoomCaps, setZoomCaps] = useState<{
    min: number;
    max: number;
    step: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [clip, setClip] = useState<{ blob: Blob; url: string; ext: string } | null>(
    null
  );
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Gesture handlers need the latest settings without stale closures, so every
  // settings write goes through this helper to keep the ref in sync.
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const updateSettings = useCallback((next: Settings) => {
    settingsRef.current = next;
    setSettings(next);
  }, []);

  // ---- persistence ----
  useEffect(() => {
    // localStorage only exists client-side, so this must run post-hydration.
    try {
      const img = localStorage.getItem(IMAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (img) setImageSrc(img);
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) updateSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // ---- keep screen awake while tracing ----
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    async function acquire() {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
        };
        lock = (await nav.wakeLock?.request("screen")) ?? null;
      } catch {}
    }
    acquire();
    const onVis = () => {
      if (document.visibilityState === "visible") acquire();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      lock?.release().catch(() => {});
    };
  }, []);

  // ---- camera ----
  const startCamera = useCallback(async (deviceId?: string) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      const video: MediaTrackConstraints = deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: { ideal: "environment" } };
      video.width = { ideal: 1920 };
      video.height = { ideal: 1080 };
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: false,
      });
      streamRef.current = stream;
      setCameraError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      const track = stream.getVideoTracks()[0];
      setActiveDeviceId(track.getSettings().deviceId ?? deviceId ?? null);

      const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & {
        zoom?: { min: number; max: number; step?: number };
      };
      if (caps.zoom && typeof caps.zoom.min === "number") {
        setZoomCaps({
          min: caps.zoom.min,
          max: caps.zoom.max,
          step: caps.zoom.step || 0.1,
        });
        const current = (track.getSettings() as { zoom?: number }).zoom;
        setZoom(current ?? caps.zoom.min);
      } else {
        setZoomCaps(null);
      }

      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices(all.filter((d) => d.kind === "videoinput"));
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      setCameraError(
        name === "NotAllowedError"
          ? "Camera access was denied. Enable it in Settings → Safari (or your browser) → Camera, then reload."
          : "Couldn't start the camera. Make sure you're on HTTPS and no other app is using it, then reload."
      );
    }
  }, []);

  useEffect(() => {
    // startCamera only touches state after awaiting getUserMedia, never
    // synchronously during the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const applyZoom = useCallback((value: number) => {
    setZoom(value);
    const track = streamRef.current?.getVideoTracks()[0];
    track
      ?.applyConstraints({
        advanced: [{ zoom: value } as unknown as MediaTrackConstraintSet],
      })
      .catch(() => {});
  }, []);

  // ---- reference image ----
  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Downscale big photos so they fit in localStorage.
        const max = 1800;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setImageSrc(dataUrl);
        updateSettings({
          ...settingsRef.current,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
        });
        try {
          localStorage.setItem(IMAGE_KEY, dataUrl);
        } catch {}
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ---- overlay gestures (drag / pinch-zoom / rotate) ----
  const pointersRef = useRef<Map<number, Pointer>>(new Map());
  const gestureRef = useRef<{
    start: Settings;
    startMid: Pointer;
    startDist: number;
    startAngle: number;
  } | null>(null);

  function gestureSnapshot() {
    const pts = Array.from(pointersRef.current.values());
    if (pts.length === 1) {
      gestureRef.current = {
        start: settingsRef.current,
        startMid: pts[0],
        startDist: 0,
        startAngle: 0,
      };
    } else if (pts.length >= 2) {
      const [a, b] = pts;
      gestureRef.current = {
        start: settingsRef.current,
        startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        startDist: Math.hypot(b.x - a.x, b.y - a.y),
        startAngle: Math.atan2(b.y - a.y, b.x - a.x),
      };
    } else {
      gestureRef.current = null;
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (locked || !imageSrc) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gestureSnapshot();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (locked || !imageSrc) return;
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gestureRef.current;
    if (!g) return;
    const pts = Array.from(pointersRef.current.values());
    if (pts.length === 1) {
      const dx = pts[0].x - g.startMid.x;
      const dy = pts[0].y - g.startMid.y;
      updateSettings({ ...g.start, x: g.start.x + dx, y: g.start.y + dy });
    } else if (pts.length >= 2) {
      const [a, b] = pts;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const scale = Math.min(
        12,
        Math.max(0.05, g.start.scale * (dist / Math.max(1, g.startDist)))
      );
      const rotation =
        g.start.rotation + ((angle - g.startAngle) * 180) / Math.PI;
      updateSettings({
        ...g.start,
        x: g.start.x + (mid.x - g.startMid.x),
        y: g.start.y + (mid.y - g.startMid.y),
        scale,
        rotation,
      });
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointersRef.current.delete(e.pointerId);
    gestureSnapshot();
  }

  // ---- recording (camera stream only — overlay is never captured) ----
  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    const mime = pickRecorderMime();
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    } catch {
      setCameraError("Recording isn't supported in this browser.");
      return;
    }
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const type = recorder.mimeType || "video/mp4";
      const blob = new Blob(chunksRef.current, { type });
      const ext = type.includes("mp4") ? "mp4" : "webm";
      setClip({ blob, url: URL.createObjectURL(blob), ext });
      setRecording(false);
      setRecSeconds(0);
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    };
    recorder.start(1000);
    recorderRef.current = recorder;
    setRecording(true);
    setRecSeconds(0);
    recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  async function shareClip() {
    if (!clip) return;
    const file = new File([clip.blob], `sketch-${Date.now()}.${clip.ext}`, {
      type: clip.blob.type,
    });
    const nav = navigator as Navigator & {
      canShare?: (d: { files: File[] }) => boolean;
    };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {}
    }
    const a = document.createElement("a");
    a.href = clip.url;
    a.download = file.name;
    a.click();
  }

  function discardClip() {
    if (clip) URL.revokeObjectURL(clip.url);
    setClip(null);
  }

  async function snapshot() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.92)
    );
    if (!blob) return;
    const file = new File([blob], `sketch-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    const nav = navigator as Navigator & {
      canShare?: (d: { files: File[] }) => boolean;
    };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {}
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  const s = settings;
  const filter = `${s.bw ? "grayscale(1) " : ""}${s.invert ? "invert(1) " : ""}`.trim();
  const fmt = (n: number) =>
    `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

  const btn = (active = false) =>
    `px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
      active
        ? "bg-white text-black"
        : "bg-black/50 text-white border border-white/25"
    }`;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden select-none touch-none">
      {/* camera feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* reference overlay */}
      {imageSrc && (
        <div
          className="absolute inset-0"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%,-50%) translate(${s.x}px,${s.y}px) rotate(${s.rotation}deg) scale(${s.scale})`,
              opacity: s.opacity,
              willChange: "transform, opacity",
            }}
          >
            <div className="flex items-center" style={{ filter }}>
              {s.mirror && (
                <img
                  src={imageSrc}
                  alt=""
                  draggable={false}
                  className="pointer-events-none"
                  style={{ width: "70vmin", maxWidth: "none", transform: "scaleX(-1)" }}
                />
              )}
              <img
                src={imageSrc}
                alt=""
                draggable={false}
                className="pointer-events-none"
                style={{ width: "70vmin", maxWidth: "none" }}
              />
            </div>
            {s.mirror && (
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none"
                style={{ background: "rgba(0,255,200,0.7)" }}
              />
            )}
          </div>
        </div>
      )}

      {/* grid */}
      {s.grid && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {[1, 2, 3].map((i) => (
            <line
              key={`v${i}`}
              x1={`${i * 25}%`}
              y1="0"
              x2={`${i * 25}%`}
              y2="100%"
              stroke={i === 2 ? "#00ffc8" : "#ffffff"}
              strokeWidth={i === 2 ? 1.5 : 0.5}
            />
          ))}
          {[1, 2, 3].map((i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={`${i * 25}%`}
              x2="100%"
              y2={`${i * 25}%`}
              stroke={i === 2 ? "#00ffc8" : "#ffffff"}
              strokeWidth={i === 2 ? 1.5 : 0.5}
            />
          ))}
        </svg>
      )}

      {/* camera error */}
      {cameraError && (
        <div className="absolute inset-x-4 top-1/3 rounded-2xl bg-neutral-900/95 border border-neutral-700 p-4 text-center">
          <p className="text-white text-sm">{cameraError}</p>
          <button className={`${btn()} mt-3`} onClick={() => startCamera()}>
            Retry camera
          </button>
        </div>
      )}

      {/* hidden-UI restore button */}
      {uiHidden && (
        <button
          aria-label="Show controls"
          onClick={() => setUiHidden(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 border border-white/30"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        />
      )}

      {!uiHidden && (
        <>
          {/* top bar: lenses, zoom, record */}
          <div
            className="absolute inset-x-0 top-0 p-3 flex flex-col gap-2"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
          >
            <div className="flex items-center gap-2 overflow-x-auto">
              {devices.map((d, i) => (
                <button
                  key={d.deviceId || i}
                  className={btn(d.deviceId === activeDeviceId)}
                  onClick={() => startCamera(d.deviceId)}
                >
                  {friendlyLensLabel(d.label, i)}
                </button>
              ))}
              <div className="flex-1" />
              <button
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  recording ? "bg-red-600 text-white" : "bg-black/50 text-red-400 border border-red-400/60"
                }`}
                onClick={recording ? stopRecording : startRecording}
              >
                {recording ? `■ ${fmt(recSeconds)}` : "● REC"}
              </button>
              <button className={btn()} onClick={() => setUiHidden(true)}>
                Hide
              </button>
            </div>
            {zoomCaps && (
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span>Zoom</span>
                <input
                  type="range"
                  min={zoomCaps.min}
                  max={zoomCaps.max}
                  step={zoomCaps.step}
                  value={zoom}
                  onChange={(e) => applyZoom(Number(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="w-8 text-right">{zoom.toFixed(1)}×</span>
              </div>
            )}
          </div>

          {/* bottom bar: opacity + toggles */}
          <div
            className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
          >
            {imageSrc && (
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span>Opacity</span>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.01}
                  value={s.opacity}
                  onChange={(e) =>
                    updateSettings({ ...s, opacity: Number(e.target.value) })
                  }
                  className="flex-1 accent-white"
                />
                <span className="w-9 text-right">
                  {Math.round(s.opacity * 100)}%
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button className={btn()} onClick={() => fileInputRef.current?.click()}>
                {imageSrc ? "Image" : "Add image"}
              </button>
              {imageSrc && (
                <>
                  <button
                    className={btn(locked)}
                    onClick={() => setLocked(!locked)}
                  >
                    {locked ? "🔒 Locked" : "🔓 Lock"}
                  </button>
                  <button
                    className={btn(s.mirror)}
                    onClick={() => updateSettings({ ...s, mirror: !s.mirror })}
                  >
                    Mirror
                  </button>
                  <button
                    className={btn(s.bw)}
                    onClick={() => updateSettings({ ...s, bw: !s.bw })}
                  >
                    B&W
                  </button>
                  <button
                    className={btn(s.invert)}
                    onClick={() => updateSettings({ ...s, invert: !s.invert })}
                  >
                    Invert
                  </button>
                </>
              )}
              <button
                className={btn(s.grid)}
                onClick={() => updateSettings({ ...s, grid: !s.grid })}
              >
                Grid
              </button>
              <button className={btn()} onClick={snapshot}>
                Photo
              </button>
              {imageSrc && (
                <button
                  className={btn()}
                  onClick={() =>
                    updateSettings({
                      ...s,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotation: 0,
                    })
                  }
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* recording indicator when UI hidden */}
      {uiHidden && recording && (
        <div
          className="absolute top-4 left-4 flex items-center gap-1.5 text-red-400 text-xs font-semibold"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {fmt(recSeconds)}
        </div>
      )}

      {/* finished clip modal */}
      {clip && (
        <div className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-4">
            <p className="text-white font-medium mb-2">Recording ready</p>
            <video
              src={clip.url}
              controls
              playsInline
              className="w-full rounded-xl bg-black max-h-64 object-contain"
            />
            <p className="text-neutral-400 text-xs mt-2">
              Only the camera view was recorded — the overlay isn&apos;t in the
              video. Share → Save Video puts it in Photos for CapCut.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 rounded-xl bg-white text-black font-medium py-2.5"
                onClick={shareClip}
              >
                Save / Share
              </button>
              <button
                className="flex-1 rounded-xl bg-neutral-800 text-white py-2.5"
                onClick={discardClip}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickImage}
      />
    </div>
  );
}
