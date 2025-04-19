import { useState, useEffect } from "react"
import axios from "axios"
import { UsersTable } from "@/components/main-dashboard/teams/UsersTable.jsx"
import { AddUserModal } from "@/components/main-dashboard/teams/AddUserModal.jsx"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import {server} from "@/server.js"
import {CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${server}/view-team`)
                setUsers(response.data)
            } catch (error) {
                console.error("Error fetching users:", error)
            }
        }

        fetchUsers()
    }, [])

    const handleAddUser = newUser => {
        const id = (users.length + 1).toString()
        const today = new Date().toISOString().split("T")[0]

        setUsers([
            ...users,
            {
                id,
                ...newUser,
                dateAdded: today,
                status: "Pending"
            }
        ])

        setIsAddUserModalOpen(false)
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">

            <CardHeader className="p-0">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                            Members
                        </CardTitle>
                        <CardDescription className="text-warm-600">
                            Manage your team members and their roles
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <UsersTable users={users} onAddUser={() => setIsAddUserModalOpen(true)} />

                <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                    onAddUser={handleAddUser}
                />
            </CardContent>
        </div>
    )
}