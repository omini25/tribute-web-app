"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "@/server.js"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/redux/slices/authSlice"
import { toast } from "react-hot-toast"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { AuthHeader } from "@/components/auth/AuthHeader.jsx"
import { AuthFooter } from "@/components/auth/AuthFooter.jsx";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/dashboard/main")
            toast.error("You are already logged in")
        }
    }, [navigate])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${server}/login`, {
                email,
                password,
            })
            if (response.data.access_token) {
                dispatch(
                    loginSuccess({
                        user: response.data.user,
                        token: response.data.access_token,
                    })
                )
                navigate("/dashboard/main")
                toast.success("Login successful")
                localStorage.setItem("user", JSON.stringify(response.data.user))
                localStorage.setItem("token", response.data.access_token)
            } else {
                console.error("Login error", response)
                toast.error(response.data.message || "Login failed")
            }
        } catch (error) {
            console.error("Login error", error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader />
            <main className="flex-1">

                <LoginSection
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleSubmit={handleSubmit}
                    loading={loading}
                />
                {/*<SupportSection />*/}
            </main>
            <AuthFooter />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="relative min-h-[40vh] bg-[#f5f0ea]">
            {/* Animated cloud background - use multiple layers for parallax effect */}


            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0ea]/80 to-[#f5f0ea]/60 flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto space-y-6 relative">
                    <h1 className="text-5xl md:text-6xl font-serif text-[#2a3342] tracking-wide">
                        Welcome Back
                    </h1>

                    <p className="text-lg md:text-xl text-[#4a5568] font-light max-w-2xl mx-auto leading-relaxed">
                        Log in to manage and update your memorial pages
                    </p>
                </div>
            </div>
        </section>
    )
}

function LoginSection({
                          email,
                          setEmail,
                          password,
                          setPassword,
                          showPassword,
                          setShowPassword,
                          handleSubmit,
                          loading
                      }) {
    const features = [
        "Easy to build",
        "Ad free; safe and secure",
        "Invite unlimited family and friends to contribute",
        "Unlimited space for images, videos and stories",
        "Full control; manage who sees and contributes to memorial"
    ]

    return (
        <section className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Left side - Features */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-serif font-medium tracking-wide text-[#2a3342] mb-8">
                            Create a beautiful, lasting online memorial for your loved one:
                        </h2>
                        <div className="space-y-6">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-start">
                                    <div className="mr-4 mt-1 flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-[#786f66] flex items-center justify-center">
                                            <Check className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-lg text-[#4a5568]">{feature}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12">
                            <Link to="/signup">
                                <Button className="bg-[#786f66] hover:bg-[#645a52] text-white px-8">
                                    Create a Memorial
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Login form */}
                    <div className="flex flex-col justify-center">
                        <Card className="border-none shadow-lg bg-white">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-serif font-medium text-[#2a3342] mb-8">
                                    Log in to Memories
                                </h2>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-[#4a5568] font-medium"
                                        >
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            required
                                            className="w-full border-gray-300 focus:border-[#786f66] focus:ring-[#786f66]"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="password"
                                                className="text-[#4a5568] font-medium"
                                            >
                                                Password
                                            </Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-[#786f66] hover:text-[#645a52]"
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
                                                className="w-full border-gray-300 focus:border-[#786f66] focus:ring-[#786f66]"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-8 bg-[#786f66] hover:bg-[#645a52] text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Log in"}
                                    </Button>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-[#4a5568]">
                                        Don&#39;t have an account?{" "}
                                        <Link to="/signup" className="text-[#786f66] hover:text-[#645a52] font-medium">
                                            Create an account
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}



export default LoginPage