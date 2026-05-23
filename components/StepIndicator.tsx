import { MessageCircle, Lightbulb, Code2 } from "lucide-react";

type Props = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  { id: 1, label: "ヒアリング",   icon: MessageCircle },
  { id: 2, label: "業務提案",      icon: Lightbulb },
  { id: 3, label: "プロンプト作成", icon: Code2 },
];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 py-6 bg-white">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isDone   = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isActive
                    ? "bg-green-600 border-green-600 text-white"
                    : isDone
                    ? "bg-green-100 border-green-300 text-green-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={18} />
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-green-600" : isDone ? "text-green-400" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-2 mb-5 ${step.id < currentStep ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
