import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Shield } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#282c34] text-white py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Section */}
                    <div>
                        <h2 className="text-2xl font-serif mb-4">Remembered Always</h2>
                        <p className="text-gray-300 mb-6">
                            Honour and celebrate the lives of loved ones with beautiful online memorial tributes.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/partner" className="text-gray-300 hover:text-white transition-colors">
                                    Partner With Us
                                </a>
                            </li>
                            <li>
                                <a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                                    Privacy Policy
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Newsletter</h3>
                        <p className="text-gray-300 mb-4">
                            Want tips on building meaningful tributes and preserving precious memories?
                        </p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="bg-[#353a47] border-[#4a5061] text-white placeholder:text-gray-400 focus:border-gray-300"
                                required
                            />
                            <Button type="submit" className="w-full bg-[#f5f5f5] text-[#282c34] hover:bg-white">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#3d4354] my-10"></div>

                {/* Security Message */}
                <div className="flex justify-center items-center text-center mb-10">
                    <div className="max-w-3xl">
                        <div className="flex justify-center mb-2">
                            <Shield size={20} className="text-gray-300" />
                        </div>
                        <p className="text-gray-300">
                            All memories are safely stored and protected. We prioritize the security and privacy of your cherished
                            tributes.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#3d4354] mb-10"></div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Remembered Always. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
