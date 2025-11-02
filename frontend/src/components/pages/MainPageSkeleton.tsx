import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const SidebarSkeleton = () => (
  <div className="flex flex-col space-y-1 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-3 w-[30px]" />
    </div>

    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-3 w-4/5" />
  </div>
);

const MainAreaSkeleton = () => (
  <div className="p-8 space-y-6">
    {/* Subject Line */}
    <Skeleton className="h-10 w-3/4" />

    {/* Sender/Recipient Info */}
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>

    <Separator />

    {/* Body Paragraphs */}
    <div className="space-y-3 pt-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[95%]" />
      <Skeleton className="h-4 w-[98%]" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[85%]" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export function MainPageSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-col w-[300px] border-r">
        <div className="p-4 border-b flex space-x-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>

        <div className="p-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 15 }).map((_, i) => (
            <SidebarSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card">
        <MainAreaSkeleton />
      </div>
    </div>
  );
}
