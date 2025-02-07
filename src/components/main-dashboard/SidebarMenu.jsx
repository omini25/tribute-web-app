import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/authSlice";
import { SidebarMenuItem } from "../SidebarMenuItem";
import { UserProfile } from "../UserProfile";
import {
    LayoutDashboard,
    Image,
    Calendar,
    DollarSign,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Remember-me-logo.png"



export function SidebarMenu({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = JSON.parse(localStorage.getItem("user"))?.name || "User";

    const menuItems = [
        { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard/main" },
        { icon: Image, title: "Gallery", href: "/dashboard/gallery" },
        { icon: Calendar, title: "Events", href: "/dashboard/events" },
        { icon: DollarSign, title: "Donations", href: "/dashboard/donations" },
        { icon: Settings, title: "Settings", href: "/dashboard/settings" },
        { icon: HelpCircle, title: "Help Center", href: "/dashboard/help" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="flex h-full flex-col justify-between">
            {/* Sidebar Header with Image */}
            <div className="flex flex-col items-center">
                <img
                    src={Logo}
                    alt="Logo"
                    className="h-32 w-32 rounded-full"
                />
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1 px-2">
                {menuItems.map((item) => (
                    <Link to={item.href} key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <SidebarMenuItem
                            icon={item.icon}
                            title={item.title}
                        />
                    </Link>
                ))}
            </nav>

            {/* Logout Button and User Profile */}
            <div className="border-t border-gray-700 px-2 py-4">
                <SidebarMenuItem
                    icon={LogOut}
                    title="Log Out"
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300"
                />
                <UserProfile name={userName} image="/placeholder.svg" className="mt-5 p-4" />
            </div>
        </div>
    );
}