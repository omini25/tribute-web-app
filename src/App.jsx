import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import HomePage from "./pages/landing/HomePage.jsx";
import {LandingTributePage} from "./pages/landing/LandingTributePage.jsx";
import TributeNavigation from "@/components/tribute/themes/firstTheme/TributeNavigation.jsx";
import {Tribute} from "./pages/tribute/Tribute.jsx";
import Life from "./pages/tribute/Life.jsx";
import {Events} from "./pages/tribute/Events.jsx";
import {Memories} from "./pages/tribute/Memories.jsx";
import {FamilyTree} from "@/pages/tribute/FamilyTree.jsx";
import {Gallery} from "@/pages/tribute/Gallery.jsx";
import {Posts} from "@/pages/tribute/Posts.jsx";
import {Donations} from "@/pages/tribute/Donations.jsx";
import {Conclusions} from "@/pages/tribute/Conclusions.jsx";
import {SignupPage} from "@/pages/auth/SignupPage.jsx";

function App() {
    return (
        <BrowserRouter>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />


            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/landing" element={<LandingTributePage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/tribute" element={<TributeNavigation />}>
                    <Route path="tribute" element={<Tribute />} />
                    <Route path="life" element={<Life />} />
                    <Route path="events" element={<Events />} />
                    <Route path="memories" element={<Memories />} />
                    <Route path="family-tree" element={<FamilyTree />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="conclusions" element={<Conclusions />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;