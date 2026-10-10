import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Mono, Spectral } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false,
});

const body = Spectral({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Housely — The rent register for Bangladesh",
    template: "%s · Housely",
  },
  description:
    "Browse vacant flats, hand your details to owners, sign a lease, and pay rent by bKash. One register for tenants and property owners across Bangladesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
