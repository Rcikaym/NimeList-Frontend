import "./globals.css";
import "antd/dist/reset.css";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NimeList",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}