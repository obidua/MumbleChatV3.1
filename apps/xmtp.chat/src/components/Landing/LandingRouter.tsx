import { type FC } from "react";
import { useLocation } from "react-router";
import { LandingInstallBanner } from "@/components/PWA/LandingInstallBanner";
import { FloatingShapes } from "./components/FloatingShapes";
import { LandingFooter } from "./components/LandingFooter";
import { LandingNavbar } from "./components/LandingNavbar";
import { ScrollProgress } from "./components/ScrollProgress";
import classes from "./LandingPages.module.css";
import { FAQsPage } from "./pages/FAQsPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { MobilePage } from "./pages/MobilePage";
import { SecurityPage } from "./pages/SecurityPage";
import { SupportPage } from "./pages/SupportPage";

const getPageComponent = (pathname: string) => {
  switch (pathname) {
    case "/features":
      return <FeaturesPage />;
    case "/how-it-works":
      return <HowItWorksPage />;
    case "/security":
      return <SecurityPage />;
    case "/mobile":
      return <MobilePage />;
    case "/faqs":
      return <FAQsPage />;
    case "/support":
      return <SupportPage />;
    default:
      return <HomePage />;
  }
};

export const LandingRouter: FC = () => {
  const location = useLocation();

  return (
    <div className={classes.landingPage}>
      <ScrollProgress />
      <LandingInstallBanner />
      <div className={classes.background} aria-hidden="true" />
      <FloatingShapes />
      <LandingNavbar />

      <main className={classes.main}>
        {getPageComponent(location.pathname)}
      </main>

      <LandingFooter />
    </div>
  );
};
