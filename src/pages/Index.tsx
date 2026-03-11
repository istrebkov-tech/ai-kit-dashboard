import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { AgentsPage } from "@/components/AgentsPage";
import { McpToolsPage } from "@/components/McpToolsPage";
import { LlmModelsPage } from "@/components/LlmModelsPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { OnboardingModal } from "@/components/OnboardingModal";

const pages: Record<string, { title: string; subtitle: string }> = {};

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const renderPage = () => {
    if (activeId === "api-keys") return <ApiKeysPage />;
    if (activeId === "agents") return <AgentsPage />;
    if (activeId === "mcp") return <McpToolsPage />;
    if (activeId === "models") return <LlmModelsPage />;
    if (pages[activeId]) return <PlaceholderPage title={pages[activeId].title} subtitle={pages[activeId].subtitle} />;
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeId={activeId} onNavigate={setActiveId} onOpenOnboarding={() => setOnboardingOpen(true)} />
      {renderPage()}
      <OnboardingModal open={onboardingOpen} onOpenChange={setOnboardingOpen} />
    </div>
  );
};

export default Index;
