"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="admin-error-screen">
      <p className="admin-eyebrow">Workspace interruption</p>
      <h1>Something needs another look.</h1>
      <p>
        We could not load this Admin surface. Your browser data is still safe.
      </p>
      <button
        type="button"
        className="admin-button admin-button-primary"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
