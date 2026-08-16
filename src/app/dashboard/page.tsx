export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Metrics coming soon
          </h3>
          <p className="text-sm text-muted-foreground">
            This dashboard will contain system health and reconciliation stats in v1.
          </p>
        </div>
      </div>
    </div>
  );
}
