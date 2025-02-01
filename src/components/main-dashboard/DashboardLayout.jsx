import { SidebarMenu } from "./SidebarMenu.jsx"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {useState} from "react";
import {Outlet} from "react-router-dom";

export function DashboardLayout() { // No children prop needed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-64 overflow-y-auto border-r bg-gray-50 dark:bg-gray-900 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block fixed inset-y-0 left-0 z-40`}>
                <SidebarMenu />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* ... (Mobile header and backdrop remain the same) ... */}


                <main className={`flex-1 overflow-y-auto p-4 transition-transform duration-300 ease-in-out md:static ${isMobileMenuOpen ? 'md:translate-x-64' : ''} lg:ml-72`}>  {/* Restored and updated main */}
                    <Outlet /> {/* Outlet renders the child route components */}
                </main>


            </div>
        </div>
    )
}