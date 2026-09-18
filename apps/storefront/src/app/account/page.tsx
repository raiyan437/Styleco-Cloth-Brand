import { Account } from "@/components/info/account";
export const metadata = { title: "Your Account Preview" };
export default function Page() {
  return (
    <main id="main-content" className="site-container page-space">
      <header className="page-heading">
        <p className="text-eyebrow">YOUR LITTLE CORNER OF STYLECO</p>
        <h1>
          Make yourself at home<span className="orange-period">.</span>
        </h1>
      </header>
      <Account />
    </main>
  );
}
