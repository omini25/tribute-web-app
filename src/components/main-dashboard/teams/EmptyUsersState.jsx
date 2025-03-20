"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyUsersState({ onAddUser }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No users added yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
                Start by adding users to your tribute. They will be able to view,
                contribute, or manage the memorial based on their role.
            </p>
            <Button onClick={onAddUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First User
            </Button>
        </div>
    )
}
