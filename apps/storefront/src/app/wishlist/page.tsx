import { Wishlist } from "@/components/shopping/wishlist";
export const metadata = { title: "Your Wishlist" };
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <header className="page-heading">
        <p className="text-eyebrow">THE ONES YOU LOVE</p>
        <h1>
          Your wishlist<span className="orange-period">.</span>
        </h1>
      </header>
      <Wishlist />
    </main>
  );
}
