import React from "react";
import { createRoot } from "react-dom/client";
import { GameRoot } from "./game/GameRoot.jsx";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="root-error">
          <h1>游戏启动失败</h1>
          <p>{this.state.error.message}</p>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <GameRoot />
    </RootErrorBoundary>
  </React.StrictMode>
);
