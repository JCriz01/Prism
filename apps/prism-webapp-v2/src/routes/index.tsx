import { createFileRoute, redirect } from "@tanstack/react-router";

import logo from "../logo.svg";
import "../App.css";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async ({ location }) => {
    // Safely check localStorage (only available in browser)
    let hasToken = false;
    try {
      hasToken = !!localStorage.getItem("user-token");
    } catch (error) {
      // localStorage not available (e.g., during SSR)
      console.warn("localStorage not available:", error);
    }

    if (!hasToken) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.pathname },
      });
    } else {
      throw redirect({
        to: "/spectrums",
        search: { redirect: location.pathname },
      });
    }
  },
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  );
}
