import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { AgentsPage } from "@/components/AgentsPage";
import { McpToolsPage } from "@/components/McpToolsPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";

const pages: Record<string, { title: string; subtitle: string }> = {
  workspace: { title: "Рабочее пространство", subtitle: "Управление рабочими пространствами и сессиями" },
  models: { title: "LLM Модели", subtitle: "Управление подключёнными языковыми моделями" },
};

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");

  const renderPage = () => {
    if (activeId === "api-keys") return <ApiKeysPage />;
    if (activeId === "agents") return <AgentsPage />;
    if (activeId === "mcp") return <McpToolsPage />;
    if (pages[activeId]) return <PlaceholderPage title={pages[activeId].title} subtitle={pages[activeId].subtitle} />;
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeId={activeId} onNavigate={setActiveId} />
      {renderPage()}
    </div>
  );
};

export default Index;
