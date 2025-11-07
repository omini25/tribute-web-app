import Header from "./Header"
import MobileMenu from "./MobileMenu"
import logo from "@/assets/images/remember-me.png";

export default function ResponsiveHeader() {
    return (
        <div className="relative">
            <div className="hidden md:block">
                <Header />
            </div>
            <div className="md:hidden flex items-center justify-between h-16 px-4 bg-[#f8f4f0] dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Memories Logo" width={100} height={50} className="h-14 w-auto" />
                </div>
                <MobileMenu />
            </div>
        </div>
    )
}
