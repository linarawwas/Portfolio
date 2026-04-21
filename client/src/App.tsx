/*
Design reminder — Constructivist Control Room:
App-level routing should stay minimal and purposeful.
The default theme must support the dark editorial system used across the portfolio.
Routes should clearly separate the single-page portfolio from the TRX case study.
*/

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TrxPage from "./pages/TrxPage";

function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const springConfig = { stiffness: 80, damping: 20, mass: 0.5 };
  const x = useSpring(pos.x, springConfig);
  const y = useSpring(pos.y, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x,
        y,
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
      }}
    />
  );
}

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
      <div className="noise-overlay" aria-hidden="true" />
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <CursorGlow />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
