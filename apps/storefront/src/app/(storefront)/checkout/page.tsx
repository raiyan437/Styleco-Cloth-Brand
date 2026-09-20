import { Checkout } from "@/components/shopping/checkout";
import { Breadcrumb } from "@/components/ui/shared";
export const metadata = {
  title: "Checkout",
  description: "Complete your Styleco order securely.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <Breadcrumb
        items={[{ label: "Your bag", href: "/cart" }, { label: "Checkout" }]}
      />
      <header className="page-heading">
        <p className="text-eyebrow">ONE LAST THING</p>
        <h1>
          Make it yours<span className="orange-period">.</span>
        </h1>
      </header>
      <Checkout />
    </main>
  );
}
