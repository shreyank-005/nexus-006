import React from 'react';
import {
  FileText,
  Camera,
  Cpu,
  ScanText,
  ShieldCheck,
  Search,
  UserCheck,
  Scale,
  CheckCircle2
} from 'lucide-react';

export interface PipelineStep {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, label: 'Document Type', sublabel: 'Standard Schema', icon: FileText },
  { id: 2, label: 'Capture / Text', sublabel: 'Input Acquisition', icon: Camera },
  { id: 3, label: 'Preprocessing', sublabel: 'Boundary & Deskew', icon: Cpu },
  { id: 4, label: 'OCR & Fields', sublabel: 'Zone Extraction', icon: ScanText },
  { id: 5, label: 'Validation', sublabel: 'Format & Checksum', icon: ShieldCheck },
  { id: 6, label: 'Forensics', sublabel: 'Tampering Check', icon: Search },
  { id: 7, label: 'Face Verify', sublabel: 'Biometric Match', icon: UserCheck },
  { id: 8, label: 'Risk Engine', sublabel: 'Decision Result', icon: Scale }
];

interface PipelineStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 select-none shadow-xs">
      <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2 scrollbar-thin">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = onStepClick && (isCompleted || step.id <= currentStep);

          return (
            <div key={step.id} className="flex items-center shrink-0">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 cursor-pointer border border-slate-200'
                    : 'text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold leading-tight whitespace-nowrap">
                    {step.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono leading-tight whitespace-nowrap hidden md:inline ${
                      isCurrent ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.sublabel}
                  </span>
                </div>
              </button>

              {idx < PIPELINE_STEPS.length - 1 && (
                <div
                  className={`w-3 lg:w-5 h-[1px] mx-1 shrink-0 ${
                    completedSteps.includes(step.id) ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
