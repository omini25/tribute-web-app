import { Link } from 'react-router-dom'

export function AuthFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t bg-background py-4">
            <div className="container">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {currentYear} Remembered Always. All rights reserved.
                    </p>
                    <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        {/*<Link*/}
                        {/*    to="/terms"*/}
                        {/*    className="text-muted-foreground hover:text-foreground hover:underline"*/}
                        {/*>*/}
                        {/*    Terms of Service*/}
                        {/*</Link>*/}
                        <Link
                            to="/privacy"
                            className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        {/*<Link*/}
                        {/*    to="/help"*/}
                        {/*    className="text-muted-foreground hover:text-foreground hover:underline"*/}
                        {/*>*/}
                        {/*    Help & Support*/}
                        {/*</Link>*/}
                    </nav>
                </div>
            </div>
        </footer>
    )
}
