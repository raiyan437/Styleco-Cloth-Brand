import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="site-container not-found">
      <p className="text-eyebrow">404 / A WRONG TURN, A NEW DISCOVERY</p>
      <h1>
        This look
        <br />
        doesn’t exist<span>.</span>
      </h1>
      <p>But your next favorite definitely does.</p>
      <Link href="/new-arrivals" className="button">
        Find your way back ↗
      </Link>
    </main>
  );
}
