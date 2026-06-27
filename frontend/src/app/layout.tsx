import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@ds/themes/theme.css";
import "./globals.css";
import { ThemeProvider } from "@/components/shell/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CityOS AI — Urban Intelligence OS",
  description:
    "The AI operating system for modern smart cities. Orchestrate an intelligent city.",
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const noFlashScript = `
try {
  var s = localStorage.getItem('cityos-theme');
  var t = s ? JSON.parse(s).state.theme : null;
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
