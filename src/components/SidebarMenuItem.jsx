"use client"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SidebarMenuItem({ icon: Icon, title, onClick, className }) {
    const location = useLocation()
    const isActive =
        location.pathname === `/dashboard/${title.toLowerCase()}` ||
        (title === "Dashboard" && location.pathname === "/dashboard/main") ||
        (title === "Home" && location.pathname === "/")

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 list-none",
                isActive
                    ? "bg-amber-100 font-medium text-amber-900"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-800",
                className
            )}
        >
            <Icon
                className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-amber-700" : "text-gray-500"
                )}
            />
            <span>{title}</span>

            {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-amber-400"></div>
            )}
        </button>
    )
}