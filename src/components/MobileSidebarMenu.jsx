import { SidebarMenuItem } from "./SidebarMenuItem"
import { UserProfile } from "./UserProfile"
import { LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileSidebarMenu({ isOpen, onClose, menuItems, onLogout }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 md:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="space-y-1">
                    {menuItems.map(item => (
                        <SidebarMenuItem
                            key={item.href}
                            {...item}
                            onClick={() => {
                                onClose()
                                // Navigate to the href
                            }}
                        />
                    ))}
                    <SidebarMenuItem
                        icon={LogOut}
                        title="Log Out"
                        onClick={() => {
                            onClose()
                            onLogout()
                        }}
                        className="mt-auto text-red-400 hover:text-red-300"
                    />
                </nav>
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 px-2 py-4">
                    <UserProfile name="John Doe" image="/placeholder.svg" />
                </div>
            </div>
        </div>
    )
}
