import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";


export function SidebarMenuItem({
                                    icon: IconComponent,
                                    title,
                                    href,
                                    onClick
                                }) {

    // Determine if the item has a click handler or a href
    const isLink = !onClick && href;
    const handleClick = (event) => {
        if (onClick) { // Call onClick if provided and prevent default link behavior
            event.preventDefault();
            onClick();
        }
    };


    return (

        <li>
            {isLink ? ( // Render as Link
                <Link
                    to={href}
                    className={cn(
                        "flex gap-3 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                >
                    <IconComponent className="h-4 w-4"/>
                    {title}
                </Link>
            ) : ( // Render as a button or other interactive element
                <Button variant="ghost" className="w-full justify-start"
                        onClick={handleClick}>  {/* Add onClick here */}
                    <IconComponent className="h-4 w-4 mr-2"/>
                    {title}
                </Button>
            )}

        </li>


    )
}