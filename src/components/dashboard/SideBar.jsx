import {Link, NavLink, useLocation} from 'react-router-dom';
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

export default function SideBar() {
    const location = useLocation();


    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-primary text-white p-4">
            <div className="mb-8">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-blue-500">
                    LOGO
                </div>
            </div>

            <nav className="space-y-2">
                <NavItem to="/dashboard/overview" icon={<LayoutDashboard size={20} />}>
                    DASHBOARD
                </NavItem>
                {/*<NavItem to="/tributes" icon={<Gift size={20} />}>*/}
                {/*    TRIBUTES*/}
                {/*</NavItem>*/}
                <NavItem to="/dashboard/gallery" icon={<ImageIcon size={20} />}>
                    GALLERY
                </NavItem>
                <NavItem to="/events" icon={<Calendar size={20} />}>
                    EVENTS
                </NavItem>
                <NavItem to="/users" icon={<Users size={20} />}>
                    USERS
                </NavItem>
                <NavItem to="/donations" icon={<DollarSign size={20} />}>
                    DONATIONS
                </NavItem>
                <NavItem to="/messages" icon={<MessageSquare size={20} />}>
                    MESSAGES
                </NavItem>
                <NavItem to="/settings" icon={<Settings size={20} />}>
                    SETTINGS
                </NavItem>
                <NavItem to="/help" icon={<HelpCircle size={20} />}>
                    HELP CENTER
                </NavItem>
                <NavItem to="/logout" icon={<LogOut size={20} />}>
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

function NavItem({ to, icon, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <NavLink
            to={to}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`} // Conditional styling
        >
            {icon}
            {children}
        </NavLink>
    );
}