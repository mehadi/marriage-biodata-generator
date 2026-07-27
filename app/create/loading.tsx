import { Card } from '@/components/ui/Card';
import { SkeletonCard, SkeletonInput } from '@/components/ui/Skeleton';

export default function CreateLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
            </div>
          </Card>
          <Card>
            <div className="space-y-4">
              <SkeletonInput />
              <SkeletonInput />
            </div>
          </Card>
        </div>
        <SkeletonCard className="h-fit" />
      </div>
    </div>
  );
}
