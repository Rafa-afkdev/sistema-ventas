"use client";

import React from "react";
import {
  DataUsuarioSiderBar,
  DataCategoriaSiderBar,
  DataProductosSiderBar,
  DataClientesSiderBar,
  DataFacturarSiderBar
} from "./SideBarRoutes.data";
import SidebarItem from "../SidebarItem/SidebarItem";
import { Separator } from "../ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Users, ClipboardEdit, FileText, UsersRound, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export function SidebarRoutes() {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-1 overflow-y-auto p-2 md:p-4">
        <Accordion type="multiple" className="w-full space-y-2">
          {/* Usuarios */}
          <AccordionItem value="usuarios" className="group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.30 }} whileDrag={{ scale: 0.9, rotate: 10 }}>
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:no-underline hover:bg-blue-50 dark:hover:bg-slate-700 [&[data-state=open]]:bg-blue-100 [&[data-state=open]]:dark:bg-slate-600">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 group-data-[state=open]:text-blue-700 dark:group-data-[state=open]:text-blue-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Usuarios</span>
              </AccordionTrigger>
            </motion.div>
            <AccordionContent className="pl-3 pt-2 space-y-2">
              {DataUsuarioSiderBar.map((item) => (
                <SidebarItem key={item.label} item={item} className="px-3 py-2 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
              ))}
            </AccordionContent>
          </AccordionItem>
          <Separator className="my-3 bg-slate-200 dark:bg-slate-700" />
          {/* Categorías */}
          <AccordionItem value="categorias" className="group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.30 }} whileDrag={{ scale: 0.9, rotate: 10 }}>
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:no-underline hover:bg-green-50 dark:hover:bg-slate-700 [&[data-state=open]]:bg-green-100 [&[data-state=open]]:dark:bg-slate-600">
                <ClipboardEdit className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-green-700 group-data-[state=open]:text-green-700 dark:group-data-[state=open]:text-green-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Categorías</span>
              </AccordionTrigger>
            </motion.div>
            <AccordionContent className="pl-3 pt-2 space-y-2">
              {DataCategoriaSiderBar.map((item) => (
                <SidebarItem key={item.label} item={item} className="px-3 py-2 text-sm rounded-md hover:bg-green-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
              ))}
            </AccordionContent>
          </AccordionItem>
          <Separator className="my-3 bg-slate-200 dark:bg-slate-700" />
          {/* Productos */}
          <AccordionItem value="productos" className="group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.30 }} whileDrag={{ scale: 0.9, rotate: 10 }}>
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:no-underline hover:bg-purple-50 dark:hover:bg-slate-700 [&[data-state=open]]:bg-purple-100 [&[data-state=open]]:dark:bg-slate-600">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 group-data-[state=open]:text-purple-700 dark:group-data-[state=open]:text-purple-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Productos</span>
              </AccordionTrigger>
            </motion.div>
            <AccordionContent className="pl-3 pt-2 space-y-2">
              {DataProductosSiderBar.map((item) => (
                <SidebarItem key={item.label} item={item} className="px-3 py-2 text-sm rounded-md hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
              ))}
            </AccordionContent>
          </AccordionItem>
          <Separator className="my-3 bg-slate-200 dark:bg-slate-700" />
          {/* Clientes */}
          <AccordionItem value="clientes" className="group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.30 }} whileDrag={{ scale: 0.9, rotate: 10 }}>
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:no-underline hover:bg-orange-50 dark:hover:bg-slate-700 [&[data-state=open]]:bg-orange-100 [&[data-state=open]]:dark:bg-slate-600">
                <UsersRound className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 group-data-[state=open]:text-orange-700 dark:group-data-[state=open]:text-orange-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Clientes</span>
              </AccordionTrigger>
            </motion.div>
            <AccordionContent className="pl-3 pt-2 space-y-2">
              {DataClientesSiderBar.map((item) => (
                <SidebarItem key={item.label} item={item} className="px-3 py-2 text-sm rounded-md hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
              ))}
            </AccordionContent>
          </AccordionItem>
          <Separator className="my-3 bg-slate-200 dark:bg-slate-700" />
          {/* Facturación */}
          <AccordionItem value="facturacion" className="group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.30 }} whileDrag={{ scale: 0.9, rotate: 10 }}>
              <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:no-underline hover:bg-blue-50 dark:hover:bg-slate-700 [&[data-state=open]]:bg-blue-100 [&[data-state=open]]:dark:bg-slate-600">
                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 group-data-[state=open]:text-blue-700 dark:group-data-[state=open]:text-blue-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Facturación</span>
              </AccordionTrigger>
            </motion.div>
            <AccordionContent className="pl-3 pt-2 space-y-2">
              {DataFacturarSiderBar.map((item) => (
                <SidebarItem key={item.label} item={item} className="px-3 py-2 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}