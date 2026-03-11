import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BASE_URL = "https://agentgateway.ai.redmadrobot.com";

function TokenSpan({ token, isPlaceholder }: { token: string; isPlaceholder: boolean }) {
  return <span className={isPlaceholder ? "text-token-highlight font-semibold" : ""}>{token}</span>;
}

function useCopyButton(getText: () => string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

function getCurlText(token: string) {
  return `curl "${BASE_URL}/llm/chat/completions" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`;
}

function getPythonText(token: string) {
  return `import requests

headers = {
    "Authorization": f"Bearer ${token}",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
}

response = requests.post(
    "${BASE_URL}/llm/chat/completions",
    headers=headers,
    json=data
)

print(response.json())`;
}

function getNodeText(token: string) {
  return `const response = await fetch(
  "${BASE_URL}/llm/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ${token}",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
    }),
  }
);

const data = await response.json();
console.log(data);`;
}

function CodePane({ children, getText }: { children: React.ReactNode; getText: () => string }) {
  const { copied, copy } = useCopyButton(getText);
  return (
    <div className="relative rounded-md bg-code-bg border border-border">
      <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
        {children}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-muted transition-colors"
        title="Копировать"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-success" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export function SmartCodeBlock({ token }: { token: string | null }) {
  const t = token || "YOUR_API_KEY_TOKEN";
  const isPlaceholder = !token;

  return (
    <Tabs defaultValue="curl" className="w-full">
      <TabsList className="w-full justify-start h-9 bg-muted/50 rounded-md p-0.5">
        <TabsTrigger value="curl" className="text-xs px-3 py-1 data-[state=active]:bg-background">cURL</TabsTrigger>
        <TabsTrigger value="python" className="text-xs px-3 py-1 data-[state=active]:bg-background">Python</TabsTrigger>
        <TabsTrigger value="node" className="text-xs px-3 py-1 data-[state=active]:bg-background">Node.js</TabsTrigger>
      </TabsList>

      <TabsContent value="curl" className="mt-3">
        <CodePane getText={() => getCurlText(t)}>
          {`curl "${BASE_URL}/llm/chat/completions" \\
  -H "Authorization: Bearer `}<TokenSpan token={t} isPlaceholder={isPlaceholder} />{`" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}
        </CodePane>
      </TabsContent>

      <TabsContent value="python" className="mt-3">
        <CodePane getText={() => getPythonText(t)}>
          {`import requests

headers = {
    "Authorization": f"Bearer `}<TokenSpan token={t} isPlaceholder={isPlaceholder} />{`",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
}

response = requests.post(
    "${BASE_URL}/llm/chat/completions",
    headers=headers,
    json=data
)

print(response.json())`}
        </CodePane>
      </TabsContent>

      <TabsContent value="node" className="mt-3">
        <CodePane getText={() => getNodeText(t)}>
          {`const response = await fetch(
  "${BASE_URL}/llm/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer `}<TokenSpan token={t} isPlaceholder={isPlaceholder} />{`",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
    }),
  }
);

const data = await response.json();
console.log(data);`}
        </CodePane>
      </TabsContent>
    </Tabs>
  );
}
