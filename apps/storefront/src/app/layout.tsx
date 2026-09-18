import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommerceProvider } from "@/components/commerce-provider";
import { getServices } from "@/services/container";
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
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await getServices().catalog.getProducts();
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CommerceProvider products={products}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CommerceProvider>
      </body>
    </html>
  );
}
