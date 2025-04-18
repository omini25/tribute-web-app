import {Link} from "react-router-dom";
import logo from "@/assets/images/remember-me.png";

export function AuthHeader({ showLinks = true }) {
    return (
        <header className="w-full border-b bg-background/95 container mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex-shrink-0">
                    <img src={logo} alt="Memories Logo" width={150} height={50} className="h-12 w-auto" /> {/* Reduced height */}
                </Link>

                {showLinks && (
                    <nav className="hidden space-x-6 md:flex">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    )
}