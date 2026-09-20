export default function AdminLoading() {
  return (
    <div className="admin-loading-screen" aria-busy="true">
      <span className="admin-loading-mark" aria-hidden="true">
        S
      </span>
      <p>Loading workspace…</p>
    </div>
  );
}
