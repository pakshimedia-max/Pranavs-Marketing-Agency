import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pranavs Marketing Agency",
  description:
    "Pranavs Marketing Agency plans, creates, and manages Facebook and Instagram ad campaigns for businesses. Request a meeting to talk about yours.",
  openGraph: {
    title: "Pranavs Marketing Agency",
    description:
      "Facebook and Instagram ad campaigns that introduce your business to new customers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1230",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#meeting" className="skip-link">Skip to meeting request form</a>
        {children}
      </body>
    </html>
  );
}
