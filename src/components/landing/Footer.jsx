import {Link} from "react-router-dom";

export const Footer = () => {
    return (
        <>
            <footer className="border-t bg-background ">
                <div className="container px-4 py-12 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 ">
                        <div>
                            <img
                                src="/placeholder.svg"
                                alt="Memories Logo"
                                width={150}
                                height={40}
                                className="h-10 w-auto"
                            />
                            <p className="mt-4 text-sm text-gray-500">
                                Helping families preserve and share memories since 2010
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold">Product</h3>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link to="#">Features</Link>
                                </li>
                                <li>
                                    <Link to="#">Pricing</Link>
                                </li>
                                <li>
                                    <Link to="#">Examples</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold">Company</h3>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link to="#">About</Link>
                                </li>
                                <li>
                                    <Link to="#">Blog</Link>
                                </li>
                                <li>
                                    <Link to="#">Contact</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link to="#">Privacy</Link>
                                </li>
                                <li>
                                    <Link to="#">Terms</Link>
                                </li>
                                <li>
                                    <Link to="#">Cookie Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Memories. All rights reserved.
                    </div>
                </div>
            </footer>
        </>

    )
}