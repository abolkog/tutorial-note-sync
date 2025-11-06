import { AppSidebar } from '@/components/app-sidebar';
import Editor from '@/components/editor';
import { MainPageSkeleton } from '@/components/pages/MainPageSkeleton';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAppData } from '@/hooks/useAppData';

export default function MainPage() {
  const { isLoading } = useAppData();

  if (isLoading) {
    return <MainPageSkeleton />;
  }
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Editor />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
