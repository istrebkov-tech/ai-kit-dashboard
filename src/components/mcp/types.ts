export interface McpTool {
  name: string;
  description: string;
  category: string;
}

export interface AuthField {
  label: string;
  placeholder: string;
  type?: string;
}

export type ServerStatus =
  | { kind: "success" }
  | { kind: "error"; message: string }
  | { kind: "auth"; fields: AuthField[] };

export interface McpServer {
  id: string;
  name: string;
  authType: "public" | "keycloak";
  description: string;
  path: string;
  tools: McpTool[];
  status: ServerStatus;
}
