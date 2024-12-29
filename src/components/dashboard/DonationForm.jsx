import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Link} from "react-router-dom";

export default function DonationForm() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-medium text-gray-600">TRIBUTE TITLE</h1>
                <h2 className="text-2xl text-gray-500">DONATIONS</h2>
            </div>

            <div className="space-y-8">
                {/* Donation Options */}
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="noDonations"/>
                        <Label htmlFor="noDonations" className="text-blue-500">
                            No Donations
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="allowAnonymous"/>
                        <Label htmlFor="allowAnonymous" className="text-blue-500">
                            Allow Anonymous
                        </Label>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="tributeName" className="text-blue-500">
                            Tribute Donation Name
                        </Label>
                        <Input
                            id="tributeName"
                            defaultValue="John Doe Tribute"
                            className="border-blue-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wallet" className="text-blue-500">
                            Donation To Wallet Or Other
                        </Label>
                        <Input
                            id="wallet"
                            defaultValue="Wallet"
                            className="border-blue-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notifyUsers" className="text-blue-500">
                            Notify All Users
                        </Label>
                        <Input
                            id="notifyUsers"
                            defaultValue="No"
                            className="border-blue-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-blue-500">
                            Date To End
                        </Label>
                        <Input
                            id="endDate"
                            defaultValue="15:39"
                            className="border-blue-100"
                        />
                    </div>
                </div>

                {/* No Limit Option */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="noLimit"/>
                    <Label htmlFor="noLimit" className="text-blue-500">
                        No Limit
                    </Label>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-16">
                    <Link to={`/dashboard/memories-form`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                            MEMORIES
                        </Button>
                    </Link>
                    <Link to={`/dashboard/music-theme`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 min-w-[120px]">
                            MUSIC THEME
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
