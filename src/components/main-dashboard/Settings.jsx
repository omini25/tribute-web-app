import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Bell, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

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
            const response = await fetch("/api/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                // Save profile to local storage
                localStorage.setItem("userProfile", JSON.stringify(profile));
                toast({
                    title: "Profile Updated",
                    description: "Your profile information has been successfully updated."
                });
            } else {
                toast({
                    title: "Error",
                    description: "There was an error updating your profile.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error updating your profile.",
                variant: "destructive"
            });
        }
    };

    const handleNotificationToggle = type => {
        setNotifications({ ...notifications, [type]: !notifications[type] });
    };

    const handlePasswordChange = e => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };

    const handlePasswordSave = e => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "New password and confirm password do not match.",
                variant: "destructive"
            });
            return;
        }
        toast({
            title: "Password Updated",
            description: "Your password has been successfully updated."
        });
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-8">User Settings</h1>

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
            </div>
        </div>
    );
}