import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";
export const metadata: Metadata = {
  title: {
    default: "Styleco — Good clothes. Great days.",
    template: "%s | Styleco",
  },
  description:
    "Considered clothing for your everyday. Discover shirts, Katua, tees, pants and sleepwear from Styleco.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
