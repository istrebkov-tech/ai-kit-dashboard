import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";

const pages: Record<string, { title: string; subtitle: string }> = {
  workspace: { title: "Рабочее пространство", subtitle: "Управление рабочими пространствами и сессиями" },
  agents: { title: "Реестр Агентов", subtitle: "Просмотр и настройка зарегистрированных агентов" },
  mcp: { title: "Инструменты MCP", subtitle: "Конфигурация инструментов Model Context Protocol" },
  models: { title: "LLM Модели", subtitle: "Управление подключёнными языковыми моделями" },
};

const Index = () => {
  const [activeId, setActiveId] = useState("api-keys");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeId={activeId} onNavigate={setActiveId} />
      {activeId === "api-keys" ? (
        <ApiKeysPage />
      ) : (
        <PlaceholderPage title={pages[activeId].title} subtitle={pages[activeId].subtitle} />
      )}
    </div>
  );
};

export default Index;
