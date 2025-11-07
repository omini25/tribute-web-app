import { Link } from 'react-router-dom'; // Recommended for SPAs
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import {Footer} from "@/components/landing/Footer.jsx";
import Header from "@/components/landing/Header.jsx"; // Using a popular icon library


export const NotFoundPage = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50">

                {/* Main Content */}
                <main
                    id="content"
                    className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
                >
                    <div className="max-w-lg w-full text-center space-y-8">
                        {/* Optional: A thematic icon */}
                        <AlertTriangle
                            className="mx-auto h-16 w-16 text-amber-500 dark:text-amber-400"
                            aria-hidden="true"
                        />

                        <div className="space-y-3">
                            <h1 className="text-7xl sm:text-9xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
                                404
                            </h1>
                            <p className="text-2xl sm:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                                Page Not Found
                            </p>
                            <p className="text-md text-slate-600 dark:text-slate-400">
                                Oops! The page you are looking for doesn't exist. It might have
                                been moved, deleted, or you might have mistyped the URL.
                            </p>
                        </div>

                        <Link
                            to="/" // Navigate to the homepage or a relevant dashboard
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors duration-150"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                            Go to Homepage
                        </Link>
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </>
    );
};