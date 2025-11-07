import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Bell, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { server } from "@/server.js";
import axios from "axios";

export default function Settings() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem("user"));
        if (storedProfile) {
            setProfile(storedProfile);
        }
    }, []);

    const handleProfileChange = e => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleProfileSave = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const userId = storedUser?.id;

            const response = await axios.post(`${server}/update-account/${userId}`, profile, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(profile));
                toast.success("Profile updated successfully.");
            } else {
                toast.error("An error occurred. Please try again.");
                console.error(response);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const handleNotificationToggle = type => {
        setNotifications({ ...notifications, [type]: !notifications[type] });
    };

    const handlePasswordChange = e => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "New password and confirm password do not match.",
                variant: "destructive"
            });
            return;
        }

        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const userId = storedUser?.id;

            const response = await axios.post(`${server}/update-password/${userId}`, {
                currentPassword: password.currentPassword,
                newPassword: password.newPassword
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success("Password updated successfully.");
            } else {
                toast.error("An error occurred. Please try again.");
                console.error(response);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">

                <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-warm-800 sm:text-3xl">
                        Settings
                    </CardTitle>
                    <CardDescription className="text-warm-600">
                        Account settings
                    </CardDescription>
                </CardHeader>


                <CardContent className="p-0 pt-6">
                    <Tabs defaultValue="profile" className="space-y-8">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <User className="mr-2" /> Profile Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={e => e.preventDefault()} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">First Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={profile.name}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="name">Last Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={profile.last_name}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={profile.email}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={profile.phone}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleProfileSave}>Save Changes</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Bell className="mr-2" /> Notification Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="email-notifications"
                                            className="flex items-center space-x-2"
                                        >
                                            <span>Email Notifications</span>
                                        </Label>
                                        <Switch
                                            id="email-notifications"
                                            checked={notifications.email}
                                            onCheckedChange={() => handleNotificationToggle("email")}
                                            className="border border-[#e5e0d9]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="sms-notifications"
                                            className="flex items-center space-x-2"
                                        >
                                            <span>SMS Notifications</span>
                                        </Label>
                                        <Switch
                                            id="sms-notifications"
                                            checked={notifications.sms}
                                            onCheckedChange={() => handleNotificationToggle("sms")}
                                            className="border border-[#e5e0d9]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="push-notifications"
                                            className="flex items-center space-x-2"
                                        >
                                            <span>Push Notifications</span>
                                        </Label>
                                        <Switch
                                            id="push-notifications"
                                            checked={notifications.push}
                                            onCheckedChange={() => handleNotificationToggle("push")}
                                            className="border border-[#e5e0d9]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Lock className="mr-2" /> Security Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordSave} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                type="password"
                                                id="current-password"
                                                name="currentPassword"
                                                value={password.currentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                type="password"
                                                id="new-password"
                                                name="newPassword"
                                                value={password.newPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">
                                                Confirm New Password
                                            </Label>
                                            <Input
                                                type="password"
                                                id="confirm-password"
                                                name="confirmPassword"
                                                value={password.confirmPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <Button type="submit">Update Password</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </div>
        </div>
    );
}