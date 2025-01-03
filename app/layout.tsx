import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
