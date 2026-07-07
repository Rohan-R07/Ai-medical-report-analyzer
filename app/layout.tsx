import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Medical Report Analyzer | Smart Blood Work Insights",
  description:
    "Upload your blood test report PDF and get instant, detailed, AI-powered medical insights, customized diet plans, and health recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#040814] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
        {/* Glow Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="glow-blob w-[500px] h-[500px] bg-sky-500/10 top-[-10%] left-[-10%]" />
          <div className="glow-blob w-[600px] h-[600px] bg-indigo-500/10 bottom-[-10%] right-[-10%]" />
          <div className="glow-blob w-[400px] h-[400px] bg-violet-600/5 top-[30%] right-[10%]" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
