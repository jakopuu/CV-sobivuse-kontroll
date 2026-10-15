"use client";

import { useState } from "react";
import { AnalyzeForm } from "./AnalyzeForm";

export function Analyzer() {
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");

  return (
    <AnalyzeForm
      jobText={jobText}
      cvText={cvText}
      onJobTextChange={setJobText}
      onCvTextChange={setCvText}
      onSubmit={() => {}}
    />
  );
}
