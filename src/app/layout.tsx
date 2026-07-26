import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Reef — Personal Site & Portfolio",
  description: "Hey, I'm Reef. I build things, break things, and occasionally sleep. Welcome to my little corner of the internet.",
  keywords: ["reef", "portfolio", "minecraft", "developer", "personal site"],
  openGraph: {
    title: "Reef — Personal Site & Portfolio",
    description: "Hey, I'm Reef. I build things, break things, and occasionally sleep.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
