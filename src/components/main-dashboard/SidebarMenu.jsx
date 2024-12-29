import { SidebarMenuItem } from "./SidebarMenuItem.jsx"
import { UserProfile } from "./UserProfile.jsx"
import {
    LayoutDashboard,
    Image,
    Calendar,
    Users,
    DollarSign,
    MessageSquare,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react"

const menuItems = [
    { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard" },
    { icon: Image, title: "Gallery", href: "/dashboard/gallery" },
    { icon: Calendar, title: "Events", href: "/dashboard/events" },
    { icon: Users, title: "Users", href: "/dashboard/users" },
    { icon: DollarSign, title: "Donations", href: "/dashboard/donations" },
    { icon: MessageSquare, title: "Messages", href: "/dashboard/messages" },
    { icon: Settings, title: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, title: "Help Center", href: "/dashboard/help" },
    { icon: LogOut, title: "Log Out", href: "/logout" }
]

export function SidebarMenu() {
    return (
        <div className="flex h-full flex-col justify-between">
            <nav className="space-y-1 px-2 py-4">
                {menuItems.map(item => (
                    <SidebarMenuItem key={item.href} {...item} />
                ))}
            </nav>
            <div className="border-t">
                <UserProfile name="John Doe" image="/placeholder.svg" />
            </div>
        </div>
    )
}
