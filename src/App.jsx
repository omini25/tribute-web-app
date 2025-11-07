// C:/Users/david/Documents/Github/tribute-web-app/src/App.jsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/utils/ScrollToTop"; // Adjust path if needed
import logoSrc from '@/assets/Remember-me-logo.png'; // At the top of App.jsx

// Layouts and always-visible components can be imported directly
import { DashboardLayout } from "@/components/main-dashboard/DashboardLayout.jsx";
import { AdminDashboardLayout } from "@/components/admin-dashboard/AdminDashboardLayout.jsx";
import TributeNavigation from "@/components/tribute/themes/firstTheme/TributeNavigation.jsx";

// --- Lazy load page components ---
// ... (all your lazy loaded components remain the same)
// Landing Pages
const HomePage = lazy(() => import("./pages/landing/HomePage.jsx"));
const LandingTributePage = lazy(() => import("./pages/landing/LandingTributePage.jsx").then(module => ({ default: module.LandingTributePage }))); // If not default export
const PricingPage = lazy(() => import("@/pages/landing/PricingPage.jsx"));
const FeaturesPage = lazy(() => import("@/pages/landing/FeaturesPage.jsx"));
const ContactPage = lazy(() => import("@/pages/landing/ContactPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("@/pages/landing/PrivacyPolicyPage.jsx"));
const PartnerPage = lazy(() => import("@/pages/landing/PartnerPage.jsx"));
const FAQPage = lazy(() => import("@/pages/landing/FAQPage.jsx"));
const AboutUsPage = lazy(() => import("@/pages/landing/AboutUsPage.jsx"));
const ContactSalesPage = lazy(() => import("@/pages/landing/ContactSalesPage.jsx"));
const TributesPage = lazy(() => import("@/pages/landing/TributesPage.jsx"));

// Auth Pages
const SignupPage = lazy(() => import("@/pages/auth/SignupPage.jsx").then(module => ({ default: module.SignupPage }))); // If not default export
const LoginPage = lazy(() => import("@/pages/auth/LoginPage.jsx").then(module => ({ default: module.LoginPage }))); // If not default export
const AdminLoginPage = lazy(() => import("@/pages/auth/AdminLoginPage.jsx"));
const PasswordResetPage = lazy(() => import("@/pages/auth/PasswordResetPage.jsx"));
const PasswordPage = lazy(() => import("@/pages/auth/PasswordPage.jsx"));

// Theme Pages (Examples - apply to all theme components)
const ClassicTheme = lazy(() => import("@/components/tribute/themes/ClassicTheme.jsx").then(module => ({ default: module.ClassicTheme }))); // If not default export
const ModernTheme = lazy(() => import("@/components/tribute/themes/ModernTheme.jsx").then(module => ({ default: module.ModernTheme }))); // If not default export
const MinimalistTheme = lazy(() => import("@/components/tribute/themes/MinimalistTheme.jsx").then(module => ({ default: module.MinimalistTheme }))); // If not default export
const ElegantTabTheme = lazy(() => import("@/components/tribute/themes/ElegantTabTheme.jsx").then(module => ({ default: module.ElegantTabTheme }))); // If not default export
const MinimalistTabTheme = lazy(() => import("@/components/tribute/MinimalistTabTheme.jsx").then(module => ({ default: module.MinimalistTabTheme }))); // If not default export


// Tribute Pages (Nested under TributeNavigation)
const Tribute = lazy(() => import("@/pages/tribute/Tribute.jsx").then(module => ({ default: module.Tribute }))); // If not default export
const Life = lazy(() => import("@/pages/tribute/Life.jsx"));
const Eventing = lazy(() => import("@/pages/tribute/Eventing.jsx").then(module => ({ default: module.Eventing }))); // If not default export
const Memories = lazy(() => import("@/pages/tribute/Memories.jsx").then(module => ({ default: module.Memories }))); // If not default export
const FamilyTree = lazy(() => import("@/pages/tribute/FamilyTree.jsx").then(module => ({ default: module.FamilyTree }))); // If not default export
const Gallerys = lazy(() => import("@/pages/tribute/Gallerys.jsx").then(module => ({ default: module.Gallerys }))); // If not default export
const Posts = lazy(() => import("@/pages/tribute/Posts.jsx").then(module => ({ default: module.Posts }))); // If not default export
const Donation = lazy(() => import("@/pages/tribute/Donation.jsx").then(module => ({ default: module.Donation }))); // If not default export
const Conclusions = lazy(() => import("@/pages/tribute/Conclusions.jsx").then(module => ({ default: module.Conclusions }))); // If not default export

const TributePublicPage = lazy(() => import("@/pages/tribute/TributePublicPage.jsx"));
const TributeTheme = lazy(() => import("@/pages/tribute/TributeTheme.jsx"));

// Dashboard Pages (Nested under DashboardLayout)
const DashboardPage = lazy(() => import("@/pages/DashboadPage.jsx")); // Note: "DashboadPage" might be a typo for "DashboardPage"
const MemoriesOverview = lazy(() => import("@/components/main-dashboard/MemoriesOverview.jsx"));
const MemoriesLife = lazy(() => import("@/components/main-dashboard/MemoriesLife.jsx"));
const MemoriesDonations = lazy(() => import("@/components/main-dashboard/MemoriesDonations.jsx"));
const MemoriesFamilyTree = lazy(() => import("@/components/main-dashboard/MemoriesFamilyTree.jsx"));
const MemoriesEvents = lazy(() => import("@/components/main-dashboard/MemoriesEvents.jsx"));
const MemoriesMusicTheme = lazy(() => import("@/components/main-dashboard/MemoriesMusicTheme.jsx"));
const MemoriesMemories = lazy(() => import("@/components/main-dashboard/MemoriesMemories.jsx"));
const Preview = lazy(() => import("@/components/main-dashboard/Preview.jsx"));
const TributeFormOverview = lazy(() => import("@/components/dashboard/TributeFormOverview.jsx"));
const TributeLife = lazy(() => import("@/components/dashboard/TributeLife.jsx"));
const Gallery = lazy(() => import("@/components/main-dashboard/Gallery.jsx"));
const Events = lazy(() => import("@/components/main-dashboard/Events.jsx"));
const User = lazy(() => import("@/components/main-dashboard/User.jsx"));
const Donations = lazy(() => import("@/components/dashboard/Donations.jsx"));
const Settings = lazy(() => import("@/components/main-dashboard/Settings.jsx"));
const HelpCenter = lazy(() => import("@/components/dashboard/HelpCenter.jsx"));
const MessagesPage = lazy(() => import("@/pages/dashboard/MessagesPage.jsx"));
const Subscription = lazy(() => import("@/components/main-dashboard/Subscription.jsx"));


// Admin Dashboard Pages (Nested under AdminDashboardLayout)
const AdminDashboardPage = lazy(() => import("@/pages/admin-dashboard/AdminDashboadPage.jsx")); // Typo? "AdminDashboadPage"
const AdminMemoriesOverview = lazy(() => import("@/components/admin-dashboard/AdminMemoriesOverview.jsx"));
const AdminMemoriesLife = lazy(() => import("@/components/admin-dashboard/AdminMemoriesLife.jsx"));
const AdminMemoriesDonations = lazy(() => import("@/components/admin-dashboard/AdminMemoriesDonations.jsx"));
const AdminMemoriesFamilyTree = lazy(() => import("@/components/admin-dashboard/AdminMemoriesFamilyTree.jsx"));
const AdminMemoriesEvents = lazy(() => import("@/components/admin-dashboard/AdminMemoriesEvents.jsx"));
const AdminMemoriesMusicTheme = lazy(() => import("@/components/admin-dashboard/AdminMemoriesMusicTheme.jsx"));
const AdminMemoriesMemories = lazy(() => import("@/components/admin-dashboard/AdminMemoriesMemories.jsx"));
const AdminTributeFormOverview = lazy(() => import("@/components/admin-dashboard/AdminTributeFormOverview.jsx"));
const AdminGallery = lazy(() => import("@/components/admin-dashboard/AdminGallery.jsx"));
const AdminEvents = lazy(() => import("@/components/admin-dashboard/AdminEvents.jsx"));
const AdminUser = lazy(() => import("@/components/admin-dashboard/AdminUser.jsx"));
const AdminDonations = lazy(() => import("@/components/admin-dashboard/AdminDonations.jsx"));
const AdminSettings = lazy(() => import("@/components/admin-dashboard/AdminSettings.jsx"));
const AdminHelpCenter = lazy(() => import("@/components/admin-dashboard/AdminHelpCenter.jsx"));
const AdminMessagesPage = lazy(() => import("@/pages/admin-dashboard/AdminMessagesPage.jsx"));
const AdminThemes = lazy(() => import("@/pages/admin-dashboard/AdminThemes.jsx"));
const ThemeEditor = lazy(() => import("@/pages/admin-dashboard/ThemeEditor.jsx"));

// NotFoundPage
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx").then(module => ({ default: module.NotFoundPage }))); // If not default export


function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                    <img src={logoSrc} alt="Loading..." className="pulsing-logo" />
                </div>
            }>
                <Routes>
                    {/*Landing Pages*/}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tribute" element={<LandingTributePage />} />
                    <Route path="/tribute/classic" element={<ClassicTheme />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/partner" element={<PartnerPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/contact-sales" element={<ContactSalesPage />} />
                    <Route path="/memorials" element={<TributesPage />} />

                    {/*Auth Pages*/}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/forgot-password" element={<PasswordResetPage />} />
                    <Route path="/reset-password/:token" element={<PasswordPage />} />

                    {/*Theme Pages*/}
                    <Route path="/modern/:id/:title" element={<ModernTheme />} />
                    <Route path="/warm/:id/:title" element={<MinimalistTheme />} />
                    <Route path="/cool/:id/:title" element={<ElegantTabTheme />} />
                    <Route path="/minimal-tab" element={<MinimalistTabTheme />} />

                    <Route path="/tribute/:slug" element={<TributePublicPage />} />
                    <Route path="/tributes/:tributeId/theme" element={<TributeTheme />} />


                    {/*Tribute Pages*/}
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



                    {/*Dashboard Pages*/}
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
                        <Route path="subscription" element={<Subscription />} />

                    </Route>


                    {/*Admin Dashboard Pages*/}
                    <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
                        <Route path="main" element={<AdminDashboardPage />} />
                        <Route path="memories-overview/:id" element={<AdminMemoriesOverview />} />
                        <Route path="tribute-life/:id" element={<AdminMemoriesLife />} />
                        <Route path={`memories/donations/:id`} element={<AdminMemoriesDonations />}/>
                        <Route path={"family-tree/:id"} element={<AdminMemoriesFamilyTree />} />
                        <Route path={`memories/events/:id`} element={<AdminMemoriesEvents />}/>
                        <Route path={`memories/music-theme/:id`} element={<AdminMemoriesMusicTheme />}/>
                        <Route path={`memories/memories/:id`} element={<AdminMemoriesMemories />}/>
                        <Route path={`Preview/:id`} element={<Preview />}/>

                        {/*Create Tribute Links*/}
                        <Route path="create-tribute" element={<AdminTributeFormOverview />} />
                        <Route path="tribute-life" element={<TributeLife />} />

                        {/*Sidebar links*/}
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="events" element={<AdminEvents />} />
                        <Route path="users" element={<AdminUser />} />
                        <Route path="donations" element={<AdminDonations />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="help" element={<AdminHelpCenter />} />
                        <Route path={"messages"} element={<AdminMessagesPage />} />
                        <Route path={"themes"} element={<AdminThemes />} />
                        <Route path="themes/:themeId/edit" element={<ThemeEditor />} />

                    </Route>



                    <Route path="*" element={<NotFoundPage />} />

                </Routes>
            </Suspense>

        </BrowserRouter>
    );
}

export default App;
