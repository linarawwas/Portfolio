/*
Design reminder — Constructivist Control Room:
The TRX page should read like an engineer-authored case study, not a landing page.
Emphasize operational constraints, irreversible decisions, and evidence of correctness.
Preserve the same dark editorial system language while making the content more technical and proof-heavy.
*/

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  trxDecisions,
  trxPainPoints,
  trxResults,
  trxStackLayers,
} from "@/lib/portfolioData";

const caseStudyImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663583051886/TULUjKNVxbCZTvdkwLcvn5/lina-case-study-atlas-93nGMrhBVF62EVWrjzmBT2.webp";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Problem", href: "#problem" },
  { label: "Decisions", href: "#decisions" },
  { label: "Results", href: "#results" },
  { label: "Stack", href: "#stack" },
] as const;

function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen overflow-x-hidden bg-[#0a0a0f] text-white">{children}</div>;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.7rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_70px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

function StickyNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.3, 0.5, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/82 backdrop-blur-xl">
      <div className="container flex flex-wrap items-center gap-3 py-4">
        <a href="/" className="mr-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-300 transition hover:border-white/20 hover:text-white">
          <ArrowLeft className="size-4" />
          Portfolio
        </a>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition ${
                active === item.href.replace("#", "")
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/18 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <Panel className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-0 opacity-16" style={{ backgroundImage: `url(${caseStudyImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="relative space-y-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-amber-300">Operational flow</div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">Field</div>
            <div>
              <div className="font-display text-2xl text-white">Driver app</div>
              <p className="mt-1 text-sm leading-7 text-slate-400">Daily route execution, payments, balances, and delivery updates all run locally.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-10 w-px bg-[linear-gradient(180deg,rgba(245,158,11,0.8),rgba(99,102,241,0.3))]" />
          </div>
          <div className="rounded-[1.25rem] border border-indigo-400/20 bg-indigo-400/8 p-5">
            <div className="font-display text-2xl text-white">Offline queue + IndexedDB</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">Every mutation enters a guarded sync queue. Screens stay usable with zero network dependency.</p>
          </div>
          <div className="flex justify-center">
            <div className="h-10 w-px bg-[linear-gradient(180deg,rgba(99,102,241,0.8),rgba(245,158,11,0.3))]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="font-display text-2xl text-white">Sync service</div>
              <p className="mt-2 text-sm leading-7 text-slate-400">Reconnection debounce and concurrent-sync guards prevent collisions and duplicate writes.</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="font-display text-2xl text-white">Dashboard</div>
              <p className="mt-2 text-sm leading-7 text-slate-400">Owners see accurate balances, invoices, and route outcomes once data re-enters the system.</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function TrxPage() {
  return (
    <PageShell>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.1),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(245,158,11,0.08),transparent_18%)]" />
      <StickyNav />

      <main className="relative z-10">
        <section className="relative overflow-hidden pt-16 md:pt-20">
          <div className="absolute inset-0 opacity-24" style={{ backgroundImage: `url(${caseStudyImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.88),rgba(10,10,15,0.7)_38%,rgba(10,10,15,0.95)_100%)]" />
          <div className="container relative py-20 md:py-28">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mx-auto flex size-28 items-center justify-center rounded-[2rem] border border-amber-400/30 bg-amber-400/8 font-display text-5xl text-amber-200 shadow-[0_0_50px_rgba(245,158,11,0.15)] md:size-32 md:text-6xl">
                TRX
              </div>
              <h1 className="mt-8 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] text-white">Route accounting for Lebanese water distributors.</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                A production system designed inside a real water company, where offline routes, currency volatility, and financial correctness all had to work together.
              </p>
              <Panel className="mt-10 px-6 py-6 md:px-8">
                <div className="grid gap-5 md:grid-cols-4">
                  {[
                    "3k+ txn/mo",
                    "40% billing time saved",
                    "$1,200/mo saved",
                    "0 missed deliveries",
                  ].map((metric) => (
                    <div key={metric} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-200">
                      {metric}
                    </div>
                  ))}
                </div>
              </Panel>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild variant="outline" className="h-14 rounded-full border-white/12 bg-transparent px-7 text-xs uppercase tracking-[0.24em] text-white hover:bg-white/8">
                  <a href="https://trx.theagilelabs.com" target="_blank" rel="noreferrer">
                    trx.theagilelabs.com
                    <ExternalLink className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="py-24 md:py-28">
          <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Panel className="p-7 md:p-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">Overview</div>
              <div className="mt-6 space-y-6 text-base leading-8 text-slate-300">
                <p>
                  Lebanese water distributors run their entire operation on notebooks and Excel. Every day means comparing paper records against spreadsheets, trying to remember who paid in USD and who paid in LBP, and resolving confusing deliveries after the route is already over.
                </p>
                <p>
                  TRX digitizes the full workflow — from loading the truck in the morning to seeing the day&apos;s exact result at night. It was built inside a real Lebanese water company, after watching the actual workflow before a line of code was written.
                </p>
              </div>
            </Panel>
            <ArchitectureDiagram />
          </div>
        </section>

        <section id="problem" className="py-24 md:py-28">
          <div className="container space-y-10">
            <div className="max-w-3xl space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300">Problem</div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.92] text-white">Operational pain, not theory.</h2>
              <p className="text-base leading-8 text-slate-400">These were the frictions visible in the field before architecture decisions were made.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {trxPainPoints.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`rounded-[1.5rem] border p-6 ${
                    item.severity === "danger"
                      ? "border-red-400/22 bg-red-400/[0.06]"
                      : "border-amber-400/22 bg-amber-400/[0.06]"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`size-11 rounded-2xl border ${item.severity === "danger" ? "border-red-300/25 bg-red-400/10" : "border-amber-300/25 bg-amber-400/10"}`} />
                    <div className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${item.severity === "danger" ? "bg-red-400/10 text-red-200" : "bg-amber-400/10 text-amber-200"}`}>
                      {item.severity}
                    </div>
                  </div>
                  <h3 className="font-display text-3xl leading-none text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="decisions" className="py-24 md:py-28">
          <div className="container space-y-10">
            <div className="max-w-3xl space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300">Engineering decisions</div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.92] text-white">The differentiator was decision quality.</h2>
              <p className="text-base leading-8 text-slate-400">TRX was shaped by constraints that could not be abstracted away. Each decision below exists because a simpler version would have been wrong in production.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {trxDecisions.map((item) => (
                <Panel key={item.problem} className="border-l-[3px] border-l-amber-400 p-7 md:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">The problem</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.problem}</p>
                  <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-300">The decision</div>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{item.decision}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section id="results" className="py-24 md:py-28">
          <div className="container space-y-10">
            <div className="max-w-3xl space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300">Results</div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.92] text-white">Measured outcomes, not abstract value.</h2>
            </div>
            <Panel className="p-8 md:p-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {trxResults.map((item) => {
                  const prefix = "prefix" in item ? item.prefix : "";
                  const suffix = "suffix" in item ? item.suffix : "";
                  return (
                    <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-6 text-center">
                      <div className="font-display text-5xl leading-none text-white md:text-6xl">
                        <Counter value={item.value} prefix={prefix} suffix={suffix} />
                      </div>
                      <div className="mt-4 text-sm leading-7 text-slate-400">{item.label}</div>
                    </div>
                  );
                })}
              </div>
              <blockquote className="mt-10 rounded-[1.35rem] border border-amber-400/18 bg-amber-400/[0.05] p-6 text-base leading-8 text-slate-200 md:p-8">
                “Before TRX, we spent time every day comparing paper and Excel numbers. We had at least one problem delivery per week. With TRX, we saved hours, removed the extra support roles, and stopped losing money quietly.”
                <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-amber-300">Water company owner, Lebanon · Early TRX partner</footer>
              </blockquote>
            </Panel>
          </div>
        </section>

        <section id="stack" className="py-24 md:py-28">
          <div className="container space-y-10">
            <div className="max-w-3xl space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300">Tech stack</div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.92] text-white">Layered for reliability.</h2>
            </div>
            <div className="space-y-3">
              {trxStackLayers.map((layer, index) => (
                <Panel key={layer.title} className={`p-6 md:p-7 ${index % 2 === 0 ? "border-amber-400/14" : "border-indigo-400/14"}`}>
                  <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:items-start">
                    <div className="font-display text-3xl text-white">{layer.title}</div>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24 pt-8 md:pb-28">
          <div className="container flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button asChild variant="outline" className="h-14 rounded-full border-white/12 bg-transparent px-7 text-xs uppercase tracking-[0.24em] text-white hover:bg-white/8">
              <a href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to portfolio
              </a>
            </Button>
            <Button asChild className="h-14 rounded-full bg-amber-400 px-7 text-xs uppercase tracking-[0.24em] text-slate-950 hover:bg-amber-300">
              <a href="https://trx.theagilelabs.com" target="_blank" rel="noreferrer">
                Visit TRX
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
