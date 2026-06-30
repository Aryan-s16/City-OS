"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Hexagon,
  Moon,
  Sun,
  Plus,
  Trash2,
  Search as SearchIcon,
  Sparkles,
  Rocket,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  useTheme,
  Button,
  IconButton,
  Card,
  Badge,
  Tag,
  Avatar,
  Divider,
  Kbd,
  Skeleton,
  SkeletonText,
  Tooltip,
  Input,
  Textarea,
  Search,
  Select,
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  Modal,
  Drawer,
  EmptyState,
  ErrorState,
  Thinking,
  AIReasoning,
  AIConfidence,
  AISources,
  AIRecommendation,
  ProgressStepper,
  Field,
  ValidationMessage,
  ErrorBanner,
  VoiceRecorder,
  MissionCard,
  IssueCard,
  PredictionCard,
  DepartmentCard,
  StatisticCard,
  AIInsightCard,
  NotificationCard,
  Timeline,
  cn,
  type Tone,
} from "@ds";

const TYPE: [string, string][] = [
  ["text-display-xl", "Display XL"],
  ["text-display", "Display"],
  ["text-heading", "Heading"],
  ["text-title", "Title"],
  ["text-body-lg", "Body Large"],
  ["text-body", "Body"],
  ["text-body-sm", "Body Small"],
  ["text-caption", "Caption"],
  ["text-overline uppercase", "Overline"],
];

const COLORS = [
  "bg", "surface", "surface-muted", "primary", "secondary",
  "success", "warning", "danger", "info", "accent",
];

const RADII = ["xs", "sm", "md", "lg", "xl", "2xl"];
const SHADOWS = ["xs", "sm", "md", "lg", "xl"];
const SPACES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
const TONES: Tone[] = ["neutral", "primary", "success", "warning", "danger", "info"];

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-12">
      <p className="text-overline uppercase text-text-subtle">{kicker}</p>
      <h2 className="mt-2 text-title">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  const { theme, toggle } = useTheme();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sw, setSw] = useState(true);
  const [cb, setCb] = useState(true);
  const [radio, setRadio] = useState("standard");
  const [slide, setSlide] = useState(40);

  return (
    <main className="min-h-screen bg-bg text-text transition-colors duration-slow ease-standard">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <header className="flex items-start justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-caption text-text-muted transition hover:text-text">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to Mission Control
            </Link>
            <div className="mt-6 flex items-center gap-3 text-text-muted">
              <Hexagon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <span className="text-overline uppercase">@cityos/design-system</span>
            </div>
            <h1 className="mt-6 text-display">The design system</h1>
            <p className="mt-5 max-w-xl text-body-lg text-text-muted">
              One token-driven library every screen consumes. Nothing here is
              custom — everything composes from the same source of truth.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.75} /> : <Moon className="h-4 w-4" strokeWidth={1.75} />}
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </header>

        <div className="mt-20 space-y-16">
          {/* Typography */}
          <Section kicker="Foundation" title="Typography">
            <div className="space-y-5">
              {TYPE.map(([cls, label]) => (
                <div key={label} className="flex flex-col gap-1 border-b border-border pb-5 last:border-0 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="w-28 shrink-0 text-caption text-text-subtle">{label}</span>
                  <span className={cls}>The city becomes the interface</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Color */}
          <Section kicker="Foundation" title="Color — semantic only">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {COLORS.map((c) => (
                <div key={c} className="overflow-hidden rounded-lg border border-border">
                  <div className={cn("h-16 w-full", `bg-${c}`)} />
                  <p className="px-3 py-2 text-caption text-text-muted">{c}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Radius + Elevation */}
          <Section kicker="Foundation" title="Radius & elevation">
            <div className="flex flex-wrap gap-5">
              {RADII.map((r) => (
                <div key={r} className="text-center">
                  <div className={cn("h-20 w-20 border border-border bg-surface-muted", `rounded-${r}`)} />
                  <p className="mt-2 text-caption text-text-muted">{r}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-5">
              {SHADOWS.map((s) => (
                <div key={s} className={cn("flex h-20 items-end rounded-lg bg-surface p-3", `shadow-${s}`)}>
                  <span className="text-caption text-text-muted">{s}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Spacing */}
          <Section kicker="Foundation" title="Spacing">
            <div className="space-y-2">
              {SPACES.map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <span className="w-8 text-caption text-text-subtle">{s}</span>
                  <span className="h-3 rounded-full bg-primary-soft" style={{ width: s * 4 }} />
                  <span className="text-caption text-text-subtle">{s * 4}px</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Buttons */}
          <Section kicker="Components" title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Plus className="h-4 w-4" strokeWidth={2} /> With icon
              </Button>
              <Tooltip label="Add report">
                <IconButton aria-label="Add"><Plus className="h-5 w-5" strokeWidth={1.75} /></IconButton>
              </Tooltip>
              <IconButton aria-label="Delete"><Trash2 className="h-5 w-5" strokeWidth={1.75} /></IconButton>
            </div>
          </Section>

          {/* Inputs */}
          <Section kicker="Components" title="Inputs">
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <Input placeholder="Default input" />
              <Input placeholder="With icon" leftIcon={SearchIcon} />
              <Input placeholder="Error state" error defaultValue="Invalid" />
              <Input placeholder="Success state" success defaultValue="Looks good" />
              <Search placeholder="Search the city…" />
              <Select defaultValue="">
                <option value="" disabled>Select a district…</option>
                <option>Mission</option>
                <option>Deccan</option>
                <option>Downtown</option>
              </Select>
              <Textarea placeholder="Describe the issue…" className="sm:col-span-2" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <Switch checked={sw} onChange={setSw} aria-label="Toggle" />
                <span className="text-body text-text-muted">Switch</span>
              </div>
              <Checkbox checked={cb} onChange={setCb} label="Checkbox" />
              <div className="w-48">
                <RadioGroup
                  name="demo"
                  value={radio}
                  onChange={setRadio}
                  options={[{ value: "standard", label: "Standard" }, { value: "priority", label: "Priority" }]}
                />
              </div>
              <div className="w-56">
                <Slider value={slide} onChange={setSlide} aria-label="Slider" />
              </div>
            </div>
          </Section>

          {/* Data display */}
          <Section kicker="Components" title="Data display">
            <div className="flex flex-wrap items-center gap-2">
              {TONES.map((t) => (
                <Badge key={t} tone={t} dot>{t}</Badge>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Tag>Drainage</Tag>
              <Tag onRemove={() => {}}>Removable</Tag>
              <Avatar name="Vian Ravi" size="sm" />
              <Avatar name="Maya Lopez" size="md" />
              <Avatar name="Dev Patel" size="lg" />
              <Kbd>⌘K</Kbd>
            </div>
            <Divider className="my-6" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card elevation="xs"><p className="text-section">Surface · xs</p><p className="mt-1 text-caption text-text-muted">Subtle.</p></Card>
              <Card elevation="sm"><p className="text-section">Surface · sm</p><p className="mt-1 text-caption text-text-muted">Default card.</p></Card>
              <Card elevation="md" interactive><p className="text-section">Surface · md</p><p className="mt-1 text-caption text-text-muted">Interactive, lifts on hover.</p></Card>
            </div>
          </Section>

          {/* Feedback */}
          <Section kicker="Components" title="Feedback & loading">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <p className="text-section">Skeletons, never spinners</p>
                <SkeletonText className="mt-4" lines={3} />
                <div className="mt-5"><Thinking label="CityOS is thinking" /></div>
              </Card>
              <Card padding="none">
                <EmptyState
                  icon={Rocket}
                  title="No missions yet"
                  description="When the workforce creates a mission, it will appear here."
                  action={{ label: "Create mission" }}
                  secondaryAction={{ label: "Learn more" }}
                />
              </Card>
            </div>
            <div className="mt-6">
              <Card padding="none">
                <ErrorState action={{ label: "Try again" }} />
              </Card>
            </div>
          </Section>

          {/* AI system */}
          <Section kicker="Components" title="AI system">
            <div className="grid max-w-2xl grid-cols-1 gap-4">
              <AIReasoning>
                Rain in ~6h meets three open drainage reports in low-lying zones.
                Pre-dispatching avoids likely downstream flooding.
              </AIReasoning>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AIConfidence value={0.86} />
                <AISources sources={[{ label: "Weather forecast", meta: "NOAA" }, { label: "Open reports", meta: "×3" }]} />
              </div>
              <AIRecommendation impact="Avoids ~12 downstream reports and one closure.">
                Pre-dispatch Water Crew 7 within the next 2 hours.
              </AIRecommendation>
            </div>
          </Section>

          {/* Forms & wizard (3.2) */}
          <Section kicker="Components" title="Forms & wizard">
            <ProgressStepper
              steps={["Capture", "AI Analysis", "Review", "Created"]}
              current={1}
            />
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Field
                  label="Description"
                  description="Real-time validation, never red-only."
                  aiAction={{ label: "Improve", onClick: () => {} }}
                >
                  <Input placeholder="Describe the issue…" />
                </Field>
                <ValidationMessage tone="success">Looks good — clear and specific.</ValidationMessage>
                <ErrorBanner
                  message="This location appears outside the selected city."
                  onRetry={() => {}}
                />
              </div>
              <VoiceRecorder />
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/report">
                  <Sparkles className="h-4 w-4" strokeWidth={1.75} /> Open the Report wizard
                </Link>
              </Button>
            </div>
          </Section>

          {/* Cards & information architecture (3.3) */}
          <Section kicker="Components" title="Cards & information">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <MissionCard
                title="Kothrud drainage response"
                priority="danger"
                priorityLabel="Critical"
                department="Water"
                progress={35}
                eta="1h 10m"
                crew="Water · Crew 7"
                aiHint="Pre-dispatched ahead of forecast rain; flooding likely without intervention."
                status="Dispatched"
              />
              <IssueCard
                title="Pothole cluster · FC Road"
                summary="Seven potholes deduplicated from 41 citizen reports along a high-traffic corridor."
                severity="warning"
                severityLabel="Assessing"
                location="Downtown"
                time="18m"
                confidence={0.88}
              />
              <PredictionCard
                title="Flooding risk · Kothrud"
                probability={0.78}
                horizon="Next 6 hours"
                impact="Avoids ~12 downstream reports and one road closure."
                tone="danger"
                action={{ label: "Pre-dispatch crew" }}
              />
              <DepartmentCard
                name="Roads"
                health={88}
                activeMissions={14}
                completionRate={92}
                avgResponse="2.4h"
                trend={6}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatisticCard label="Avg resolution" value="19h" trend="55% faster" icon={Clock} />
              <StatisticCard label="Missions closed" value="1,284" trend="12% more" icon={CheckCircle2} />
              <StatisticCard label="Open critical" value="3" trend="2 fewer" trendTone="success" icon={AlertTriangle} />
              <StatisticCard label="Citizen trust" value="4.6" trend="+0.3" icon={Sparkles} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AIInsightCard
                recommendation="Repair Hospital Road before tomorrow's rainfall."
                reason="Surface cracks plus forecast rain create a high failure probability on a critical route."
                confidence={0.91}
                impact="Prevents an estimated 3 cascading failures."
                action={{ label: "Schedule repair" }}
              />
              <div className="rounded-lg border border-border bg-surface p-5">
                <div className="mb-3 space-y-2">
                  <NotificationCard icon={AlertTriangle} tone="danger" title="Critical incident" description="Drainage failure · Kothrud" time="4m" />
                  <NotificationCard icon={Bell} tone="primary" title="Mission updated" description="FC Road resurfacing · 60%" time="22m" />
                </div>
                <Timeline
                  steps={[
                    { time: "1h ago", actor: "Citizen", action: "Reported via app", done: true },
                    { time: "58m ago", actor: "Vision agent", action: "Triaged from photos", done: true, explanation: "Collapsed storm drain detected at 0.96 confidence." },
                    { time: "Pending", actor: "Crew 7", action: "On site", done: false },
                  ]}
                />
              </div>
            </div>
          </Section>

          {/* Overlays */}
          <Section kicker="Components" title="Overlays">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setModal(true)}>
                <Sparkles className="h-4 w-4" strokeWidth={1.75} /> Open modal
              </Button>
              <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
            </div>
          </Section>
        </div>

        <footer className="mt-20 border-t border-border pt-8 text-caption text-text-subtle">
          CityOS AI — one design system, every workspace.
        </footer>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Create mission"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Create</Button>
          </>
        }
      >
        <p className="text-body text-text-muted">
          Modals are large, centered, softly blurred, and rounded. They share
          one structure across the product.
        </p>
        <div className="mt-4 space-y-3">
          <Input placeholder="Mission name" />
          <Textarea placeholder="Notes…" />
        </div>
      </Modal>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Inspector">
        <p className="text-body text-text-muted">
          Drawers slide in naturally and share the same anatomy as panels.
        </p>
      </Drawer>
    </main>
  );
}
