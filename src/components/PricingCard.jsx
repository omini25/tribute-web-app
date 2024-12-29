import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingCard({
                                title,
                                price,
                                description,
                                features,
                                popular = false
                            }) {
    return (
        <Card
            className={`flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}
        >
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="mb-4">
                    <span className="text-4xl font-bold">{price}</span>
                    {price !== "Free" && (
                        <span className="text-muted-foreground">/month</span>
                    )}
                </div>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant={popular ? "default" : "outline"}>
                    Choose Plan
                </Button>
            </CardFooter>
        </Card>
    )
}
