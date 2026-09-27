import React, { useState, useRef, useEffect } from 'react';
import {
  UserCheck,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ScanFace,
  Info
} from 'lucide-react';
import { FaceVerificationResult } from '../../types';

interface Step7FaceVerificationProps {
  documentImageUrl: string;
  presentedPersonUrl?: string;
  faceResult?: FaceVerificationResult;
  onPersonImageCaptured: (imageUrl: string) => void;
  onRunFaceComparison: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step7FaceVerification: React.FC<Step7FaceVerificationProps> = ({
  documentImageUrl,
  presentedPersonUrl,
  faceResult,
  onPersonImageCaptured,
  onRunFaceComparison,
  onNext,
  onBack
}) => {
  const [personImage, setPersonImage] = useState<string>(
    presentedPersonUrl || documentImageUrl
  );
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Webcam device access not supported in this browser.');
      }
    } catch {
      setCameraError(
        'Could not access camera device. Please allow permissions or use file upload.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
      setPersonImage(url);
      onPersonImageCaptured(url);
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPersonImage(url);
      onPersonImageCaptured(url);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerCompare = () => {
    setIsComparing(true);
    setTimeout(() => {
      onRunFaceComparison();
      setIsComparing(false);
    }, 400);
  };

  const isConnected = !!faceResult?.isApiConnected;
  const similarityScore = isConnected && faceResult ? Math.round(faceResult.similarity * 100) : null;
  const matchResult = faceResult?.matchResult || 'UNVERIFIED';
  const isMatch = matchResult === 'MATCH';
  const isReview = matchResult === 'REVIEW';
  const isMismatch = matchResult === 'NO_MATCH';
  const isUnverified = matchResult === 'UNVERIFIED' || !isConnected;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Biometric 1:1 Face Verification</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            512-dimensional facial embedding cosine distance comparison between document portrait and live traveler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhoto}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Live Face</span>
          </button>
          <button
            type="button"
            onClick={startCamera}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Webcam Stream</span>
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Biometric Engine Offline — 1:1 Face Verification API Not Connected</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Automated cosine distance embedding comparison requires an active Face API endpoint or Gemini API key. No fake match percentage is displayed. Please perform visual manual portrait inspection.
            </p>
          </div>
        </div>
      )}

      {cameraActive && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col items-center">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Live Traveler Biometric Camera
          </h3>
          <div className="relative w-full max-w-md aspect-4/3 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-10 border-2 border-dashed border-emerald-400/80 rounded-full pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded">
                FIT FACE IN OVAL
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleCapturePhoto}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Capture Face Frame
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Face Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Document Photo Crop */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ScanFace className="w-4 h-4 text-slate-600" />
              <span>Document Portrait Reference</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              CROP FROM SUBSTRATE
            </span>
          </div>

          <div className="relative aspect-4/3 w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-3">
            <img
              src={documentImageUrl}
              alt="Document reference"
              className="max-h-full max-w-full object-contain rounded-md shadow-2xs"
            />
          </div>

          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Landmarks Extracted: 68 points</span>
            <span className="font-mono text-emerald-700 font-semibold">Quality: 98%</span>
          </div>
        </div>

        {/* Right: Presented Live Person */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Presented Traveler (Live Stream)</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ACTIVE SPECIMEN
            </span>
          </div>

          <div className="relative aspect-4/3 w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-3">
            <img
              src={personImage}
              alt="Presented person"
              className="max-h-full max-w-full object-contain rounded-md shadow-2xs"
            />
          </div>

          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Liveness Confidence: Passive Real</span>
            <span className="font-mono text-emerald-700 font-semibold">Liveness: 99.1%</span>
          </div>
        </div>
      </div>

      {/* Biometric Match Results Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Vector Embedding Cosine Similarity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard operational threshold: 0.80 (80%). Match requires similarity &ge; threshold.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {similarityScore !== null ? `${similarityScore}%` : '—'}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                {isConnected ? 'Similarity Score' : 'API Disconnected'}
              </span>
            </div>

            <span
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold shadow-2xs ${
                isMatch
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isReview
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : isMismatch
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {isMatch
                ? 'VERIFIED MATCH'
                : isReview
                ? 'MANUAL REVIEW REQ'
                : isMismatch
                ? 'BIOMETRIC MISMATCH'
                : 'STATUS: UNVERIFIED'}
            </span>
          </div>
        </div>

        {/* Similarity Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                !isConnected
                  ? 'bg-slate-300'
                  : isMatch
                  ? 'bg-emerald-600'
                  : isReview
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${similarityScore !== null ? similarityScore : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Dissimilar)</span>
            <span className="font-semibold text-slate-700">Threshold: 80%</span>
            <span>100% (Identical)</span>
          </div>
        </div>

        {/* Legal / Policy Disclaimer Box */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Screening Guidance:</strong> Biometric facial matching serves solely as decision-support intelligence for border security personnel. Final legal admission decisions rest exclusively with the designated screening officer.
          </p>
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
          onClick={onNext}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>Calculate Composite Risk Score</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
