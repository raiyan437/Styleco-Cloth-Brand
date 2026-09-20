import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="admin-error-screen">
      <p className="admin-eyebrow">404 / Admin studio</p>
      <h1>This workspace view does not exist.</h1>
      <Link href="/admin" className="admin-button admin-button-primary">
        Back to overview
      </Link>
    </main>
  );
}
