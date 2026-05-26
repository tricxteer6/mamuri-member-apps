export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-md">
      <div className="aspect-16/10 bg-linear-to-br from-zinc-100 to-zinc-50" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-[80%] rounded-lg bg-zinc-200/90" />
        <div className="h-4 w-full rounded-md bg-zinc-100" />
        <div className="h-4 w-2/3 rounded-md bg-zinc-100" />
        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
          <div className="h-4 w-28 rounded-md bg-red-100" />
          <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
