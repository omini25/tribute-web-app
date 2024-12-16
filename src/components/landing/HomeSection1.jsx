import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

const HomeSection1 = () => {
    return (
        <div className="font-sans bg-gray-100">

            {/* Header */}
            <header className="py-4 px-8 flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-8 mr-4"/> {/* Replace with your logo */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md px-3 py-1"
                    />
                </div>
                <div className="flex items-center space-x-6">
                    <a href="#" className="hover:text-blue-500">Link 1</a>
                    <a href="#" className="hover:text-blue-500">Link 2</a>
                    <a href="#" className="hover:text-blue-500">Link 3</a>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-blue-100 py-16">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Big Title Here</h1>
                    <p className="text-gray-600 mb-8">Subtext or short description goes here.</p>
                    <div className="mb-8">{/* Replace with your image slider */}
                        <img src="/hero-image.jpg" alt="Hero Image" className="w-full rounded-md"/>
                    </div>
                    <div className="space-x-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md">
                            Button 1
                        </button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-md">
                            Button 2
                        </button>
                    </div>
                </div>
            </section>

            {/* Two Columns */}
            <section className="py-16">
                <div className="container mx-auto flex flex-col md:flex-row">
                    <div className="md:w-1/2 pr-8 mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold mb-4">Big Text Here</h2>
                        <div className="border-b border-gray-300 w-16 mb-6"></div>
                        {/* Line */}
                        <p className="text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-gray-600">
                            More supporting text can go here. You can add more content,
                            images, or even another call to action in this section.
                        </p>
                    </div>
                </div>
            </section>

            {/* Image Slider */}
            <section className="py-16">
                <div className="container mx-auto">
                    {/* Replace with your image slider */}
                    <div className="mb-4">
                        <img src="/image1.jpg" alt="Image 1" className="w-full rounded-md"/>
                    </div>
                    <div>
                        <img src="/image2.jpg" alt="Image 2" className="w-full rounded-md"/>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <div className="text-blue-500 text-xl font-bold">LOREM IPSUM</div>
                    <div className="flex items-center">
                        <div className="text-blue-500 text-sm mr-4">Name Surname</div>
                        <div className="text-blue-500 text-sm">Founder &amp; CEO</div>
                        <div className="text-blue-500 text-sm ml-4">...</div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="text-blue-500 text-4xl font-bold">
                        Excepteur sint occaecat.
                    </div>
                    <div className="text-blue-500 text-lg mt-4">
                        Culpa qui officia deserunt mollit anim id est laborum. Sed ut
                        perspiciatis unde omnis iste natus error sit
                    </div>
                </div>
                <div className="flex items-center justify-between mt-8">
                    <div className="text-blue-500 text-sm">
                        LOREM IPSUM DOLOR AMET
                        <br/>
                        CONSECTETUER
                        <br/>
                        by Name Surname
                    </div>
                    <div className="text-blue-500 text-sm">+</div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Feature Card 1 */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                {/* Replace with actual icon */}
                                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Reprehenderit qui occaecat</h3>
                        </div>
                        <p className="text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu fugiat nulla pariatur.</p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                {/* Replace with actual icon */}
                                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16m-7 6h7"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Voluptate velit esse</h3>
                        </div>
                        <p className="text-gray-600">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia deserunt mollit anim id est laborum.</p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                {/* Replace with actual icon */}
                                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Lorem ipsum dolor</h3>
                        </div>
                        <p className="text-gray-600">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi ut aliquip ex ea commodo consequat.</p>
                    </div>

                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-white py-6">
                <div className="container mx-auto text-center text-gray-600">
                    <p>Excepteur occaecat cupidatat</p>
                </div>
            </footer>

        </div>
    );
};

export default HomeSection1;