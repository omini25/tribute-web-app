import {Link} from "react-router-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SidebarMenuItem({ icon: Icon, title, href }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            to={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
        >
            <Icon className="h-5 w-5" />
            <span>{title}</span>
        </Link>
    );
}

