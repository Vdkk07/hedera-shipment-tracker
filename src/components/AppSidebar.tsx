"use client"

import * as React from "react"
import { Plus, Search, Package, Home } from "lucide-react"
import {
  SidebarProvider as AppSidebarProvider,
  SidebarInset,
  SidebarTrigger as AppSidebarTrigger,
  SidebarContent as AppSidebarContent,
  SidebarGroup as AppSidebarGroup,
  SidebarGroupLabel as AppSidebarGroupLabel,
  SidebarGroupContent as AppSidebarGroupContent,
  SidebarMenu as AppSidebarMenu,
  SidebarMenuItem as AppSidebarMenuItem,
  SidebarMenuButton as AppSidebarMenuButton,
  SidebarHeader as AppSidebarHeader,
  SidebarFooter as AppSidebarFooter,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Create Shipmentzz",
      url: "/dashboard/create-shipment",
      icon: Plus,
      isActive: true,
    },
    {
      title: "Check Status",
      url: "/dashboard?tab=status",
      icon: Search,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof AppSidebarProvider>) {
  return (
    <AppSidebarProvider {...props}>
      <AppSidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6" />
          <span className="text-lg font-semibold">Hedera Tracker</span>
        </div>
      </AppSidebarHeader>
      <AppSidebarContent>
        <AppSidebarGroup>
          <AppSidebarGroupLabel>Navigation</AppSidebarGroupLabel>
          <AppSidebarGroupContent>
            <AppSidebarMenu>
              {data.navMain.map((item) => (
                <AppSidebarMenuItem key={item.title}>
                  <AppSidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </AppSidebarMenuButton>
                </AppSidebarMenuItem>
              ))}
            </AppSidebarMenu>
          </AppSidebarGroupContent>
        </AppSidebarGroup>
      </AppSidebarContent>
      <AppSidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Hedera Shipment Tracker v1.0
        </div>
      </AppSidebarFooter>
    </AppSidebarProvider>
  )
}


