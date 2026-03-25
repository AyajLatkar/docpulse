import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-20 h-8 rounded-lg" />
      <Skeleton className="w-32 h-4 rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-40 h-4 rounded" />
        <Skeleton className="w-24 h-3 rounded" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
  );
}
