import { useState, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { AgentsPage } from "@/components/AgentsPage";
import { MyAgentsPage } from "@/components/MyAgentsPage";
import { McpToolsPage } from "@/components/McpToolsPage";
import { LlmModelsPage } from "@/components/LlmModelsPage";
import { LimitsPage } from "@/components/LimitsPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { OnboardingTour } from "@/components/OnboardingTour";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { GettingStartedWidget } from "@/components/GettingStartedWidget";
import { ContextualGuide } from "@/components/ContextualGuide";
import { DynamicCodeBuilder } from "@/components/DynamicCodeBuilder";

const pages: Record<string, { title: string; subtitle: string }> = {};

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return localStorage.getItem("aikit_onboarding_done") !== "true";
  });
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const handleOnboardingComplete = () => {
    setOnboardingOpen(false);
    localStorage.setItem("aikit_onboarding_done", "true");
  };

  const renderPage = () => {
    if (activeId === "api-keys") return <ApiKeysPage jwtToken={jwtToken} onJwtTokenChange={setJwtToken} />;
    if (activeId === "agents") return <AgentsPage jwtToken={jwtToken} />;
    if (activeId === "my-agents") return <MyAgentsPage />;
    if (activeId === "limits") return <LimitsPage />;
    if (activeId === "mcp") return <McpToolsPage />;
    if (activeId === "models") return <LlmModelsPage />;
    if (pages[activeId]) return <PlaceholderPage title={pages[activeId].title} subtitle={pages[activeId].subtitle} />;
    return null;
  };

  return (
    <OnboardingProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar
          activeId={activeId}
          onNavigate={setActiveId}
          onOpenOnboarding={() => setOnboardingOpen(true)}
        />
        <div className="flex-1 flex flex-col">
          <div className="px-8 pt-6">
            <GettingStartedWidget onNavigate={setActiveId} />
            <DynamicCodeBuilder />
          </div>
          {renderPage()}
        </div>
        <OnboardingTour open={onboardingOpen} onComplete={handleOnboardingComplete} />
        <ContextualGuide />
      </div>
    </OnboardingProvider>
  );
};

export default Index;
