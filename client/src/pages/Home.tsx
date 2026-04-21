/*
Design reminder — Constructivist Control Room:
This page should feel like an authored control surface: dense, asymmetrical, and precise.
Favor framed information panels, measured motion, and exposed system structure.
Whenever a choice feels generic, replace it with something more editorial and operational.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Github,
  Lock,
  Menu,
  MoveDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  aboutLayers,
  contactLinks,
  experiences,
  featuredProject,
  heroSubtitles,
  navLinks,
  siteMeta,
  skillGroups,
  supportingProjects,
} from "@/lib/portfolioData";

const heroBackgroundUrl =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663583051886/TULUjKNVxbCZTvdkwLcvn5/lina-hero-systems-motion-JfQGDn9Hs9rfWXiS8kVE5C.webp";

const statItems = [
  { value: 3000, suffix: "+", label: "transactions processed / month" },
  { value: 40, suffix: "%", label: "less reconciliation overhead" },
  { value: 200, suffix: "+", label: "students taught through CodeBrave" },
];

const sectionIds = ["hero", "about", "work", "experience", "skills", "contact"];

function useSectionTracking() {
  const [active, setActive] = useState("work");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.2, 0.35, 0.5, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useRotatingSubtitle(reduceMotion: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSubtitles.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return heroSubtitles[index];
}

function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setDisplay(value);
      return;
    }

    let start = 0;
    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function OpenToWorkBadge({ subtle = false }: { subtle?: boolean }) {
  const openToWork = import.meta.env.VITE_OPEN_TO_WORK !== "false";
  if (!openToWork) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] ${
        subtle
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-500/40 bg-emerald-500/12 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
      }`}
    >
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
      </span>
      Open to work
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-slate-400">
        <span className="h-px w-10 bg-amber-400/70" />
        {eyebrow}
      </div>
      <h2 className="font-display text-[clamp(2.35rem,5vw,4.5rem)] leading-[0.95] text-white">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-slate-300/82 md:text-lg">{description}</p>
    </div>
  );
}

function ControlPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const mobile = window.innerWidth < 768;
    const totalNodes = reduceMotion ? 0 : mobile ? 40 : 80;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const nodes = Array.from({ length: totalNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      amber: Math.random() > 0.72,
      size: Math.random() * 2 + 0.5,
    }));

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -10 || node.x > width + 10) node.vx *= -1;
        if (node.y < -10 || node.y > height + 10) node.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 128) {
            const alpha = 0.16 * (1 - distance / 128);
            context.strokeStyle = a.amber || b.amber ? `rgba(245,158,11,${alpha})` : `rgba(148,163,184,${alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      for (const node of nodes) {
        context.fillStyle = node.amber ? "rgba(245,158,11,0.9)" : "rgba(226,232,240,0.8)";
        context.beginPath();
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(animationFrame);
      } else if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-70" />;
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "ai-flow") {
    return (
      <div className="project-visual grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4" />
        <div className="rounded-2xl border border-indigo-300/50 bg-indigo-400/15 p-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] pulse-blue" />
        <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4" />
        <div className="col-span-3 mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-slate-500">
          <span className="dashed-line w-1/3" />
          <span className="dashed-line w-1/3" />
        </div>
      </div>
    );
  }

  if (type === "car-silhouette") {
    return (
      <div className="project-visual flex items-center justify-center">
        <div className="relative h-24 w-full max-w-[14rem] car-shell">
          <span className="headlight left-2" />
          <span className="headlight right-2" />
        </div>
      </div>
    );
  }

  if (type === "masonry-cms") {
    return (
      <div className="project-visual grid h-full grid-cols-4 gap-2">
        {["h-14", "h-18", "h-12", "h-20", "h-16", "h-10"].map((height, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-white/10 bg-white/[0.04] transition-transform duration-500 ${height} ${index === 2 ? "md:hover:scale-110" : ""}`}
          />
        ))}
      </div>
    );
  }

  if (type === "learning-bars") {
    return (
      <div className="project-visual space-y-4">
        {[45, 72, 91].map((progress, index) => (
          <div key={progress} className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Module {index + 1}
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,158,11,0.92),rgba(99,102,241,0.75))]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="project-visual flex items-end gap-2">
      {[88, 104, 140, 120, 92].map((height, index) => (
        <div
          key={height}
          className={`w-10 rounded-t-[0.9rem] border border-white/10 ${
            index % 2 === 0 ? "bg-amber-400/22" : "bg-indigo-400/18"
          } transition-transform duration-500 ${index === 2 ? "md:hover:-rotate-6" : ""}`}
          style={{ height }}
        />
      ))}
    </div>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0a0a0f]/96 px-6 py-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <div className="font-display text-2xl text-white">LR</div>
            <button
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-24 space-y-5">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`block font-display text-4xl leading-none ${active === link.href.replace("#", "") ? "text-amber-300" : "text-white"}`}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
          <div className="mt-14 space-y-4 border-t border-white/10 pt-6">
            <OpenToWorkBadge />
            <a className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-300" href="#contact" onClick={onClose}>
              Contact Lina <ArrowRight className="size-4" />
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useSectionTracking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled ? "border-b border-white/10 bg-[#0a0a0f]/82 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="container flex h-20 items-center justify-between gap-6">
          <a href="#hero" className="font-display text-2xl tracking-[0.18em] text-white">
            LR
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const current = link.href.replace("#", "");
              const isActive = active === current;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[12px] uppercase tracking-[0.24em] transition ${
                    isActive ? "text-amber-300" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <OpenToWorkBadge subtle />
            <Button asChild variant="outline" className="rounded-full border-white/12 bg-transparent px-5 text-xs uppercase tracking-[0.2em] text-white hover:bg-white/8">
              <a href="#experience">View CV</a>
            </Button>
          </div>
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-white/25 hover:text-white md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const subtitle = useRotatingSubtitle(reduceMotion);

  const entry = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, delay },
    }),
  };

  return (
    <section id="hero" className="relative isolate overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(245,158,11,0.16),transparent_18%),linear-gradient(180deg,#090a0f_0%,#0b0d13_45%,#090a0f_100%)]" />
      <div
        className="absolute inset-0 opacity-45"
        style={{ backgroundImage: `url(${heroBackgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,15,0.82)_0%,rgba(10,10,15,0.68)_45%,rgba(10,10,15,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_180px)] opacity-20" />
      <SystemCanvas />

      <div className="container relative pb-16 pt-10 lg:min-h-[100svh] lg:pb-20">
        <div className="grid gap-10 lg:min-h-[calc(100svh-8rem)] lg:items-end lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="max-w-5xl lg:self-center">
            <motion.div initial="hidden" animate="visible">
              <motion.div custom={0.2} variants={entry} className="mb-6 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-slate-300 sm:flex-nowrap sm:rounded-full sm:tracking-[0.32em]">
                Systems in motion
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.8)]" />
                Beirut · Founder at The Agile Labs
              </motion.div>
              <motion.div custom={0.3} variants={entry}>
                <h1 className="font-display text-[clamp(2.2rem,9vw,7rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-white">
                  <span className="block">Full Stack</span>
                  <span className="flex items-end gap-3 text-white">
                    <span>Engineer</span>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: reduceMotion ? 66 : 84 }}
                      transition={{ delay: 0.45, duration: 0.7 }}
                      className="mb-4 hidden h-1 shrink-0 rounded-full bg-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.4)] sm:block"
                    />
                  </span>
                  <span className="block pl-[8vw] md:pl-[12vw]">& Founder</span>
                </h1>
              </motion.div>

              <motion.div custom={0.58} variants={entry} className="mt-8 min-h-[3.5rem] overflow-hidden text-lg text-slate-300 md:text-[1.15rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitle}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -14 }}
                    transition={{ duration: 0.35 }}
                    className="max-w-2xl"
                  >
                    {subtitle}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              <motion.p custom={0.72} variants={entry} className="mt-3 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                Founder of The Agile Labs. Built TRX — a production SaaS processing 3k+ monthly transactions in active use across Lebanon.
              </motion.p>

              <motion.div custom={0.88} variants={entry} className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="group h-14 rounded-full bg-amber-400 px-7 text-[12px] uppercase tracking-[0.24em] text-slate-950 hover:bg-amber-300">
                  <a href="#work">
                    See my work
                    <MoveDown className="ml-2 size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-14 rounded-full border-white/14 bg-transparent px-7 text-[12px] uppercase tracking-[0.24em] text-white hover:bg-white/6">
                  <a href="#experience">View CV</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.75 }}
            className="hidden lg:block lg:self-end lg:justify-self-end"
          >
            <ControlPanel className="w-full max-w-sm overflow-hidden rounded-[1.6rem] border-amber-400/15 bg-slate-950/55">
              <div className="border-b border-white/8 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Operational proof
              </div>
              <div className="space-y-4 px-5 py-5">
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/6 p-4 text-sm leading-6 text-slate-200 shadow-[0_0_30px_rgba(245,158,11,0.07)]">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300">Live metric</span>
                  <div className="text-2xl font-semibold text-white">
                    <NumberTicker value={3000} suffix="+" />
                  </div>
                  <p className="mt-1 text-slate-400">transactions processed / month</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {statItems.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="font-display text-2xl text-white">
                        <NumberTicker value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ControlPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const [activeLayer, setActiveLayer] = useState<(typeof aboutLayers)[number]["title"]>(aboutLayers[0].title);

  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="container space-y-16">
        <SectionHeading
          eyebrow="Positioning"
          title="From problem framing to production behavior."
          description="Lina’s profile is not a résumé dump. It is a record of technical judgment, product ownership, and shipping under real-world constraints."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-start">
          <ControlPanel className="overflow-hidden">
            <div className="grid gap-5 p-8 md:p-10">
              <p className="text-lg leading-9 text-slate-300">
                I&apos;m a full stack engineer who builds from the ground up — from identifying the problem to shipping the thing that solves it.
              </p>
              <p className="text-base leading-8 text-slate-400">
                I founded The Agile Labs to bring modern software to an underserved market: Lebanese utility distributors still running operations on notebooks and Excel. TRX is the first product — a production SaaS that replaced those workflows for a bottled water distributor, and it&apos;s been running in the field ever since.
              </p>
              <p className="text-base leading-8 text-slate-400">
                Before that: Agile teams at Codi-Tech, an AI platform at I-Stay, and teaching 200+ kids to code through CodeBrave with UNICEF and Al Ghurair Foundation.
              </p>
              <p className="text-base leading-8 text-slate-300">
                I care about correctness, usability, and whether the thing actually works for the person using it.
              </p>
            </div>
          </ControlPanel>

          <div className="space-y-3">
            {aboutLayers.map((layer) => {
              const active = activeLayer === layer.title;
              return (
                <motion.button
                  layout
                  key={layer.title}
                  onMouseEnter={() => setActiveLayer(layer.title)}
                  onFocus={() => setActiveLayer(layer.title)}
                  onClick={() => setActiveLayer(layer.title)}
                  className={`w-full rounded-[1.5rem] border px-6 py-5 text-left transition ${
                    active
                      ? layer.accent === "blue"
                        ? "border-indigo-400/40 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.16)]"
                        : layer.accent === "amber"
                          ? "border-amber-400/40 bg-amber-400/8 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
                          : "border-white/16 bg-white/[0.05]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">{layer.title}</div>
                      <div className="mt-2 text-sm leading-7 text-slate-300">{layer.summary}</div>
                    </div>
                    <ArrowRight className={`mt-1 size-4 shrink-0 transition ${active ? "translate-x-1 text-white" : "text-slate-500"}`} />
                  </div>
                  <AnimatePresence>
                    {active ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 flex flex-wrap gap-2">
                          {layer.details.map((detail) => (
                            <span key={detail} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-200">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectAction({ project }: { project: (typeof supportingProjects)[number] }) {
  const frontendRepoUrl = project.frontendRepoUrl;
  const backendRepoUrl = project.backendRepoUrl;
  const liveUrl = project.liveUrl;
  const hasAnyRepo = Boolean(frontendRepoUrl || backendRepoUrl);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {frontendRepoUrl ? (
        <Button asChild variant="outline" className="rounded-full border-white/10 bg-transparent text-xs uppercase tracking-[0.2em] text-white hover:bg-white/6">
          <a href={frontendRepoUrl} target="_blank" rel="noreferrer">
            <Github className="mr-2 size-4" />
            Frontend repo
          </a>
        </Button>
      ) : null}

      {backendRepoUrl ? (
        <Button asChild variant="outline" className="rounded-full border-white/10 bg-transparent text-xs uppercase tracking-[0.2em] text-white hover:bg-white/6">
          <a href={backendRepoUrl} target="_blank" rel="noreferrer">
            <Github className="mr-2 size-4" />
            Backend repo
          </a>
        </Button>
      ) : null}

      {!hasAnyRepo ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
          <Lock className="size-3.5" />
          Private
        </div>
      ) : null}

      {liveUrl ? (
        <Button asChild className="rounded-full bg-amber-400 text-xs uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-300">
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Live demo
            <ExternalLink className="ml-2 size-4" />
          </a>
        </Button>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <Lock className="size-3.5" />
          Not public
        </div>
      )}
    </div>
  );
}

function WorkSection() {
  const featured = featuredProject;
  const otherProjects = supportingProjects;

  return (
    <section id="work" className="relative py-28 md:py-36">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Selected work"
          title="Evidence over claims."
          description="The portfolio is built around a single dominant proof point — TRX — and supported by product and delivery work shipped inside teams."
        />

        {featured ? (
          <ControlPanel className="group relative overflow-hidden border-amber-400/15">
            <div className="absolute inset-0 opacity-35 transition duration-500 group-hover:opacity-55" style={{ backgroundImage: `url(${featured.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,15,0.9),rgba(10,10,15,0.78)_42%,rgba(10,10,15,0.92)_100%)]" />
            <div className="relative grid gap-8 p-8 md:p-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {featured.badges?.map((badge) => (
                    <Badge key={badge} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-200 hover:bg-amber-400/10">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-display text-[clamp(2.3rem,6vw,4.4rem)] leading-[0.92] text-white">{featured.name}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">{featured.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {featured.metrics?.map((metric) => (
                    <div key={metric} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-200">
                      {metric}
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {featured.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:items-end lg:text-right">
                {featured.actions.map((action, index) => {
                  const isExternal = "external" in action && action.external;
                  return (
                    <Button
                      key={action.label}
                      asChild
                      variant={index === 0 ? "default" : "outline"}
                      className={index === 0 ? "h-14 rounded-full bg-amber-400 px-6 text-xs uppercase tracking-[0.22em] text-slate-950 hover:bg-amber-300" : "h-14 rounded-full border-white/12 bg-transparent px-6 text-xs uppercase tracking-[0.22em] text-white hover:bg-white/8"}
                    >
                      <a href={action.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
                        {action.label}
                        {isExternal ? <ExternalLink className="ml-2 size-4" /> : <ArrowRight className="ml-2 size-4" />}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </ControlPanel>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_0.9fr_1.1fr]">
          {otherProjects.map((project, index) => {
            return (
            <motion.article
              key={project.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.55 }}
              className={`rounded-[1.7rem] border border-white/10 bg-[#12131a] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)] transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-[#171923] ${
                index === 1 ? "xl:translate-y-8" : ""
              }`}
            >
              <div className="mb-6 min-h-[10.5rem] rounded-[1.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
                <ProjectVisual type={project.visual} />
              </div>
              <h3 className="font-display text-3xl leading-none text-white">{project.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
                <ProjectAction project={project} />

            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DesktopTimeline() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-56%"]);

  return (
    <div ref={sectionRef} className="relative hidden h-[260vh] lg:block">
      <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden">
        {/* Scroll progress bar */}
        <div className="relative h-px w-full bg-white/8">
          <motion.div
            className="absolute inset-y-0 left-0 h-px bg-amber-400/70 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
        <div className="flex h-full items-center">
          <motion.div style={{ x: translateX }} className="flex gap-6 pl-1 pr-[28vw]">
            {experiences.map((item, index) => (
              <article
                key={item.role}
                className={`w-[25rem] shrink-0 rounded-[1.8rem] border p-7 shadow-[0_28px_70px_rgba(0,0,0,0.3)] ${
                  index === 0
                    ? "border-amber-400/25 bg-amber-400/[0.03] shadow-[0_28px_70px_rgba(0,0,0,0.3),0_0_60px_rgba(245,158,11,0.08)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className={`flex size-14 items-center justify-center rounded-2xl border font-mono text-base font-semibold tracking-[0.18em] ${item.accent === "blue" ? "border-indigo-400/30 bg-indigo-400/12 text-indigo-200" : item.accent === "green" ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-200" : "border-amber-400/30 bg-amber-400/12 text-amber-200"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-300">{item.dates}</div>
                </div>
                {index === 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {["3k+ txn/mo", "40% less overhead", "Sole engineer"].map((m) => (
                      <span key={m} className="rounded-full border border-amber-400/20 bg-amber-400/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="font-display text-[1.75rem] leading-none text-white">{item.role}</h3>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">{item.company} · {item.location}</p>
                <div className="mt-7 space-y-4 text-sm leading-7 text-slate-300">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <p>{bullet}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MobileTimeline() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-5 lg:hidden">
      {experiences.map((item, index) => {
        const open = openIndex === index;
        return (
          <article
            key={item.role}
            className={`relative rounded-[1.5rem] border p-5 pl-9 transition-colors duration-300 ${
              index === 0
                ? open ? "border-amber-400/30 bg-amber-400/[0.03]" : "border-amber-400/15 bg-white/[0.02]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className={`absolute left-4 top-5 h-[calc(100%-2.5rem)] w-0.5 rounded-full transition-colors duration-300 ${open ? "bg-amber-400/70" : "bg-amber-400/25"}`} />
            <button className="w-full text-left" onClick={() => setOpenIndex(open ? null : index)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">{item.dates}</div>
                  <h3 className="mt-2 font-display text-2xl text-white">{item.role}</h3>
                  <p className="mt-1.5 text-sm uppercase tracking-[0.18em] text-slate-500">{item.company} · {item.location}</p>
                </div>
                <ChevronDown className={`mt-1 size-5 shrink-0 text-slate-500 transition-all duration-300 ${open ? "rotate-180 text-amber-300" : ""}`} />
              </div>
            </button>
            <AnimatePresence>
              {open ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    {item.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <p>{bullet}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Experience"
          title="Shipped across agency, startup, and teaching contexts."
          description="From intern to founder — four roles that built production systems, taught 200+ students, and shipped to paying clients."
        />
      </div>
      <DesktopTimeline />
      <div className="container lg:hidden">
        <MobileTimeline />
      </div>
    </section>
  );
}

function SkillsSection() {
  const [active, setActive] = useState<(typeof skillGroups)[number]["category"]>(skillGroups[0].category);
  const activeGroup = useMemo(() => skillGroups.find((group) => group.category === active) ?? skillGroups[0], [active]);
  const [openMobileCategories, setOpenMobileCategories] = useState<Set<string>>(new Set());

  const toggleMobileCategory = (category: string) => {
    setOpenMobileCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Skills"
          title="A full stack profile organized like a system map."
          description="Everything from schema design to Playwright tests, owned end-to-end. Hover or tap a category to see the tools behind the work."
        />

        {/* Desktop orbit */}
        <div className="hidden lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div className="relative mx-auto h-[38rem] w-full max-w-[38rem]">
            {/* Center core */}
            <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/8 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)]">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-amber-300">Core</div>
                <div className="mt-2 font-display text-4xl text-white">Full Stack</div>
              </div>
            </div>
            {/* Orbit nodes */}
            {skillGroups.map((group, index) => {
              const angle = (Math.PI * 2 * index) / skillGroups.length - Math.PI / 2;
              const radius = 220;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isActive = active === group.category;
              return (
                <button
                  key={group.category}
                  onMouseEnter={() => setActive(group.category)}
                  onFocus={() => setActive(group.category)}
                  onClick={() => setActive(group.category)}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                >
                  <span className={`group flex h-26 w-26 flex-col items-center justify-center rounded-full border text-center transition duration-300 ${isActive ? "scale-110 border-amber-400/50 bg-amber-400/12 text-white shadow-[0_0_40px_rgba(245,158,11,0.25)]" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/18 hover:bg-white/[0.05]"}`}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">{group.short}</span>
                    <span className="mt-2 px-3 font-display text-xl leading-none">{group.category}</span>
                  </span>
                </button>
              );
            })}
            {/* SVG connecting lines — pointer-events-none so clicks pass through to buttons */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 600" fill="none">
              {skillGroups.map((group, index) => {
                const angle = (Math.PI * 2 * index) / skillGroups.length - Math.PI / 2;
                const radius = 220;
                const x = 300 + Math.cos(angle) * radius;
                const y = 300 + Math.sin(angle) * radius;
                const isActive = active === group.category;
                return (
                  <line
                    key={index}
                    x1="300" y1="300" x2={x} y2={y}
                    stroke={isActive ? "rgba(245,158,11,0.55)" : "rgba(148,163,184,0.15)"}
                    strokeWidth={isActive ? "1.5" : "1"}
                    style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <ControlPanel className="overflow-hidden">
            <div className="border-b border-white/8 px-7 py-5 font-mono text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Active category · <span className="text-amber-300/80">{activeGroup.category}</span>
            </div>
            <div className="relative min-h-[18rem] p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <h3 className="font-display text-4xl text-white">{activeGroup.category}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{activeGroup.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeGroup.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                          skill.primary
                            ? "border-amber-400/25 bg-amber-400/8 text-amber-200"
                            : "border-white/10 bg-white/[0.04] text-slate-400"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-amber-400/25 bg-amber-400/8" /> Primary</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-white/10 bg-white/[0.04]" /> Secondary</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </ControlPanel>
        </div>

        {/* Mobile accordion — controlled with framer-motion */}
        <div className="space-y-3 lg:hidden">
          {skillGroups.map((group) => {
            const isOpen = openMobileCategories.has(group.category);
            return (
              <ControlPanel key={group.category} className="overflow-hidden">
                <button
                  className="w-full px-5 py-5 text-left"
                  onClick={() => toggleMobileCategory(group.category)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl text-white">{group.category}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{group.short}</div>
                    </div>
                    <ChevronDown className={`size-5 shrink-0 text-slate-500 transition-all duration-300 ${isOpen ? "rotate-180 text-amber-300" : ""}`} />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-3 text-sm leading-6 text-slate-500">{group.description}</p>
                      <div className="flex flex-wrap gap-2 px-5 pb-5">
                        {group.skills.map((skill) => (
                          <span
                            key={skill.name}
                            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                              skill.primary
                                ? "border-amber-400/25 bg-amber-400/8 text-amber-200"
                                : "border-white/10 bg-white/[0.04] text-slate-400"
                            }`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ControlPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="container">
        <ControlPanel className="overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]">
          <div className="grid gap-10 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                <span className="h-px w-12 bg-amber-400/70" />
                Contact
              </div>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.92] text-white">
                Let&apos;s build something.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Open to full-time roles, contract work, and interesting problems that need product judgment as much as engineering depth.
              </p>
            </div>
            <div className="space-y-4">
              <Button asChild className="h-14 w-full rounded-full bg-amber-400 text-xs uppercase tracking-[0.22em] text-slate-950 hover:bg-amber-300">
                <a href={contactLinks.email}>{contactLinks.emailLabel}</a>
              </Button>
              <Button asChild variant="outline" className="h-14 w-full rounded-full border-white/12 bg-transparent text-xs uppercase tracking-[0.22em] text-white hover:bg-white/8">
                <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
                  {contactLinks.linkedinLabel}
                </a>
              </Button>
              <div className="flex flex-col items-start gap-3 pt-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>Based in Beirut · Open to relocation</span>
                <OpenToWorkBadge subtle />
              </div>
            </div>
          </div>
        </ControlPanel>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = siteMeta.title;
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.07),transparent_18%)]" />
      <Navigation />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <div className="relative py-10">
          <div className="container">
            <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.34em] text-slate-600">
              <span className="h-px flex-1 bg-white/6" />
              <span>The stack behind the work</span>
              <span className="h-px flex-1 bg-white/6" />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["MongoDB", "Node.js", "React", "TypeScript", "PWA", "IndexedDB", "Playwright"].map((tag) => (
                <span key={tag} className="rounded-full border border-amber-400/20 bg-amber-400/[0.05] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  );
}
