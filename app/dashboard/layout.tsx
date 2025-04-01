import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Suspense } from "react"

import data from "./data.json"

export default function Layout({children}:Readonly<{
    children: React.ReactNode;
  }>) {
  // const getProfile = async ()=>{
  //   const res = await fetch('/api/profile',{credentials:"include"});
  //   const data = await res.json();
  //   return data
  // }
  // const profile = getProfile();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      
      <AppSidebar variant="inset"  />
    
      
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
