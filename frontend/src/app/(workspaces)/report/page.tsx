"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  ProgressStepper,
  FileUploader,
  VoiceRecorder,
  LocationPicker,
  AIAnalysisPanel,
  ReviewCard,
  SuccessScreen,
  Field,
  TextArea,
  Button,
  ValidationMessage,
  type UploadItem,
  type AIAnalysisResult,
} from "@ds";

const STEPS = ["Capture", "AI Analysis", "Review", "Mission created"];

const ANALYSIS_STEPS = [
  "Understanding image…",
  "Detecting road condition…",
  "Checking nearby incidents…",
  "Assessing safety…",
  "Generating report…",
];

const RESULT: AIAnalysisResult = {
  issueType: "Pothole cluster",
  severity: "High",
  severityTone: "warning",
  confidence: 0.9,
  objects: ["Pothole", "Cracked asphalt", "Standing water"],
  summary:
    "Several potholes detected along a high-traffic corridor; surface degradation is consistent with recent rainfall and heavy vehicle load.",
  safety:
    "Vehicles are swerving to avoid the largest pothole near the crosswalk. Prompt repair is recommended.",
  department: "Roads & Infrastructure",
};

type Review = {
  title: string;
  description: string;
  category: string;
  location: string;
  severity: string;
};

export default function ReportWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [files, setFiles] = useState<UploadItem[]>([]);
  const [note, setNote] = useState("");
  const [transcript, setTranscript] = useState("");
  const [address, setAddress] = useState("Near Market & 5th St, San Francisco");
  const [captureError, setCaptureError] = useState("");

  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [edited, setEdited] = useState<Record<keyof Review, boolean>>({
    title: false,
    description: false,
    category: false,
    location: false,
    severity: false,
  });

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const onNextCapture = () => {
    if (files.length === 0 && !transcript && !note) {
      setCaptureError("Please add at least one photo, voice note, or description.");
      return;
    }
    setCaptureError("");
    go(1);
  };

  const onAnalysisComplete = () => {
    setAnalysisComplete(true);
    setReview({
      title: "Pothole cluster on Market Street",
      description: transcript || note || RESULT.summary,
      category: RESULT.issueType,
      location: address,
      severity: RESULT.severity,
    });
  };

  const editField = (k: keyof Review, v: string) => {
    setReview((r) => (r ? { ...r, [k]: v } : r));
    setEdited((e) => ({ ...e, [k]: true }));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-2 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-caption text-text-muted transition hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Mission Control
        </button>
      </div>
      <h1 className="text-title">Report an incident</h1>
      <p className="mt-1 text-body text-text-muted">
        Add what you saw — CityOS will do the rest.
      </p>

      <div className="mt-8">
        <ProgressStepper steps={STEPS} current={step} />
      </div>

      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -32 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* STEP 1 — Capture */}
            {step === 0 && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <Field label="Photos or video" description="Drag in or capture from your camera.">
                    <FileUploader items={files} onItemsChange={setFiles} />
                  </Field>
                  <Field label="Voice note" description="Describe it out loud — we'll transcribe.">
                    <VoiceRecorder onTranscript={setTranscript} />
                  </Field>
                </div>
                <div className="space-y-6">
                  <Field label="Anything to add?">
                    <TextArea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      autoGrow
                      placeholder="Optional notes…"
                    />
                  </Field>
                  <Field label="Location">
                    <LocationPicker onChange={(_, a) => setAddress(a)} />
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 2 — AI Analysis */}
            {step === 1 && (
              <div className="mx-auto max-w-xl">
                <AIAnalysisPanel
                  steps={ANALYSIS_STEPS}
                  result={RESULT}
                  onComplete={onAnalysisComplete}
                />
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 2 && review && (
              <div className="mx-auto max-w-xl space-y-3">
                <p className="text-body text-text-muted">
                  CityOS drafted this from your report. Edit anything before
                  submitting.
                </p>
                <ReviewCard label="Title" value={review.title} edited={edited.title} onChange={(v) => editField("title", v)} />
                <ReviewCard label="Description" value={review.description} edited={edited.description} multiline onChange={(v) => editField("description", v)} />
                <ReviewCard label="Category" value={review.category} edited={edited.category} options={["Pothole cluster", "Drainage", "Signal outage", "Streetlight", "Other"]} onChange={(v) => editField("category", v)} />
                <ReviewCard label="Severity" value={review.severity} edited={edited.severity} options={["Critical", "High", "Medium", "Low"]} onChange={(v) => editField("severity", v)} />
                <ReviewCard label="Location" value={review.location} edited={edited.location} onChange={(v) => editField("location", v)} />
              </div>
            )}

            {/* STEP 4 — Success */}
            {step === 3 && (
              <SuccessScreen
                missionId="CITY-2291"
                onView={() => router.push("/operations")}
                onBack={() => router.push("/")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      {step < 3 && (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? router.push("/") : go(step - 1))}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>

          <div className="flex flex-col items-end">
            {step === 0 && captureError && (
              <ValidationMessage tone="error">{captureError}</ValidationMessage>
            )}
            {step === 0 && (
              <Button onClick={onNextCapture} className="mt-1.5">
                Analyze with AI
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            )}
            {step === 1 && (
              <Button onClick={() => go(2)} disabled={!analysisComplete}>
                Review draft
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            )}
            {step === 2 && (
              <Button onClick={() => go(3)}>
                Submit report
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
