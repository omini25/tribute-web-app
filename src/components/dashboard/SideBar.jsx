import Link from "next/link"
import {
    LayoutDashboard,
    Gift,
    ImageIcon,
    Calendar,
    Users,
    DollarSign,
    MessageSquare,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react"

export function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-blue-500 text-white p-4">
            <div className="mb-8">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-blue-500">
                    LOGO
                </div>
            </div>

            <nav className="space-y-2">
                <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />}>
                    DASHBOARD
                </NavItem>
                <NavItem href="/tributes" icon={<Gift size={20} />}>
                    TRIBUTES
                </NavItem>
                <NavItem href="/gallery" icon={<ImageIcon size={20} />}>
                    GALLERY
                </NavItem>
                <NavItem href="/events" icon={<Calendar size={20} />}>
                    EVENTS
                </NavItem>
                <NavItem href="/users" icon={<Users size={20} />}>
                    USERS
                </NavItem>
                <NavItem href="/donations" icon={<DollarSign size={20} />}>
                    DONATIONS
                </NavItem>
                <NavItem href="/messages" icon={<MessageSquare size={20} />}>
                    MESSAGES
                </NavItem>
                <NavItem href="/settings" icon={<Settings size={20} />}>
                    SETTINGS
                </NavItem>
                <NavItem href="/help" icon={<HelpCircle size={20} />}>
                    HELP CENTER
                </NavItem>
                <NavItem href="/logout" icon={<LogOut size={20} />}>
                    LOG OUT
                </NavItem>
            </nav>

            <div className="absolute bottom-8 left-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full" />
                <div>
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs opacity-75">ADMIN</div>
                </div>
            </div>
        </div>
    )
}

function NavItem({ href, icon, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-blue-600 rounded-lg transition-colors"
        >
            {icon}
            {children}
        </Link>
    )
}
