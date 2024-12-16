export const TributeSideBar = () => {
    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Tribute to John Doe</title>
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Tribute to John Doe
                    </h1>
                    <p className="text-gray-600">www.tfpd/tribute/johndoe</p>
                </header>
                <nav className="mb-8">
                    <ul className="flex justify-center space-x-4 sm:space-x-8">
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Life
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Events
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Memories
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Family Tree
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Gallery
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Posts
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Donations
                            </a>
                        </li>
                    </ul>
                </nav>
                <main className="bg-white shadow-md rounded-lg p-6">
                    <section className="text-center">
                        <p className="text-gray-500 italic">
                            Excepteur sint occaecat cupidatat
                        </p>
                        <div className="mt-6">
                            <a
                                href="#"
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Explore Tribute
                            </a>
                        </div>
                    </section>
                </main>
                <footer className="text-center mt-8 text-gray-500">
                    <p>© 2024 John Doe Tribute. All rights reserved.</p>
                </footer>
            </div>
        </>

    )
}