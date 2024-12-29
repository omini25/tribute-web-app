import { cn } from "@/lib/utils"
import {Link} from "react-router-dom";
import { usePathname } from "next/navigation"

const defaultNavItems = [
    { title: "About", href: "/about" },
    { title: "Life", href: "/life" },
    { title: "Gallery", href: "/gallery" },
    { title: "Stories", href: "/stories" },
    { title: "Events", href: "/events" },
    { title: "Family", href: "/family" }
]

export function MemorialNav({ items = defaultNavItems, className }) {
    const pathname = usePathname()

    return (
        <nav className={cn("border-b bg-background sticky top-0 z-50", className)}>
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto">
                    {items.map(item => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "px-4 py-4 text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href && "border-b-2 border-primary",
                                "whitespace-nowrap"
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
