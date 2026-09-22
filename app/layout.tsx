import { Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased font-sans", inter.variable)}
    >
      <body className="font-sans bg-[#f8fafc] text-slate-900">
        <ThemeProvider defaultTheme="light" enableSystem={false} forcedTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
