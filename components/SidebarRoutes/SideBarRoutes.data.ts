import { CalendarPlus, ClipboardEdit, FileEdit, FilePlus, FileText, LucideArrowLeftRight, UserPlus2, UserRoundPenIcon, UserRoundPlusIcon, UserX2Icon } from "lucide-react";

export const DataUsuarioSiderBar = [
    {
        icon: UserRoundPlusIcon,
        label: "Nuevo Usuario",
        href: "/dashboard/Usuario/nuevo-usuario",
    },
    {
        icon: UserRoundPenIcon,
        label: "Gestionar Usuario",
        href: "/dashboard/Usuario/gestionar-usuario",
    },
];

export const DataCategoriaSiderBar = [
    {
        icon: FilePlus,
        label: "Nueva categoria",
        href: "/dashboard/Categoria/nueva-categoria",
    },
    {
        icon: ClipboardEdit,
        label: "Gestionar categoria",
        href: "/dashboard/Categoria/gestionar-categoria",
    },
];

export const DataProductosSiderBar = [
    {
        icon: FilePlus,
        label: "Nuevo Productos",
        href: "/dashboard/Productos/nuevo-productos",
    },
    {
        icon: FileEdit,
        label: "Gestionar Productos",
        href: "/dashboard/Productos/gestionar-productos",
    },
    {
        icon: CalendarPlus,
        label: "ACTUALIZAR STOCK",
        href: "/dashboard/Productos/actualizar-stock",
    },
];

export const DataClientesSiderBar = [
    {
        icon: UserPlus2,
        label: "Nuevo Cliente",
        href: "/dashboard/Clientes/nuevo-cliente",
    },
    {
        icon: UserX2Icon,
        label: "Gestionar Cliente",
        href: "/dashboard/Clientes/gestionar-cliente",
    },
];

export const DataFacturarSiderBar = [
    {
        icon: FileText,
        label: "Nueva Venta",
        href: "/dashboard/Facturar/nueva-venta",
    },
    {
        icon: LucideArrowLeftRight,
        label: "Gestionar Ventas",
        href: "/dashboard/Facturar/gestionar-ventas",
    },
];