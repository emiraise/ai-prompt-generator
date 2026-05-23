"use client";

import { useState } from "react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import Step1Hearing from "@/components/Step1Hearing";
import Step2Proposals from "@/components/Step2Proposals";
import Step3Prompt from "@/components/Step3Prompt";
import HistoryModal from "@/components/HistoryModal";
import { saveHistory } from "@/lib/history";
import { Category, HistoryEntry, Proposal } from "@/types";

type AppState =
  | { step: 1 }
  | { step: 2; category: Category; jobDescription: string; proposals: Proposal[] }
  | { step: 3; category: Category; jobDescription: string; proposals: Proposal[]; selectedProposal: Proposal; generatedPrompt: string };

export default function Home() {
  const [state,       setState]       = useState<AppState>({ step: 1 });
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleProposalsGenerated = (category: Category, jobDescription: string, proposals: Proposal[]) => {
    setState({ step: 2, category, jobDescription, proposals });
  };

  const handleProposalSelected = (proposal: Proposal, prompt: string) => {
    if (state.step !== 2) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      category: state.category,
      jobDescription: state.jobDescription,
      proposals: state.proposals,
      selectedProposal: proposal,
      generatedPrompt: prompt,
    };
    saveHistory(entry);
    setState({ step: 3, category: state.category, jobDescription: state.jobDescription, proposals: state.proposals, selectedProposal: proposal, generatedPrompt: prompt });
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setState({ step: 3, category: entry.category, jobDescription: entry.jobDescription, proposals: entry.proposals, selectedProposal: entry.selectedProposal, generatedPrompt: entry.generatedPrompt });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onHistoryClick={() => setHistoryOpen(true)} />
      <StepIndicator currentStep={state.step} />

      {state.step === 1 && <Step1Hearing onGenerate={handleProposalsGenerated} />}
      {state.step === 2 && (
        <Step2Proposals
          category={(state as Extract<AppState, { step: 2 }>).category}
          jobDescription={(state as Extract<AppState, { step: 2 }>).jobDescription}
          proposals={(state as Extract<AppState, { step: 2 }>).proposals}
          onSelect={handleProposalSelected}
          onBack={() => setState({ step: 1 })}
        />
      )}
      {state.step === 3 && (
        <Step3Prompt
          category={(state as Extract<AppState, { step: 3 }>).category}
          selectedProposal={(state as Extract<AppState, { step: 3 }>).selectedProposal}
          generatedPrompt={(state as Extract<AppState, { step: 3 }>).generatedPrompt}
          onRestart={() => setState({ step: 1 })}
        />
      )}

      <HistoryModal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onSelect={handleHistorySelect} />
    </div>
  );
}
