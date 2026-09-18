import { OrderConfirmation } from "@/components/shopping/order-confirmation";
export const metadata = { title: "Demo Order Confirmed" };
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <OrderConfirmation />
    </main>
  );
}
