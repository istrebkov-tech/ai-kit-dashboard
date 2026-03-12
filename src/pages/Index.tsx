import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { AgentsPage } from "@/components/AgentsPage";
import { MyAgentsPage } from "@/components/MyAgentsPage";
import { McpToolsPage } from "@/components/McpToolsPage";
import { LlmModelsPage } from "@/components/LlmModelsPage";
import { LimitsPage } from "@/components/LimitsPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { OnboardingModal } from "@/components/OnboardingModal";


const pages: Record<string, { title: string; subtitle: string }> = {};

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

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
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeId={activeId} onNavigate={setActiveId} onOpenOnboarding={() => setOnboardingOpen(true)} />
      {renderPage()}
      <AiOmnibox />
      <OnboardingModal open={onboardingOpen} onOpenChange={setOnboardingOpen} />
    </div>
  );
};

export default Index;
