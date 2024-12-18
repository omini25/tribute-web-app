import { Bell } from "lucide-react"
import  Sidebar  from "@/components/dashboard/SideBar"
import {Outlet} from "react-router-dom";


export default function Main() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar/>

            <div className="fixed top-0 left-0 w-full z-50">
                <div className="p-2 bg-blue-500">
                    <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bell size={24}/>
                            <span className="sr-only">Notifications</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="ml-64 pt-16 p-4">
                <Outlet/>
            </div>
        </div>
    )
}
