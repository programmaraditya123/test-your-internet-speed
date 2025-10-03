import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Your Internet Speed Online – Fast & Accurate",
  description: "Check your internet speed online instantly. Measure download, upload, ping, and get the best server recommendations.",
  keywords: ["internet speed test", "speed test online", "check download speed", "upload speed test", "ping test"],
  authors: [{ name: "KnowledgePoll" }],
  openGraph: {
    title: "Test Your Internet Speed Online – Fast & Accurate",
    description: "Check your internet speed online instantly. Measure download, upload, ping, and get the best server recommendations.",
    url: "https://test-your-internet-speed.knowledgepoll.site/",
    siteName: "KnowledgePoll",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Your Internet Speed Online",
    description: "Instantly test your internet speed. Get download, upload, ping, and server details.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
