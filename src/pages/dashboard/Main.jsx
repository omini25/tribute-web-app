import { Bell } from "lucide-react"
import  Sidebar  from "@/components/dashboard/SideBar"
import {Outlet} from "react-router-dom";


export default function Main() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <div className="ml-64 p-8">
                <div className="flex justify-end mb-8">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Bell size={24} />
                        <span className="sr-only">Notifications</span>
                    </button>
                </div>

                <Outlet />
            </div>
        </div>
    )
}
