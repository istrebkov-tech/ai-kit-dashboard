import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { AgentsPage } from "@/components/AgentsPage";
import { McpToolsPage } from "@/components/McpToolsPage";
import { LlmModelsPage } from "@/components/LlmModelsPage";
import { WorkspacePage } from "@/components/WorkspacePage";
import { OnboardingModal } from "@/components/OnboardingModal";

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const renderPage = () => {
    if (activeId === "api-keys") return <ApiKeysPage showEmpty={showEmpty} />;
    if (activeId === "agents") return <AgentsPage />;
    if (activeId === "mcp") return <McpToolsPage />;
    if (activeId === "models") return <LlmModelsPage />;
    if (activeId === "workspace") return <WorkspacePage onNavigate={setActiveId} />;
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeId={activeId} onNavigate={setActiveId} onOpenOnboarding={() => setOnboardingOpen(true)} />
      {renderPage()}
      <OnboardingModal open={onboardingOpen} onOpenChange={setOnboardingOpen} />

      {/* Demo toggle */}
      <button
        onClick={() => setShowEmpty((v) => !v)}
        className="fixed bottom-4 right-4 z-50 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-muted transition-colors"
        title={showEmpty ? "Показать данные" : "Показать пустые состояния"}
      >
        {showEmpty ? (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Eye className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default Index;
