import { cn } from "@/lib/utils"
import {Link} from "react-router-dom";
import { usePathname } from "next/navigation"

export function MemorialNavigation({ items, theme = "classic" }) {
    const pathname = usePathname()

    const themeStyles = {
        classic: "bg-stone-200 hover:bg-stone-300",
        modern: "bg-gray-200 hover:bg-gray-300",
        nature: "bg-green-100 hover:bg-green-200",
        vintage: "bg-sepia-200 hover:bg-sepia-300",
        minimalist: "bg-gray-100 hover:bg-gray-200"
    }

    return (
        <nav className="border-b sticky top-0 z-50 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto">
                    {items.map(item => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "px-4 py-3 text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href && themeStyles[theme],
                                "border-b-2 border-transparent",
                                pathname === item.href && "border-primary"
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
