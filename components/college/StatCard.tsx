interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded border border-line bg-paper-raised p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-1.5 font-mono text-xl font-medium text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
