import { SidebarMenu } from "./SidebarMenu.jsx";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r bg-gray-800 text-gray-100 transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <SidebarMenu
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
                {/* Mobile Menu Button */}
                <div className="md:hidden p-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-500 hover:text-gray-600 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}