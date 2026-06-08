import "./globals.css";
import { Providers } from "./providers";
import { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import '@ant-design/v5-patch-for-react-19';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const ibmPlex = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "NimeList",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className={`${plusJakarta.variable} ${ibmPlex.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}