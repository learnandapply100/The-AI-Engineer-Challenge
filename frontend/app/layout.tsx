import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mental Coach",
  description: "A supportive AI mental coach, powered by a FastAPI backend.",
};

/** Root layout: wraps every page in the app. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
