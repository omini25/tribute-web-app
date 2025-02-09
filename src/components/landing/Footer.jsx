import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="border-t bg-background max-w-6xl mx-auto py-16">
            <div className="container mx-auto px-4 py-12">
                {/* Newsletter Section - Centered at top */}
                <div className="max-w-md mx-auto text-center mb-16">
                    <h3 className="text-lg font-medium tracking-wider mb-4">
                        JOIN MY SECRET SOCIETY
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Be the first to hear about sales & new projects!
                    </p>
                    <div className="flex">
                        <Input
                            type="email"
                            placeholder="Enter your email here*"
                            className="rounded-r-none"
                        />
                        <Button
                            type="submit"
                            variant="default"
                            className="rounded-l-none px-8"
                        >
                            Join
                        </Button>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid gap-8 lg:grid-cols-[1fr,1px,1fr] items-start">
                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                        <div>
                            <h4 className="font-medium mb-4 uppercase border-b border-primary inline-block">
                                ABOUT
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm hover:underline">
                                        MY STORY
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm hover:underline">
                                        BLOG
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm hover:underline">
                                        STOCKISTS
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-4 uppercase border-b border-primary inline-block">
                                HELP
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm hover:underline">
                                        CONTACT
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm hover:underline">
                                        WHOLESALE
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Vertical Separator - Only visible on large screens */}
                    <Separator orientation="vertical" className="hidden lg:block" />

                    {/* About Text */}
                    <div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Holly "Oddly" L'Oiseau is an illustrator of peculiar paper and
                            weird wares living in rural South Georgia. If you are all about
                            being right, or like seeing what your inner child is up to get it
                            right the first...or even second time around, this is the place
                            for you. Here, you'll find paper, home goods, and accessories that
                            help you get all of those mixed up feelings off your chest.
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © 2025 BY REMEMBER.
                </div>
            </div>
        </footer>
    )
}
