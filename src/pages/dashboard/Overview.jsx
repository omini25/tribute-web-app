import { Bell } from "lucide-react"
import  Sidebar  from "@/components/dashboard/Sidebar"
import { TributeCard } from "@/components/dashboard/TributeCard"
import { Post } from "@/components/dashboard/Posts"

export default function Overview() {
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

                <div className="mb-8">
                    <div className="flex gap-4">
                        <TributeCard />
                        <TributeCard variant="dashed" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Post
                        name="Name Surname"
                        time="1h ago"
                        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco portis laboris"
                        likes={509}
                    />
                    <Post
                        name="Name Surname"
                        time="1h ago"
                        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                    />
                </div>
            </div>
        </div>
    )
}
