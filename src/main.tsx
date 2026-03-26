import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "system-ui" }}>
          <h1 style={{ color: "#e11d48" }}>Ошибка загрузки приложения</h1>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, background: "#f1f5f9", padding: 16, borderRadius: 8 }}>
            {this.state.error.message}
            {"\n"}
            {this.state.error.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 20px", cursor: "pointer" }}>
            Перезагрузить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("[AIKit] main.tsx: starting import of App...");

import("./App.tsx")
  .then(({ default: App }) => {
    console.log("[AIKit] App imported successfully, rendering...");
    import("./index.css").then(() => {
      console.log("[AIKit] CSS loaded, mounting root...");
      const root = document.getElementById("root");
      if (!root) {
        console.error("[AIKit] #root element not found!");
        return;
      }
      createRoot(root).render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      );
      console.log("[AIKit] App rendered.");
    }).catch((e) => {
      console.error("[AIKit] CSS import failed:", e);
    });
  })
  .catch((e) => {
    console.error("[AIKit] App import failed:", e);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<div style="padding:40px;font-family:system-ui"><h1 style="color:#e11d48">Ошибка загрузки</h1><pre>${e.message}\n${e.stack}</pre></div>`;
    }
  });
