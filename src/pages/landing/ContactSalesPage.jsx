import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle } from "lucide-react"
import Header from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function ContactSalesPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
        planType: "",
        memorialCount: "",
        additionalInfo: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the data to your backend
        setIsSubmitted(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f4f0]">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
                {!isSubmitted ? (
                    <Card className="bg-white shadow-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-serif">Contact Sales</CardTitle>
                            <p className="text-muted-foreground mt-2">
                                Tell us about your needs and our team will get back to you shortly
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="organization">Organization Name</Label>
                                            <Input
                                                id="organization"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Selection */}
                                <div className="space-y-4">
                                    <Label>Type of Plan Interested In</Label>
                                    <RadioGroup
                                        name="planType"
                                        value={formData.planType}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="community" id="community" />
                                            <Label htmlFor="community">Community Plan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="corporate" id="corporate" />
                                            <Label htmlFor="corporate">Corporate Plan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ngo" id="ngo" />
                                            <Label htmlFor="ngo">NGO Plan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="custom" id="custom" />
                                            <Label htmlFor="custom">Custom Solution</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Expected Memorial Count */}
                                <div>
                                    <Label htmlFor="memorialCount">Expected Number of Memorial Pages</Label>
                                    <Select
                                        name="memorialCount"
                                        value={formData.memorialCount}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, memorialCount: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10-50">10-50 pages</SelectItem>
                                            <SelectItem value="51-200">51-200 pages</SelectItem>
                                            <SelectItem value="201-500">201-500 pages</SelectItem>
                                            <SelectItem value="500+">500+ pages</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        placeholder="Tell us more about your specific needs..."
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                        className="h-32"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-[#fcd34d] hover:bg-[#645a52]">
                                    Submit Request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-white shadow-md text-center p-8">
                        <CardContent className="space-y-6">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <div className="space-y-4">
                                <h2 className="text-3xl font-serif">Thank You!</h2>
                                <p className="text-muted-foreground">
                                    We've received your request and our sales team will contact you within 24 hours.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    For immediate assistance, please email us at{" "}
                                    <a href="mailto:sales@rememberedalways.org" className="text-primary hover:underline">
                                        sales@rememberedalways.org
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
            <Footer />
        </div>
    )
}