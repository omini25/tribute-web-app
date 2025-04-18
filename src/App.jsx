import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import HomePage from "./pages/landing/HomePage.jsx";
import {LandingTributePage} from "./pages/landing/LandingTributePage.jsx";
import {SignupPage} from "@/pages/auth/SignupPage.jsx";
import {NotFoundPage} from "@/pages/NotFoundPage.jsx";
import {LoginPage} from "@/pages/auth/LoginPage.jsx";
import TributeFormOverview from "@/components/dashboard/TributeFormOverview.jsx";
import Preview from "@/components/main-dashboard/Preview.jsx";
import {ClassicTheme} from "@/components/tribute/themes/ClassicTheme.jsx";
import DashboardPage from "@/pages/DashboadPage.jsx";
import PricingPage from "@/pages/landing/PricingPage.jsx";
import FeaturesPage from "@/pages/landing/FeaturesPage.jsx";
import ContactPage from "@/pages/landing/ContactPage.jsx";
import Gallery from "@/components/main-dashboard/Gallery.jsx";
import MemoriesOverview from "@/components/main-dashboard/MemoriesOverview.jsx";
import {DashboardLayout} from "@/components/main-dashboard/DashboardLayout.jsx";
import MemoriesLife from "@/components/main-dashboard/MemoriesLife.jsx";
import MemoriesFamilyTree from "@/components/main-dashboard/MemoriesFamilyTree.jsx";
import MemoriesEvents from "@/components/main-dashboard/MemoriesEvents.jsx";
import MemoriesMemories from "@/components/main-dashboard/MemoriesMemories.jsx";
import MemoriesDonations from "@/components/main-dashboard/MemoriesDonations.jsx";
import MemoriesMusicTheme from "@/components/main-dashboard/MemoriesMusicTheme.jsx";
import Events from "@/components/main-dashboard/Events.jsx";
import User from "@/components/main-dashboard/User.jsx";
import Donations from "@/components/dashboard/Donations.jsx";
import Settings from "@/components/main-dashboard/Settings.jsx";
import {ModernTheme} from "@/components/tribute/themes/ModernTheme.jsx";
import {MinimalistTheme} from "@/components/tribute/themes/MinimalistTheme.jsx";
import HelpCenter from "@/components/dashboard/HelpCenter.jsx";
import TributeLife from "@/components/dashboard/TributeLife.jsx";
import {ElegantTabTheme} from "@/components/tribute/themes/ElegantTabTheme.jsx";
import {MinimalistTabTheme} from "@/components/tribute/MinimalistTabTheme.jsx";
import TributeNavigation from "@/components/tribute/themes/firstTheme/TributeNavigation.jsx";
import {Tribute} from "@/pages/tribute/Tribute.jsx";
import Life from "@/pages/tribute/Life.jsx";
import {Memories} from "@/pages/tribute/Memories.jsx";
import {FamilyTree} from "@/pages/tribute/FamilyTree.jsx";
import {Posts} from "@/pages/tribute/Posts.jsx";
import {Conclusions} from "@/pages/tribute/Conclusions.jsx";
import {Donation} from "@/pages/tribute/Donation.jsx";
import {Gallerys} from "@/pages/tribute/Gallerys.jsx";
import {Eventing} from "@/pages/tribute/Eventing.jsx";
import MessagesPage from "@/pages/dashboard/MessagesPage.jsx";
import PasswordResetPage from "@/pages/auth/PasswordResetPage.jsx"


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
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<PasswordResetPage />} />

                <Route path="/mordern" element={<ModernTheme />} />
                <Route path="/warm/:id/:title" element={<MinimalistTheme />} />
                <Route path="/cool/:id/:title" element={<ElegantTabTheme />} />
                <Route path="/minimal-tab" element={<MinimalistTabTheme />} />

                <Route path="/main-theme" element={<TributeNavigation />}>
                    <Route path="overview" element={<Tribute />} />
                    <Route path="life" element={<Life />} />
                    <Route path="events" element={<Eventing />} />
                    <Route path="memories" element={<Memories />} />
                    <Route path="family-tree" element={<FamilyTree />} />
                    <Route path="gallery" element={<Gallerys />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="donations" element={<Donation />} />
                    <Route path="conclusions" element={<Conclusions />} />
                </Route>



                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="main" element={<DashboardPage />} />
                    <Route path="memories-overview/:id" element={<MemoriesOverview />} />
                    <Route path="tribute-life/:id" element={<MemoriesLife />} />
                    <Route path={`memories/donations/:id`} element={<MemoriesDonations />}/>
                    <Route path={"family-tree/:id"} element={<MemoriesFamilyTree />} />
                    <Route path={`memories/events/:id`} element={<MemoriesEvents />}/>
                    <Route path={`memories/music-theme/:id`} element={<MemoriesMusicTheme />}/>
                    <Route path={`memories/memories/:id`} element={<MemoriesMemories />}/>
                    <Route path={`Preview/:id`} element={<Preview />}/>

                    {/*Create Tribute Links*/}
                    <Route path="create-tribute" element={<TributeFormOverview />} />
                    <Route path="tribute-life" element={<TributeLife />} />

                    {/*Sidebar links*/}
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="events" element={<Events />} />
                    <Route path="users" element={<User />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<HelpCenter />} />
                    <Route path={"messages"} element={<MessagesPage />} />

                </Route>



                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;