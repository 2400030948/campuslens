export default function Loading() {
  return (
    <main className="container-page py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading CampusLens</span>
      <div className="h-3 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded bg-line" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-56 animate-pulse rounded border border-line bg-paper-raised" />
        ))}
      </div>
    </main>
  );
}
