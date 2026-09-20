import { DemoAuthForm } from "@/components/info/demo-forms";
export const metadata = {
  title: "Create an account",
  description: "Create your Styleco account and keep your favourites close.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <DemoAuthForm register />
    </main>
  );
}
