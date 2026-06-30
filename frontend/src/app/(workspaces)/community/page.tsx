"use client";

import { useState } from "react";
import { ThumbsUp, ShieldCheck, MessageCircle, ImageIcon } from "lucide-react";
import { MapCanvas, COMMUNITY_REPORTS } from "@/features/map";
import {
  IssueCard,
  DetailsDrawer,
  ContextCard,
  AIReasoning,
  Avatar,
  StatusDot,
} from "@ds";

const DISCUSSION = [
  { who: "Maya L.", text: "Almost tripped here yesterday — glad it's reported.", time: "2h" },
  { who: "Dev P.", text: "Added two more photos from the north side.", time: "1h" },
  { who: "Aria K.", text: "City crew tagged it this morning.", time: "20m" },
];

export default function Community() {
  const [openId, setOpenId] = useState<string | null>(null);
  const report = COMMUNITY_REPORTS.find((r) => r.id === openId) ?? null;

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4">
        <p className="text-overline uppercase tracking-widest text-text-subtle">
          Community
        </p>
        <h1 className="mt-1 text-heading">Reports & verification</h1>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        {/* Map */}
        <div className="col-span-12 min-h-[420px] lg:col-span-7">
          <MapCanvas
            defaultLayers={["community"]}
            showTimeline={false}
            showLayerSwitcher={false}
            showSearch={false}
            showLegend={false}
            showThinking={false}
            onSelectCommunity={(id) => setOpenId(id)}
          />
        </div>

        {/* Report list */}
        <div className="col-span-12 min-h-0 space-y-3 overflow-y-auto lg:col-span-5">
          <p className="text-overline uppercase text-text-subtle">Recent reports</p>
          {COMMUNITY_REPORTS.map((r) => (
            <IssueCard
              key={r.id}
              title={r.title}
              summary={r.summary}
              severity={r.tone}
              severityLabel={r.status}
              location="Pune"
              time="recent"
              confidence={Math.min(0.99, 0.7 + r.verifications * 0.05)}
              onClick={() => setOpenId(r.id)}
            />
          ))}
        </div>
      </div>

      <DetailsDrawer
        open={!!report}
        onClose={() => setOpenId(null)}
        kicker="Community report"
        title={report?.title ?? ""}
      >
        {report && (
          <>
            <StatusDot tone={report.tone} label={report.status} />
            <AIReasoning title="AI summary">{report.summary}</AIReasoning>

            <ContextCard kicker="Verification">
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-caption text-text-muted">
                  <ShieldCheck className="h-4 w-4 text-success" strokeWidth={1.75} />
                  {report.verifications} verified
                </span>
                <span className="flex items-center gap-1.5 text-caption text-text-muted">
                  <ThumbsUp className="h-4 w-4" strokeWidth={1.75} />
                  {report.votes} votes
                </span>
              </div>
            </ContextCard>

            <ContextCard kicker="Verification photos">
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-md bg-surface-muted text-text-subtle">
                    <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                ))}
              </div>
            </ContextCard>

            <div>
              <p className="mb-2 flex items-center gap-2 text-overline uppercase text-text-subtle">
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                Discussion
              </p>
              <div className="space-y-3">
                {DISCUSSION.map((d, i) => (
                  <div key={i} className="flex gap-3">
                    <Avatar name={d.who} size="sm" />
                    <div className="min-w-0">
                      <p className="text-caption">
                        <span className="font-medium text-text">{d.who}</span>{" "}
                        <span className="text-text-subtle">· {d.time}</span>
                      </p>
                      <p className="text-body text-text-muted">{d.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DetailsDrawer>
    </div>
  );
}
