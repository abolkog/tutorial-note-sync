import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@clerk/react-router';
import { useState } from 'react';

export default function MainPage() {
  const { getToken } = useAuth();
  const [token, setToken] = useState('');

  async function handleClick() {
    const value = await getToken();
    if (!value) return;

    setToken(value);
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
          <Button onClick={handleClick}>Get Token</Button>
          <pre>{token}</pre>
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
