import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/authSlice";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { UserProfile } from "./UserProfile";
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
    Home,
    CreditCard,
    Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { CandlesBackground } from "../CandlesBackground.jsx";
import { cn } from "@/lib/utils";
import logo from "@/assets/Remember-me-logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "@/server";
import { Badge } from "@/components/ui/badge";

export function SidebarMenu({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user?.name || "User";

    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (!user || !user.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get(`${server}/users/${user.id}/subscriptions`, config);
                
                const subscriptions = response.data;
                const activeSubscription = Array.isArray(subscriptions) 
                    ? subscriptions.find(sub => sub.status === 'active')
                    : null;

                if (activeSubscription) {
                    setSubscriptionStatus({
                        isActive: true,
                        available_tributes: activeSubscription.tributes,
                        plan_id: activeSubscription.plan_id
                    });
                } else {
                    setSubscriptionStatus({
                        isActive: false,
                        available_tributes: 0,
                        plan_id: 'No Plan'
                    });
                }
            } catch (error) {
                console.error("Failed to check subscription:", error);
                setSubscriptionStatus({
                    isActive: false,
                    available_tributes: 0,
                    plan_id: 'Error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        checkSubscriptionStatus();
    }, [user.id]);

    const menuItems = [
        { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard/main" },
        { icon: ImageIcon, title: "Gallery", href: "/dashboard/gallery" },
        { icon: Calendar, title: "Events", href: "/dashboard/events" },
        { icon: MessageSquare, title: "Messages", href: "/dashboard/messages" },
        { icon: Users, title: "Members", href: "/dashboard/users" },
        { icon: DollarSign, title: "Donations", href: "/dashboard/donations" },
        { icon: CreditCard, title: "Subscription", href: "/dashboard/subscription" },
        { icon: Settings, title: "Settings", href: "/dashboard/settings" },
        { icon: HelpCircle, title: "Help Center", href: "/dashboard/help" }
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#f8f4f0] text-gray-800">
            <CandlesBackground />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col items-center py-6 px-4">
                    <div className="relative mb-2 overflow-hidden rounded-full border-4 border-amber-100 shadow-md">
                        <img
                            src={logo}
                            alt="Remember Me Logo"
                            className="h-24 w-24 "
                        />
                    </div>
                    <div className="mt-1 h-1 w-16 rounded-full bg-amber-300"></div>
                </div>

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
                                <SidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>
                    ))}

                    <div className="my-4 px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Management
                    </div>

                    {menuItems.slice(3, 8).map(item => (
                        <div className="list-none" key={item.href}>
                            <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <SidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>
                    ))}

                    <div className="my-4 px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Support
                    </div>

                    {menuItems.slice(8).map(item => (
                        <div className="list-none" key={item.href}>
                            <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <SidebarMenuItem icon={item.icon} title={item.title} className="p-0"/>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Subscription Status */}
                <div className="relative px-4 py-4 border-t border-amber-200">
                    <div className="px-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                        Subscription
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                        </div>
                    ) : subscriptionStatus ? (
                        <div className="p-3 bg-amber-50/50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm capitalize">{subscriptionStatus.plan_id} Plan</span>
                                {subscriptionStatus.isActive ? (
                                    <Badge variant="secondary" className="bg-green-500 text-white text-xs">Active</Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs">Inactive</Badge>
                                )}
                            </div>
                            <div className="text-xs text-amber-800">
                                <span className="font-semibold">{subscriptionStatus.available_tributes}</span> Tributes Remaining
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-center text-amber-700 p-2">Could not load status.</div>
                    )}
                </div>

                <div className="relative border-t border-amber-200 bg-amber-50/50 backdrop-blur-sm">
                    <UserProfile
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
    );
}
