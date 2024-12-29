import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import {Link} from "react-router-dom";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
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

                    {/*<div className="mt-12">*/}
                    {/*    <img*/}
                    {/*        src="/placeholder.svg"*/}
                    {/*        alt="Memorial Preview"*/}
                    {/*        width={600}*/}
                    {/*        height={400}*/}
                    {/*        className="rounded-lg shadow-xl"*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* Right Login Section */}
            <div className="flex flex-1 flex-col justify-center bg-gray-50 px-6 py-12 lg:px-8 xl:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Log in to Memories
                    </h2>

                    <form className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
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

                        <Button type="submit" className="w-full">
                            Log in
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-gray-50 px-2 text-gray-500">OR</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <Button variant="outline" className="w-full">
                                <img
                                    src="/placeholder.svg"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                    className="mr-2 h-5 w-5"
                                />
                                Login with Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                <img
                                    src="/placeholder.svg"
                                    alt="Apple"
                                    width={20}
                                    height={20}
                                    className="mr-2 h-5 w-5"
                                />
                                Login with Apple
                            </Button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:text-primary/90">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
