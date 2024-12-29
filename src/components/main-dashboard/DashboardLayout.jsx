import { SidebarMenu } from "./SidebarMenu.jsx"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden w-64 overflow-y-auto border-r bg-gray-50 dark:bg-gray-900 md:block">
                <SidebarMenu />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="border-b bg-white p-4 dark:bg-gray-800 md:hidden">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                        <div className="w-6" /> {/* Placeholder for balance */}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
        </div>
    )
}
