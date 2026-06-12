import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR, Nanum_Myeongjo } from "next/font/google";
import { STAGE } from "@/lib/chapters";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

const myeongjo = Nanum_Myeongjo({
  variable: "--font-myeongjo",
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: `${STAGE.prologue.title} — ${STAGE.siteTitle}`,
  description:
    "야간 자율학습이 끝난 밤, 한 학생이 교실에서 사라졌다. 그날 무슨 일이 있었는지 추적하라. — An interactive prologue.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geistMono.variable} ${noto.variable} ${myeongjo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
