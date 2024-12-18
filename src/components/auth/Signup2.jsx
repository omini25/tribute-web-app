import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"



export default function Signup2({ onPrevious, onNext }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })

    const handleSubmit = e => {
        e.preventDefault()
        // Handle form submission
    }

    return (
        <div className="max-w-3xl mx-auto p-6 mt-28">
            {/* Progress Tracker */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="flex-1 h-[2px] bg-blue-500"></div>
                </div>
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="flex-1 h-[2px] bg-blue-500"></div>
                </div>
                <div className="flex-1 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 -mt-8 mb-12">
                <span>MEMORIAL OWNER</span>
                <span className="text-blue-500">ABOUT YOU</span>
                <span>PLANS AND FEATURES</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-blue-500 mb-2">First Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                            value={formData.firstName}
                            onChange={e =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Last Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            className="bg-blue-50/50 border-blue-100"
                            value={formData.lastName}
                            onChange={e =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Email Address</label>
                        <Input
                            type="email"
                            placeholder="email@johndoe.com"
                            className="bg-blue-50/50 border-blue-100"
                            value={formData.email}
                            onChange={e =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Phone Number</label>
                        <Input
                            type="tel"
                            placeholder="568928973"
                            className="bg-blue-50/50 border-blue-100"
                            value={formData.phone}
                            onChange={e =>
                                setFormData({ ...formData, phone: e.target.value })
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
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-blue-500 mb-2">Confirm Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••••"
                            className="bg-blue-50/50 border-blue-100"
                            value={formData.confirmPassword}
                            onChange={e =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
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

                    <a href="/login" className="text-blue-500 text-sm">
                        Or Login
                    </a>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        onClick={onPrevious}
                    >
                        BACK
                    </Button>

                    <Button
                        type="button"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-white"
                        onClick={onNext}
                    >
                        NEXT
                    </Button>


                </div>
            </form>
        </div>
    )
}
