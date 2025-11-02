'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/react-router';
import { useAppData } from '@/hooks/useAppData';
import { Button } from './ui/button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoadingMore, loadMore } = useAppData();

  return (
    <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    NS
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <UserButton />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">Notes</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {data?.notes.map((note) => (
                <a
                  href="#"
                  key={note.noteId}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium">{note.title}</span>{' '}
                    <span className="ml-auto text-xs">
                      {new Date(note.createdAt).toLocaleDateString('en-UK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="line-clamp-2 w-[260px] text-sm whitespace-break-spaces">
                    {note.content.length > 70 ? `${note.content.substring(0, 70)} ...` : note.content}
                  </span>
                </a>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
          {data?.lastKey && (
            <Button variant="outline" disabled={isLoadingMore} onClick={loadMore}>
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
