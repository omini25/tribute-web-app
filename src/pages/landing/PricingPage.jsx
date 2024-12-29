import { PricingCard } from "@/components/PricingCard.jsx"
import Header from "@/components/landing/Header.jsx";
import {Footer} from "@/components/landing/Footer.jsx";

const plans = [
    {
        title: "Basic",
        price: "Free",
        description: "For individuals creating a single memorial",
        features: [
            "1 memorial page",
            "Basic customization",
            "Photo gallery (up to 50 photos)",
            "Visitor guestbook",
            "Share on social media"
        ]
    },
    {
        title: "Premium",
        price: "$9.99",
        description: "For families wanting enhanced features",
        features: [
            "Up to 5 memorial pages",
            "Advanced customization",
            "Unlimited photos and videos",
            "Timeline of life events",
            "Donation collection",
            "Remove ads"
        ],
        popular: true
    },
    {
        title: "Professional",
        price: "$29.99",
        description: "For organizations managing multiple memorials",
        features: [
            "Unlimited memorial pages",
            "White-label option",
            "API access",
            "Priority support",
            "Analytics dashboard",
            "Custom domain"
        ]
    }
]

export default function PricingPage() {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-16 max-w-7xl mt-20">
                <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
                <p className="text-xl text-center text-muted-foreground mb-12">
                    Select the perfect plan to honor and remember your loved ones
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <PricingCard key={plan.title} {...plan} />
                    ))}
                </div>
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        Feature Comparison
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-muted">
                                <th className="border p-2 text-left">Feature</th>
                                <th className="border p-2 text-center">Basic</th>
                                <th className="border p-2 text-center">Premium</th>
                                <th className="border p-2 text-center">Professional</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border p-2">Memorial Pages</td>
                                <td className="border p-2 text-center">1</td>
                                <td className="border p-2 text-center">Up to 5</td>
                                <td className="border p-2 text-center">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Customization</td>
                                <td className="border p-2 text-center">Basic</td>
                                <td className="border p-2 text-center">Advanced</td>
                                <td className="border p-2 text-center">Advanced</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Photo Gallery</td>
                                <td className="border p-2 text-center">Up to 50 photos</td>
                                <td className="border p-2 text-center">Unlimited</td>
                                <td className="border p-2 text-center">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Video Support</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Timeline of Life Events</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Donation Collection</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Ad-free Experience</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">White-label Option</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">API Access</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Analytics Dashboard</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Custom Domain</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">-</td>
                                <td className="border p-2 text-center">✓</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
