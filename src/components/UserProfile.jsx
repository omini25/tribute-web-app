import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function UserProfile({ name, image, className }) {
    return (
        <div className={cn("flex items-center gap-3 p-3", className)}>
            <Avatar className="h-10 w-10 border-2 border-amber-200">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-amber-200 text-amber-800">
                    {name
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-medium text-amber-900">{name}</p>
                <p className="text-xs text-amber-700/70">Memorial Admin</p>
            </div>
        </div>
    )
}
