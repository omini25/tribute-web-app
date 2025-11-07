import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "@/redux/slices/authSlice"
import { AdminSidebarMenuItem } from "./AdminSidebarMenuItem.jsx"
import { AdminUserProfile } from "./AdminUserProfile.jsx"
import {
    LayoutDashboard,
    ImageIcon,
    Calendar,
    DollarSign,
    Settings,
    HelpCircle,
    LogOut,
    MessageSquare,
    Users,
    Home
} from "lucide-react"
import { Link } from "react-router-dom"
import { CandlesBackground } from "../CandlesBackground.jsx"
import { cn } from "@/lib/utils"
import logo from "@/assets/Remember-me-logo.png"

export function AdminSidebarMenu({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userName = JSON.parse(localStorage.getItem("user"))?.name || "User"

    const menuItems = [
        { icon: LayoutDashboard, title: "Dashboard", href: "/admin/dashboard/main" },
        { icon: ImageIcon, title: "Gallery", href: "/admin/dashboard/gallery" },
        { icon: Calendar, title: "Events", href: "/admin/dashboard/events" },
        { icon: MessageSquare, title: "Messages", href: "/admin/dashboard/messages" },
        { icon: Users, title: "Users", href: "/admin/dashboard/users" },
        { icon: DollarSign, title: "Payments", href: "/admin/dashboard/donations" },
        { icon: Home, title: "Themes", href: "/admin/dashboard/themes" },
        { icon: Settings, title: "Settings", href: "/admin/dashboard/settings" },
        // { icon: HelpCircle, title: "Help Center", href: "/admin/dashboard/help" }
    ]

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        dispatch(logout())
        navigate("/")
    }

    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#f8f4f0] text-gray-800">
            {/* Candles Background */}
            <CandlesBackground />

            <div className="relative z-10 flex flex-col h-full">
                {/* Sidebar Header with Logo */}
                <div className="flex flex-col items-center py-6 px-4">
                    <div className="relative mb-2 overflow-hidden rounded-full border-4 border-amber-100 shadow-md">
                        <img
                            src={logo}
                            alt="Remember Me Logo"
                            className="h-24 w-24 "
                        />
                    </div>
                    {/*<h1 className="mt-2 text-xl font-bold text-amber-800">Remember Always</h1>*/}
                    <div className="mt-1 h-1 w-16 rounded-full bg-amber-300"></div>
                </div>

                {/* Menu Items */}
                <div className="scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent flex-1 space-y-1 overflow-y-auto px-4 py-2">
                    <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Navigation
                    </div>

                    {menuItems.slice(0, 3).map(item => (
                        <div className="list-none" key={item.href}>
                            <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <AdminSidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>

                    ))}

                    <div className="my-4 px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Management
                    </div>

                    {menuItems.slice(3, 7).map(item => (
                        <div className="list-none" key={item.href}>
                            <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <AdminSidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>
                    ))}

                    {/*<div className="my-4 px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">*/}
                    {/*    Support*/}
                    {/*</div>*/}

                    {menuItems.slice(7).map(item => (
                        <div className="list-none" key={item.href}>
                            <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <AdminSidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* User Profile and Logout */}
                <div className="relative border-t border-amber-200 bg-amber-50/50 backdrop-blur-sm">
                    <AdminUserProfile
                        name={userName}
                        image="/placeholder.svg"
                        className="p-4"
                    />

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                            "text-red-600 hover:bg-red-50 hover:text-red-700"
                        )}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    )
}