import { DemoAuthForm } from "@/components/info/demo-forms";
export const metadata = {
  title: "Sign in",
  description: "Sign in to your Styleco account.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <DemoAuthForm />
    </main>
  );
}
