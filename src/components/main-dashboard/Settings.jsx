import { useState } from "react";

export default function Settings() {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
    });
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Handle Profile Updates
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleProfileSave = () => {
        alert("Profile updated successfully!");
    };

    // Handle Notifications Toggle
    const handleNotificationToggle = (type) => {
        setNotifications({ ...notifications, [type]: !notifications[type] });
    };

    // Handle Password Update
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };

    const handlePasswordSave = () => {
        if (password.newPassword !== password.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        alert("Password updated successfully!");
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Settings</h1>

            {/* Profile Section */}
            <div className="mb-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile Information</h2>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleProfileSave}
                        className="mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Save Changes
                    </button>
                </form>
            </div>

            {/* Notifications Section */}
            <div className="mb-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="email-notifications"
                            checked={notifications.email}
                            onChange={() => handleNotificationToggle("email")}
                            className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <label htmlFor="email-notifications" className="ml-2 text-gray-700">
                            Receive email notifications
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="sms-notifications"
                            checked={notifications.sms}
                            onChange={() => handleNotificationToggle("sms")}
                            className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <label htmlFor="sms-notifications" className="ml-2 text-gray-700">
                            Receive SMS notifications
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="push-notifications"
                            checked={notifications.push}
                            onChange={() => handleNotificationToggle("push")}
                            className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <label htmlFor="push-notifications" className="ml-2 text-gray-700">
                            Receive push notifications
                        </label>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Security</h2>
                <form>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="current-password" className="block text-gray-700 font-medium mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current-password"
                                name="currentPassword"
                                value={password.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-gray-700 font-medium mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handlePasswordSave();
                        }}
                        className="mt-6 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}