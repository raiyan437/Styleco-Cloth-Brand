"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main id="main-content" className="site-container empty-state">
      <h1>A little pause in the story.</h1>
      <p>We couldn’t load this page. Give it another try.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
