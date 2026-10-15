"use client";

import { useRef, useState } from "react";
import { analyze, AnalyzeError, type AnalyzeErrorKind } from "@/lib/api";
import type { AnalysisResult } from "@/lib/types";
import { AnalyzeForm } from "./AnalyzeForm";
import { ResultView } from "./results/ResultView";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResult }
  | { status: "error"; kind: AnalyzeErrorKind };

export function Analyzer() {
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  async function handleSubmit() {
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: "loading" });

    try {
      const result = await analyze(
        { job_text: jobText.trim(), cv_text: cvText.trim() },
        controller.signal,
      );
      setState({ status: "success", result });
    } catch (error) {
      // A cancelled request returns the user to the form without an error.
      if (controller.signal.aborted) return;
      setState({
        status: "error",
        kind: error instanceof AnalyzeError ? error.kind : "server",
      });
    }
  }

  function handleCancel() {
    controllerRef.current?.abort();
    setState({ status: "idle" });
  }

  if (state.status === "success") {
    return <ResultView result={state.result} onEdit={() => setState({ status: "idle" })} />;
  }

  return (
    <AnalyzeForm
      jobText={jobText}
      cvText={cvText}
      onJobTextChange={setJobText}
      onCvTextChange={setCvText}
      onSubmit={handleSubmit}
      loading={state.status === "loading"}
      onCancel={handleCancel}
    />
  );
}
