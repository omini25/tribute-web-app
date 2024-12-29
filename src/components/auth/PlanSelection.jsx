import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const plans = [
    { id: "basic", name: "Basic", price: "$9.99/month" },
    { id: "standard", name: "Standard", price: "$19.99/month" },
    { id: "premium", name: "Premium", price: "$29.99/month" }
]

const themes = [
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
    { id: "nature", name: "Nature" }
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
        <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-2xl font-semibold">Select Plan and Theme</h2>

            <div>
                <h3 className="mb-4 text-lg font-medium">Choose a Plan</h3>
                <RadioGroup onValueChange={setSelectedPlan} required>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plans.map(plan => (
                            <Card key={plan.id}>
                                <CardContent className="pt-6">
                                    <RadioGroupItem
                                        value={plan.id}
                                        id={plan.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={plan.id}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        <span className="text-lg font-semibold">{plan.name}</span>
                                        <span className="text-sm text-muted-foreground">
                      {plan.price}
                    </span>
                                    </Label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium">Choose a Theme</h3>
                <RadioGroup onValueChange={setSelectedTheme} required>
                    <div className="grid gap-4 md:grid-cols-3">
                        {themes.map(theme => (
                            <Card key={theme.id}>
                                <CardContent className="pt-6">
                                    <RadioGroupItem
                                        value={theme.id}
                                        id={theme.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={theme.id}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        <span className="text-lg font-semibold">{theme.name}</span>
                                    </Label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
                Proceed to Payment
            </Button>
        </form>
    )
}
