import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import { StoreProvider } from "@/lib/store";

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
        <StoreProvider>
          <Nav />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <BottomNav />
          <footer
            className="hidden md:block border-t py-6 text-center text-sm"
            style={{ borderColor: "var(--line)", color: "var(--muted)" }}
          >
            © 2026 Forever Closet AI · Build less. Wear more. Shop intentionally.
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
