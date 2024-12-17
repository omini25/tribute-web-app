import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";
import AuthHeader from "@/components/auth/AuthHeader.jsx";
import {Link} from "react-router-dom";


export const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    return (
        <>
            <AuthHeader />
            <div className="max-w-3xl mx-auto p-6 mt-28">


                {/* Form */}
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-blue-500 mb-2">Email Address</label>
                            <Input
                                type="email"
                                placeholder="email@johndoe.com"
                                className="bg-blue-50/50 border-blue-100"
                                value={formData.email}
                                onChange={e =>
                                    setFormData({...formData, email: e.target.value})
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-blue-500 mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••••"
                                className="bg-blue-50/50 border-blue-100"
                                value={formData.password}
                                onChange={e =>
                                    setFormData({...formData, password: e.target.value})
                                }
                            />
                        </div>


                    </div>

                    <div className="flex flex-col items-center space-y-4 pt-6">
                        <Button
                            type="button"
                            className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
                            onClick={() => {
                                /* Handle Facebook login */
                            }}
                        >
                            FACEBOOK
                        </Button>

                        <Button
                            type="button"
                            className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
                            onClick={() => {
                                /* Handle Google login */
                            }}
                        >
                            GOOGLE
                        </Button>

                        <a href="/signup" className="text-blue-500 text-sm">
                            Or Signup
                        </a>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Link to="/dashboard">
                            <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50">
                                NEXT
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>


        </>
    )
}