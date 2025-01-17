"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/navbar";
import { TextProvider } from "./Context/text-context";
import { MarkdownProvider } from "./Context/markdown-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white h-screen`}
      >
        <MarkdownProvider>
          <TextProvider>
            <NavBar />
            {children}
          </TextProvider>
        </MarkdownProvider>
      </body>
    </html>
  );
}
