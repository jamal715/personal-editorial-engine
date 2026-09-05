import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noshaba Nasir — Research & Analysis",
  description: "Independent research, analysis and data stories."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
