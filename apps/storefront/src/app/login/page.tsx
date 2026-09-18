import { DemoAuthForm } from "@/components/info/demo-forms";
export const metadata = { title: "Sign In Preview" };
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <DemoAuthForm />
    </main>
  );
}
