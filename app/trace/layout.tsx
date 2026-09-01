import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Trace Studio",
  description: "Personal camera tracing and projection tool.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function TraceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
