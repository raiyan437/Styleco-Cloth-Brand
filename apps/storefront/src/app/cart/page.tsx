import { CartContents } from "@/components/shopping/cart-contents";
import { Breadcrumb } from "@/components/ui/shared";
export const metadata = { title: "Your Bag" };
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <Breadcrumb items={[{ label: "Your bag" }]} />
      <header className="page-heading">
        <p className="text-eyebrow">GREAT TASTE, BY THE WAY</p>
        <h1>
          Your bag<span className="orange-period">.</span>
        </h1>
      </header>
      <CartContents />
    </main>
  );
}
