/*
Design reminder — Constructivist Control Room:
App-level routing should stay minimal and purposeful.
The default theme must support the dark editorial system used across the portfolio.
Routes should clearly separate the single-page portfolio from the TRX case study.
*/

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TrxPage from "./pages/TrxPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trx" component={TrxPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
