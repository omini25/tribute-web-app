import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { saveUserDetails } from '@/redux/slices/userSlice';
import toast from "react-hot-toast";
import {server} from "@/server.js";
import axios from 'axios';


export default function Signup2({ onPrevious, onNext, currentStep, previousFormData }) {
    const steps = ["MEMORIAL OWNER", "ABOUT YOU", "PLANS AND FEATURES"];
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const combinedFormData = { ...previousFormData, ...formData };

            const response = await axios.post(`${server}/register`, combinedFormData); // Use Axios

            // Data is automatically sent as JSON with Axios

            const userData = response.data; // Access data directly

            // Redux: Save user details to store
            dispatch(saveUserDetails(userData));

            // Local Storage: Save user details
            localStorage.setItem('userDetails', JSON.stringify(userData));

            onNext();


        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("API Error - Data:", error.response.data);
                console.error("API Error - Status:", error.response.status);
                console.error("API Error - Headers:", error.response.headers);
                toast.error("An error occurred during signup. Please try again later or contact support.");
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error("API Error - Request:", error.request);
                toast.error("No response received from the server.");

            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
                toast.error(`An unexpected error occurred:  ${error.message}`);

            }

        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-28">
            {/* Progress Tracker */}
            <div className="flex justify-between items-center mb-12 relative">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex-1 flex items-center">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    index < currentStep ? "bg-primary" : "bg-gray-200"
                                }`}
                            />
                            {index < steps.length - 1 && ( // Only add line if not last step
                                <div
                                    className={`flex-1 h-[2px] ${
                                        index < currentStep - 1 ? "bg-primary" : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </div>

                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-between text-sm text-gray-600 -mt-8 mb-12">
                {steps.map((step, index) => (
                    <span key={step} className={index + 1 === currentStep ? "text-primary font-semibold" : ""}>
                        {step}
                    </span>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-primary mb-2">First Name</label>
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
                        <label className="block text-primary mb-2">Last Name</label>
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
                        <label className="block text-primary mb-2">Email Address</label>
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
                        <label className="block text-primary mb-2">Phone Number</label>
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
                        <label className="block text-primary mb-2">Password</label>
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
                        <label className="block text-primary mb-2">Confirm Password</label>
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
                        className="w-full max-w-md bg-primary hover:bg-blue-600"
                        onClick={() => {
                            /* Handle Facebook login */
                        }}
                    >
                        FACEBOOK
                    </Button>

                    <Button
                        type="button"
                        className="w-full max-w-md bg-primary hover:bg-blue-600"
                        onClick={() => {
                            /* Handle Google login */
                        }}
                    >
                        GOOGLE
                    </Button>

                    <a href="/login" className="text-primary text-sm">
                        Or Login
                    </a>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-primary text-primary hover:bg-blue-50"
                        onClick={onPrevious}
                    >
                        BACK
                    </Button>

                    <Button type="submit"  className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-white">NEXT</Button>


                </div>
            </form>
        </div>
    )
}
