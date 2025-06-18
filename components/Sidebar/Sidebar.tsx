import React from "react";
import { SidebarRoutes } from "../SidebarRoutes/SidebarRoutes";

export default function Sidebar() {
  return (
    <div className="h-screen flex">
      <div className="h-full flex flex-col border-r w-60">
        <SidebarRoutes />
      </div>
    </div>
  )
}