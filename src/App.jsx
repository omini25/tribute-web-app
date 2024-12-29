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
import {NotFoundPage} from "@/pages/NotFoundPage.jsx";
import {LoginPage} from "@/pages/auth/LoginPage.jsx";
import Main from "@/pages/dashboard/Main.jsx";
import {Overview} from "@/pages/dashboard/Overview.jsx";
import DashboardGallery from "@/components/dashboard/DashboardGallery.jsx";
import TributeFormOverview from "@/components/dashboard/TributeFormOverview.jsx";
import TributeLife from "@/components/dashboard/TributeLife.jsx";
import EventsForm from "@/components/dashboard/EventsForm.jsx"
import FamilyTreeForm from "@/components/dashboard/FamilyTree.jsx";
import MusicTheme from "@/components/dashboard/MusicTheme.jsx"
import MemoriesForm from "@/components/dashboard/MemoriesForm.jsx";
import Preview from "@/components/dashboard/Preview.jsx";
import DonationForm from "@/components/dashboard/DonationForm.jsx";
import {ClassicTheme} from "@/components/tribute/themes/ClassicTheme.jsx";
import DashboardPage from "@/pages/DashboadPage.jsx";


function App() {
    return (
        <BrowserRouter>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />


            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tribute" element={<LandingTributePage />} />
                <Route path="/tribute/classic" element={<ClassicTheme />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/dashboard" element={<DashboardPage />} />

                {/*<Route path="/tribute" element={<TributeNavigation />}>*/}
                {/*    <Route path="overview" element={<Tribute />} />*/}
                {/*    <Route path="life" element={<Life />} />*/}
                {/*    <Route path="events" element={<Events />} />*/}
                {/*    <Route path="memories" element={<Memories />} />*/}
                {/*    <Route path="family-tree" element={<FamilyTree />} />*/}
                {/*    <Route path="gallery" element={<Gallery />} />*/}
                {/*    <Route path="posts" element={<Posts />} />*/}
                {/*    <Route path="donations" element={<Donations />} />*/}
                {/*    <Route path="conclusions" element={<Conclusions />} />*/}
                {/*</Route>*/}

                {/*<Route path="/dashboard" element={<Main />}>*/}
                {/*    <Route path="overview" element={<Overview />} />*/}
                {/*    <Route path="gallery" element={<DashboardGallery />} />*/}
                {/*    <Route path="create-tribute" element={<TributeFormOverview />} />*/}
                {/*    <Route path="tribute-life" element={<TributeLife />} />*/}
                {/*    <Route path={"family-tree"} element={<FamilyTreeForm />} />*/}
                {/*    <Route path={`events`} element={<EventsForm />}/>*/}
                {/*    <Route path={`music-theme`} element={<MusicTheme />}/>*/}
                {/*    <Route path={`memories-form`} element={<MemoriesForm />}/>*/}
                {/*    /!*<Route path={`gallery`} element={<GalleryForm />}/>*!/*/}
                {/*    /!*<Route path={`posts`} element={<PostsForm />}/>*!/*/}
                {/*    <Route path={`donations-form`} element={<DonationForm />}/>*/}
                {/*    <Route path={`Preview`} element={<Preview />}/>*/}

                {/*</Route>*/}



                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;