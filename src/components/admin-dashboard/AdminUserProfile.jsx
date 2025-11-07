import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminUserProfile({ name, image }) {
    return (
        <div className="flex items-center gap-3 px-3 py-2">
            <Avatar>
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{name}</p>
            </div>
        </div>
    )
}
