import { AppSidebar } from "@/components/AppSidebar";
import { ApiKeysPage } from "@/components/ApiKeysPage";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <ApiKeysPage />
    </div>
  );
};

export default Index;
