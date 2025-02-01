import { Link } from "react-router-dom"

export function SidebarMenuItem({
                                    icon: Icon,
                                    title,
                                    href,
                                    onClick,
                                    className = ""
                                }) {
    const baseClasses =
        "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
    const activeClasses = "bg-gray-900 text-white"
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white"

    const content = (
        <>
            <Icon className="mr-3 h-6 w-6" aria-hidden="true" />
            {title}
        </>
    )

    if (href && !onClick) {
        return (
            <Link
                to={href}
                className={`${baseClasses} ${inactiveClasses} ${className}`}
                activeClassName={activeClasses}
            >
                {content}
            </Link>
        )
    }

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${inactiveClasses} ${className} w-full text-left`}
        >
            {content}
        </button>
    )
}
