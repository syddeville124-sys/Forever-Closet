import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Forever Closet AI",
  description: "A sustainable wardrobe intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
          © 2026 Forever Closet AI · Build less. Wear more. Shop intentionally.
        </footer>
      </body>
    </html>
  );
}
