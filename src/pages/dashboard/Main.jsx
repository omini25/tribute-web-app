import { Bell } from "lucide-react"
import  Sidebar  from "@/components/dashboard/SideBar"
import {Outlet} from "react-router-dom";


export default function Main() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex"> {/* Added flex container */}
                <Sidebar />
                <div className="flex-grow"> {/* Ensures content takes remaining space */}
                    <div className="p-4 bg-blue-500 w-full"> {/* Adjusted width */}
                        <div className="flex justify-end">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <Bell size={24} />
                                <span className="sr-only">Notifications</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4"> {/* Content padding */}
                        <Outlet />
                    </div>
                </div>
            </div>


        </div>
    )
}