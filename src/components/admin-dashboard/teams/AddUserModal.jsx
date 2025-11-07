import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import axios from "axios";
import {server} from "@/server.js";
import { toast } from "react-hot-toast";

export function AddUserModal({ isOpen, onClose, onAddUser }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Viewer",
        relationship: "",
        tribute: ""
    });

    const [tributes, setTributes] = useState([]);
    const [errors, setErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch the list of tributes from the server
        const fetchTributes = async () => {
            try {
                const response = await axios.get(`${server}/tribute/title/image/${user.id}`);
                setTributes(response.data);
            } catch (error) {
                console.error("Error fetching tributes:", error);
            }
        };

        fetchTributes();
    }, []);



    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleRoleChange = value => {
        setFormData(prev => ({
            ...prev,
            role: value
        }));
    };

    const handleRelationshipChange = value => {
        setFormData(prev => ({
            ...prev,
            relationship: value
        }));
    };

    const handleTributeChange = value => {
        setFormData(prev => ({
            ...prev,
            tribute: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.tribute.trim()) {
            newErrors.tribute = "Tribute is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post(`${server}/add-team`, formData);
                onAddUser(response.data);
                setFormData({
                    name: "",
                    email: "",
                    role: "Viewer",
                    relationship: "",
                    tribute: ""
                });
                toast.success("User added successfully");
                onClose();
            } catch (error) {
                console.error("Error adding user:", error);
                toast.error("Error adding user:", error);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to your tribute. They will receive an email
                        invitation.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter user's name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter user's email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Contributor">Contributor</SelectItem>
                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Select value={formData.relationship} onValueChange={handleRelationshipChange}>
                                <SelectTrigger id="relationship">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="Sibling">Sibling</SelectItem>
                                    <SelectItem value="Relative">Relative</SelectItem>
                                    <SelectItem value="Friend">Friend</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tribute">Tribute</Label>
                            <Select
                                value={formData.tribute}
                                onValueChange={handleTributeChange}
                            >
                                <SelectTrigger id="tribute">
                                    <SelectValue placeholder="Select a tribute" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {tributes.map(tribute => (
                                        <SelectItem
                                            key={tribute.id}
                                            value={tribute.id.toString()} // Ensure ID is a string
                                        >
                                            {tribute.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tribute && (
                                <p className="text-sm text-red-500">{errors.tribute}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleSubmit()}>Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
