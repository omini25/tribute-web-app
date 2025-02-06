"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Check, X } from "lucide-react"
import Warm from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import Cool from "../../assets/Landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import Autumn from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: "₦9.99/month",
        features: [
            { name: "1 Memorial Page", included: true },
            { name: "Basic Customization", included: true },
            { name: "Photo Gallery (20 photos)", included: true },
            { name: "Visitor Comments", included: false },
            { name: "Video Support", included: false }
        ]
    },
    {
        id: "standard",
        name: "Standard",
        price: "₦19.99/month",
        features: [
            { name: "3 Memorial Pages", included: true },
            { name: "Advanced Customization", included: true },
            { name: "Photo Gallery (100 photos)", included: true },
            { name: "Visitor Comments", included: true },
            { name: "Video Support (1 video)", included: true }
        ]
    },
    {
        id: "premium",
        name: "Premium",
        price: "₦29.99/month",
        features: [
            { name: "Unlimited Memorial Pages", included: true },
            { name: "Full Customization", included: true },
            { name: "Unlimited Photo Gallery", included: true },
            { name: "Visitor Comments", included: true },
            { name: "Unlimited Video Support", included: true }
        ]
    }
]

const themes = [
    {
        id: "warm",
        name: "Warm",
        image: Warm
    },
    {
        id: "cool",
        name: "Cool",
        image: Cool
    },
    {
        id: "autumn",
        name: "Autumn",
        image: Autumn
    }
]

export default function PlanSelection({ onSubmit }) {
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [selectedTheme, setSelectedTheme] = useState(null)

    const handleSubmit = e => {
        e.preventDefault()
        if (!selectedPlan || !selectedTheme) {
            alert("Please select a plan and theme")
            return
        }
        onSubmit({ plan: selectedPlan, theme: selectedTheme })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-12 max-w-6xl mx-auto px-4 py-8"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Select Your Plan and Theme</h2>
                <p className="text-muted-foreground">
                    Choose the perfect plan and theme to honor your loved one's memory.
                </p>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-6">Choose a Plan</h3>
                <RadioGroup
                    onValueChange={setSelectedPlan}
                    required
                    className="grid gap-6 md:grid-cols-3"
                >
                    {plans.map(plan => (
                        <div key={plan.id}>
                            <RadioGroupItem
                                value={plan.id}
                                id={plan.id}
                                className="peer sr-only"
                            />
                            <Label htmlFor={plan.id} className="block cursor-pointer">
                                <Card
                                    className={`h-full transition-all duration-300 ${
                                        selectedPlan === plan.id
                                            ? "border-primary ring-2 ring-primary"
                                            : "hover:border-primary/50"
                                    }`}
                                >
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>
                                            <span className="text-2xl font-bold">{plan.price}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                {feature.included ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-500" />
                                                )}
                                                <span
                                                    className={
                                                        feature.included
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                    }
                                                >
                          {feature.name}
                        </span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-6">Choose a Theme</h3>
                <RadioGroup
                    onValueChange={setSelectedTheme}
                    required
                    className="grid gap-6 md:grid-cols-3"
                >
                    {themes.map(theme => (
                        <div key={theme.id}>
                            <RadioGroupItem
                                value={theme.id}
                                id={theme.id}
                                className="peer sr-only"
                            />
                            <Label htmlFor={theme.id} className="block cursor-pointer">
                                <Card
                                    className={`overflow-hidden transition-all duration-300 ${
                                        selectedTheme === theme.id
                                            ? "border-primary ring-2 ring-primary"
                                            : "hover:border-primary/50"
                                    }`}
                                >
                                    <CardContent className="p-0">
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={theme.image || "/placeholder.svg"}
                                                alt={theme.name}
                                                className="object-cover w-full h-full transition-transform duration-300 peer-checked:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <span className="text-white text-lg font-semibold">
                          {theme.name}
                        </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
                Proceed to Payment
            </Button>
        </form>
    )
}
