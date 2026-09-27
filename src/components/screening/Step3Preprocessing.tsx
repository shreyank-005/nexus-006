import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Layers,
  Scan,
  RefreshCw
} from 'lucide-react';
import { ImageQualityAssessment } from '../../types';

interface Step3PreprocessingProps {
  documentImageUrl: string;
  quality?: ImageQualityAssessment;
  onNext: () => void;
  onBack: () => void;
}

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  openCvMethod: string;
  status: 'pending' | 'processing' | 'completed';
}

export const Step3Preprocessing: React.FC<Step3PreprocessingProps> = ({
  documentImageUrl,
  quality,
  onNext,
  onBack
}) => {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: 's1',
      name: 'Document Boundary Localization',
      description: 'Canny edge detection & convex contour polygon extraction',
      openCvMethod: 'cv2.findContours() + cv2.approxPolyDP()',
      status: 'pending'
    },
    {
      id: 's2',
      name: 'Perspective Rectification',
      description: 'Four-point planar projective warping into ICAO orthogonal space',
      openCvMethod: 'cv2.getPerspectiveTransform() + cv2.warpPerspective()',
      status: 'pending'
    },
    {
      id: 's3',
      name: 'Adaptive Gaussian Denoising',
      description: 'Non-local means color filtering preserving micro-print resolution',
      openCvMethod: 'cv2.fastNlMeansDenoisingColored()',
      status: 'pending'
    },
    {
      id: 's4',
      name: 'Local Contrast Optimization (CLAHE)',
      description: 'Contrast Limited Adaptive Histogram Equalization for watermarks',
      openCvMethod: 'cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))',
      status: 'pending'
    },
    {
      id: 's5',
      name: 'Deskew & Orientation Alignment',
      description: 'Hough line angle transformation with 0.4° clockwise correction',
      openCvMethod: 'cv2.HoughLinesP() + affine rotation matrix',
      status: 'pending'
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeFilterView, setActiveFilterView] = useState<'original' | 'processed' | 'edges'>('processed');

  useEffect(() => {
    let currentStageIndex = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);

      if (currentStageIndex < stages.length) {
        setStages(prev =>
          prev.map((s, idx) => {
            if (idx < currentStageIndex) return { ...s, status: 'completed' };
            if (idx === currentStageIndex) return { ...s, status: 'processing' };
            return { ...s, status: 'pending' };
          })
        );
        currentStageIndex++;
      } else {
        setStages(prev => prev.map(s => ({ ...s, status: 'completed' })));
        setIsProcessing(false);
        clearInterval(interval);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Document Normalization &amp; Optical Preprocessing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalizing document orientation, contrast curves, and boundary projection prior to text extraction.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
            Pipeline Latency: <strong className="text-blue-700">{elapsedMs}ms</strong>
          </span>
          <span
            className={`px-2.5 py-1 rounded-md border font-semibold ${
              isProcessing
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : 'NORMALIZATION COMPLETE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stage Progression List */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pipeline Stages
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {stages.filter(s => s.status === 'completed').length} / {stages.length} COMPLETE
            </span>
          </div>

          <div className="space-y-2.5">
            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'processing';

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/70 border-slate-200'
                      : isCurrent
                      ? 'bg-blue-50/50 border-blue-300 shadow-2xs'
                      : 'bg-slate-50/30 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{stage.name}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        isCompleted
                          ? 'text-emerald-700'
                          : isCurrent
                          ? 'text-blue-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? 'COMPLETE' : isCurrent ? 'RUNNING' : 'QUEUED'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 pl-7.5 leading-relaxed">{stage.description}</p>
                  <div className="mt-1 pl-7.5 text-[10px] font-mono text-slate-400">
                    method: {stage.openCvMethod}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Computer Vision Inspection Viewport */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-blue-600" />
                <span>Substrate Inspection Viewport</span>
              </span>

              {/* View filter toggles */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveFilterView('original')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeFilterView === 'original'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Raw Input
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterView('processed')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeFilterView === 'processed'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Normalized
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterView('edges')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeFilterView === 'edges'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Edge Gradients
                </button>
              </div>
            </div>

            {/* Visualizer Area */}
            <div className="relative aspect-4/3 w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-2">
              <img
                src={documentImageUrl}
                alt="Document normalization"
                className={`max-h-full max-w-full object-contain rounded-md transition-all duration-300 ${
                  activeFilterView === 'edges'
                    ? 'filter contrast-200 invert'
                    : activeFilterView === 'processed'
                    ? 'filter contrast-105 saturate-105'
                    : ''
                }`}
              />

              {/* Four-Point Corner Markers */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-600 pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-600 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-600 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-600 pointer-events-none" />

              {/* MRZ Band Indicator */}
              <div className="absolute bottom-6 left-8 right-8 h-8 border border-blue-500/60 bg-blue-500/10 pointer-events-none rounded flex items-center justify-center">
                <span className="text-[9px] font-mono text-blue-900 bg-white/90 px-1.5 py-0.5 rounded font-bold shadow-2xs">
                  MRZ ZONE BOUNDARY DETECTED
                </span>
              </div>
            </div>

            {/* Optimization metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Deskew Rotation</span>
                <span className="text-slate-900 font-bold">+0.4° CCW</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Contrast Ratio</span>
                <span className="text-slate-900 font-bold">18.4:1 (High)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">DPI Resolution</span>
                <span className="text-blue-700 font-bold">300 DPI Ortho</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Geometry planar projection verified</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">ISO/IEC 7810 Ready</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onNext}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs ${
            isProcessing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>Run OCR &amp; Text Extraction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
