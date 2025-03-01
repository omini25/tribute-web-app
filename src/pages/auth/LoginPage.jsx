import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "@/server.js";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import Header from "@/components/landing/Header"

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard/main');
            toast.error('You are already logged in');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${server}/login`, {
                email,
                password,
            });
            if (response.data.access_token) {
                dispatch(loginSuccess({
                    user: response.data.user,
                    token: response.data.access_token,
                }));
                navigate('/dashboard/main');
                toast.success('Login successful');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.access_token);
            } else {
                console.error('Login error', response);
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Header />
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Left Content Section */}
                <div className="flex flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-8 xl:px-16">
                    <div className="flex items-center">
                        <Link to="/"> {/* Link to the home page */}
                            <img
                                src="/placeholder.svg"
                                alt="RememberedAlways Logo"
                                width={150}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="mt-16 max-w-xl">
                        <h1 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
                            Create a beautiful, lasting online memorial for your loved one:
                        </h1>

                        <ul className="mt-8 space-y-6">
                            {[
                                "Easy to build",
                                "Ad free; safe and secure",
                                "Invite unlimited family and friends to contribute",
                                "Unlimited space for imgs, videos and stories",
                                "Full control; manage who sees and contributes to memorial"
                            ].map(feature => (
                                <li key={feature} className="flex items-start">
                                    <Check className="mr-3 h-6 w-6 flex-shrink-0 text-primary"/>
                                    <span className="text-lg text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Login Section */}
                <div className="flex flex-1 flex-col justify-center bg-gray-50 px-6 py-12 lg:px-8 xl:px-16">
                    <div className="mx-auto w-full max-w-sm">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Log in to Memories
                        </h2>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary hover:text-primary/90"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-10" disabled={loading}>
                                {loading ? 'Loading...' : 'Log in'}
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Don&#39;t have an account?{" "}
                            <Link to="/signup" className="text-primary hover:text-primary/90">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};