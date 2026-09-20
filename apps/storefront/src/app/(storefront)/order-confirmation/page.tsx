import { OrderConfirmation } from "@/components/shopping/order-confirmation";
export const metadata = {
  title: "Order confirmed",
  description: "Review your Styleco order confirmation.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <OrderConfirmation />
    </main>
  );
}
