"use client";

import { Activity, Clock3, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/admin/admin-provider";
import { AdminButton, AdminPageHeader } from "@/components/admin/admin-ui";

export default function AdminActivityLogPage() {
  const { snapshot, updateSnapshot } = useAdmin();

  function clearLog() {
    if (!window.confirm("Clear the local activity log?")) return;
    updateSnapshot((current) => ({ ...current, activity: [] }));
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Workspace / Activity"
        title="A clear trail of changes."
        description="Every local edit is recorded here so the future server audit trail has a familiar home."
        action={
          <AdminButton
            variant="danger"
            onClick={clearLog}
            disabled={!snapshot.activity.length}
          >
            <Trash2 size={15} /> Clear log
          </AdminButton>
        }
      />
      <div className="admin-demo-notice">
        <span className="admin-notice-mark">
          <Activity size={15} />
        </span>
        <div>
          <strong>Browser-only audit trail</strong>
          <p>
            This log is local to the current browser and will be replaced by an
            Appwrite-backed audit repository.
          </p>
        </div>
        <span className="admin-notice-state">
          {snapshot.activity.length} entries
        </span>
      </div>
      <section className="admin-panel admin-activity-page-panel">
        {snapshot.activity.length === 0 ? (
          <div className="admin-empty-state">
            <Activity size={25} />
            <h2>No activity yet</h2>
            <p>Changes to content and settings will appear here.</p>
          </div>
        ) : (
          <div className="admin-full-activity-list">
            {snapshot.activity.map((item) => (
              <article key={item.id} className="admin-full-activity-row">
                <span className="admin-activity-icon">
                  <Activity size={16} />
                </span>
                <div>
                  <strong>{item.action}</strong>
                  <p>{item.detail}</p>
                  <small>{item.entity}</small>
                </div>
                <time dateTime={item.createdAt}>
                  <Clock3 size={14} />
                  {new Date(item.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
