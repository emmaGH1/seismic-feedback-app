import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react";

// Primary body font
const inter = Inter({
   subsets: ["latin"], 
   variable: "--font-inter" 
});

// Serif font for headings
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Seismic | Anonymous Feedback",
  description: "Share your thoughts anonymously with the community.",
}

export default function RootLayout({children}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className="dark">
       <body className={`${inter.variable} ${playfair.variable} bg-seismic-black text-seismic-gray antialiased selection:bg-seismic-purple selection:text-white`}>
         {/* add a texture overlay here later */}
         {children}
       </body>
    </html>
  )
}
