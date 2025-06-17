import { SidebarRoutes } from "../SidebarRoutes/SidebarRoutes";
import React from "react";

export default function Sidebar() {
  return (
    <div className="h-screen flex">
      <div className="h-full flex flex-col border-r w-60">
        <SidebarRoutes />
      </div>
    </div>
  )
}
