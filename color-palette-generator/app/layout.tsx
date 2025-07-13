import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Color Palette Generator",
  description: "Generate beautiful color palettes for your design projects. Create random palettes or use color harmony rules with a seed color.",
  keywords: ["color palette", "color generator", "design tools", "color harmony", "hex colors"],
  authors: [{ name: "Chirag Singhal", url: "https://github.com/chirag127" }],
  creator: "Chirag Singhal",
  openGraph: {
    title: "Color Palette Generator",
    description: "Generate beautiful color palettes for your design projects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
