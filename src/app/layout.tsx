import "./globals.css";
import "antd/dist/reset.css";
import { Providers } from "./providers";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>NimeList</title>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body>
        <Script src="/api/env" strategy={"beforeInteractive"}></Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
