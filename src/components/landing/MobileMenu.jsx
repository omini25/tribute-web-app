"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                )}
            </button>

            {/* Mobile menu overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={closeMenu}
                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-6">
                            <Link
                                href="/how-it-works"
                                onClick={closeMenu}
                                className="text-xl text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/examples"
                                onClick={closeMenu}
                                className="text-xl text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                Examples
                            </Link>
                            <Link
                                href="/pricing"
                                onClick={closeMenu}
                                className="text-xl text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/support"
                                onClick={closeMenu}
                                className="text-xl text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                Support
                            </Link>

                            <div className="pt-6 flex flex-col space-y-4">
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="text-xl text-center py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Button
                                    asChild
                                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 hover:text-gray-900"
                                    onClick={closeMenu}
                                >
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}
