import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "@/redux/slices/authSlice"
import { SidebarMenuItem } from "../SidebarMenuItem"
import { UserProfile } from "../UserProfile"
import { MobileSidebarMenu } from "../MobileSidebarMenu"
import {
    LayoutDashboard,
    Image,
    Calendar,
    Users,
    DollarSign,
    MessageSquare,
    Settings,
    HelpCircle,
    LogOut,
    Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
    { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard/main" },
    { icon: Image, title: "Gallery", href: "/dashboard/gallery" },
    { icon: Calendar, title: "Events", href: "/dashboard/events" },
    { icon: Users, title: "Users", href: "/dashboard/users" },
    { icon: DollarSign, title: "Donations", href: "/dashboard/donations" },
    { icon: Settings, title: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, title: "Help Center", href: "/dashboard/help" }
]

export function SidebarMenu() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        dispatch(logout())
        navigate("/")
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full flex-col justify-between bg-gray-800 text-gray-100">
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {menuItems.map(item => (
                        <SidebarMenuItem key={item.href} {...item} />
                    ))}
                    <SidebarMenuItem
                        icon={LogOut}
                        title="Log Out"
                        onClick={handleLogout}
                        className="mt-auto text-red-400 hover:text-red-300"
                    />
                </nav>
                <div className="border-t border-gray-700 px-2 py-4">
                    <UserProfile name="John Doe" image="/placeholder.svg" />
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <Button
                    onClick={() => setMobileMenuOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-600"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebarMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                menuItems={menuItems}
                onLogout={handleLogout}
            />
        </>
    )
}
