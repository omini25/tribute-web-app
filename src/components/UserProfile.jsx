export function UserProfile({ name, image }) {
    return (
        <div className="flex items-center space-x-3">
            {/*<img*/}
            {/*    className="h-10 w-10 rounded-full"*/}
            {/*    src={image || "/placeholder.svg"}*/}
            {/*    alt={`${name}'s profile`}*/}
            {/*/>*/}
            <div>
                <p className="text-sm font-medium text-white">{name}</p>
                {/*<p className="text-xs text-gray-400">View profile</p>*/}
            </div>
        </div>
    )
}
