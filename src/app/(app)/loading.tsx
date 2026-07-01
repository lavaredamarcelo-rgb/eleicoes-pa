import { Skeleton, SkeletonList } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-56" />
      <SkeletonList rows={6} />
    </div>
  );
}
