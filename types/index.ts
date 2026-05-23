export type Category = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type Proposal = {
  title: string;
  description: string;
  hypothesis: string;   // 分析仮説
  difficulty: 1 | 2 | 3; // 1=初級 2=中級 3=上級
};

export type HistoryEntry = {
  id: string;
  createdAt: string;
  category: Category;
  jobDescription: string;
  proposals: Proposal[];
  selectedProposal: Proposal;
  generatedPrompt: string;
};
