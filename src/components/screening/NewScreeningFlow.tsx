import React, { useState } from 'react';
import {
  DocumentType,
  ScreeningRecord,
  UserProfile,
  ImageQualityAssessment,
  OCRResult,
  DocumentValidationResult,
  TamperingResult,
  FaceVerificationResult,
  RiskEngineResult,
  ReviewDecision
} from '../../types';
import { PipelineStepper } from './PipelineStepper';
import { Step1DocumentType } from './Step1DocumentType';
import { Step2Capture } from './Step2Capture';
import { Step3Preprocessing } from './Step3Preprocessing';
import { Step4OCR } from './Step4OCR';
import { Step5Validation } from './Step5Validation';
import { Step6Forensics } from './Step6Forensics';
import { Step7FaceVerification } from './Step7FaceVerification';
import { Step8RiskEngine } from './Step8RiskEngine';
import { FinalResultView } from './FinalResultView';
import { AIServiceFactory } from '../../services/ai';
import { generateScreeningId } from '../../lib/security';
import { ScreeningStore } from '../../services/storage/screeningStore';

interface NewScreeningFlowProps {
  currentUser: UserProfile | null;
  onScreeningCompleted: (record: ScreeningRecord) => void;
  onDownloadReport: (record: ScreeningRecord) => void;
  onNavigateToHistory: () => void;
}

// Clean neutral placeholder when no document is uploaded yet
const BLANK_SPECIMEN_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><text x="50%" y="45%" text-anchor="middle" fill="%2364748b" font-family="system-ui,sans-serif" font-size="14" font-weight="600">AWAITING DOCUMENT INPUT</text><text x="50%" y="55%" text-anchor="middle" fill="%2394a3b8" font-family="system-ui,sans-serif" font-size="12">Upload an image, scan, or enter document text directly</text></svg>';

export const NewScreeningFlow: React.FC<NewScreeningFlowProps> = ({
  currentUser,
  onScreeningCompleted,
  onDownloadReport,
  onNavigateToHistory
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [screeningId] = useState<string>(generateScreeningId());

  // Screening Session State
  const [documentType, setDocumentType] = useState<DocumentType>('passport');
  const [isAutoDetect, setIsAutoDetect] = useState(false);
  const [documentImageUrl, setDocumentImageUrl] = useState<string>(BLANK_SPECIMEN_URL);
  const [documentImageName, setDocumentImageName] = useState<string>('document_input');
  const [rawTextCapture, setRawTextCapture] = useState<string>('');

  const [qualityAssessment, setQualityAssessment] = useState<ImageQualityAssessment>({
    overallPass: true,
    blurScore: 90,
    glareDetected: false,
    resolution: 'Standard Resolution',
    lightingQuality: 'OPTIMAL',
    cropDetected: true,
    orientationDegrees: 0
  });

  const [presentedPersonUrl, setPresentedPersonUrl] = useState<string>(BLANK_SPECIMEN_URL);

  // AI Pipeline Results
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [validationResult, setValidationResult] = useState<DocumentValidationResult | null>(null);
  const [tamperingResult, setTamperingResult] = useState<TamperingResult | null>(null);
  const [faceResult, setFaceResult] = useState<FaceVerificationResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskEngineResult | null>(null);
  const [completedRecord, setCompletedRecord] = useState<ScreeningRecord | null>(null);

  // Step 1: Document Type Selected
  const handleSelectDocType = (type: DocumentType, autoDetect?: boolean) => {
    setDocumentType(type);
    setIsAutoDetect(!!autoDetect);
  };

  // Step 2: Image Captured or Text Entered
  const handleImageCaptured = (
    url: string,
    fileName: string,
    quality: ImageQualityAssessment,
    rawText?: string
  ) => {
    setDocumentImageUrl(url);
    setDocumentImageName(fileName);
    setQualityAssessment(quality);
    if (rawText) {
      setRawTextCapture(rawText);
    }
  };

  // Step 3 -> 4: Run OCR
  const handleRunOCR = async () => {
    const ocrService = AIServiceFactory.getOCRService();
    const result = await ocrService.extractDocumentData(
      documentImageUrl,
      documentType,
      rawTextCapture
    );
    setOcrResult(result);
  };

  // Step 4 -> 5: Run Validation
  const handleRunValidation = async () => {
    if (!ocrResult) return;
    const valService = AIServiceFactory.getValidationService();
    const result = await valService.validateDocument(
      documentType,
      ocrResult
    );
    setValidationResult(result);
  };

  // Step 5 -> 6: Run Tampering
  const handleRunTampering = async () => {
    const tamperingService = AIServiceFactory.getTamperingService();
    const result = await tamperingService.analyzeTampering(documentImageUrl);
    setTamperingResult(result);
  };

  // Step 6 -> 7: Run Face Verification
  const handleRunFace = async () => {
    const faceService = AIServiceFactory.getFaceVerificationService();
    const result = await faceService.verifyFace(
      documentImageUrl,
      presentedPersonUrl
    );
    setFaceResult(result);
  };

  // Step 7 -> 8: Run Risk Engine
  const handleRunRiskEngine = async () => {
    if (!ocrResult || !validationResult || !tamperingResult) return;
    const riskService = AIServiceFactory.getRiskService();
    const result = await riskService.computeRisk({
      ocrResult,
      validationResult,
      tamperingResult,
      faceResult: faceResult || undefined
    });
    setRiskResult(result);

    // Build the completed record
    const record: ScreeningRecord = {
      id: screeningId,
      state: 'COMPLETED',
      documentType,
      autoDetected: isAutoDetect,
      documentImageName,
      documentImageUrl,
      presentedPersonImageUrl: presentedPersonUrl,
      rawInputText: rawTextCapture,
      qualityAssessment,
      ocrResult,
      validationResult,
      tamperingResult,
      faceResult: faceResult || undefined,
      riskResult: result,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      station: currentUser?.station || 'Integrated Checkpost Raxaul',
      officerId: currentUser?.id || 'usr_officer_910',
      officerName: currentUser?.fullName || 'Screening Officer'
    };

    setCompletedRecord(record);
  };

  // Navigation handlers across the 8 pipeline steps
  const goToNextStep = async () => {
    const next = currentStep + 1;
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (next === 4) {
      await handleRunOCR();
    } else if (next === 5) {
      await handleRunValidation();
    } else if (next === 6) {
      await handleRunTampering();
    } else if (next === 7) {
      await handleRunFace();
    } else if (next === 8) {
      await handleRunRiskEngine();
    }

    setCurrentStep(next);
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Field override in Step 4
  const handleUpdateOCRField = (key: string, value: string) => {
    if (!ocrResult) return;
    const updated = { ...ocrResult };
    if (updated.fields[key]) {
      updated.fields[key] = {
        ...updated.fields[key],
        value,
        status: 'valid'
      };
      setOcrResult(updated);
    }
  };

  // Final Officer Review Submission
  const handleSubmitReview = async (decision: ReviewDecision, notes: string) => {
    if (!completedRecord) return;
    const finalRecord: ScreeningRecord = {
      ...completedRecord,
      state:
        decision === 'CLEAR'
          ? 'COMPLETED'
          : decision === 'REVIEW_REQUIRED'
          ? 'REVIEW_REQUIRED'
          : 'ESCALATED',
      review: {
        officerId: currentUser?.id || 'usr_officer_910',
        officerName: currentUser?.fullName || 'Screening Officer',
        rank: currentUser?.rank || 'Screening Inspector',
        decision,
        notes,
        reviewedAt: new Date().toISOString(),
        digitalSignature: `SIG-SSB-${currentUser?.officialId || 'DEL-49102'}-${completedRecord.id.slice(-4)}`
      }
    };

    // Save in persistent store
    ScreeningStore.saveScreening(finalRecord);

    await ScreeningStore.recordAuditLog({
      timestamp: new Date().toISOString(),
      screeningId: finalRecord.id,
      officerId: currentUser?.id || 'usr_officer_910',
      officerName: currentUser?.fullName || 'Screening Officer',
      station: currentUser?.station || 'Integrated Checkpost Raxaul',
      action: 'OFFICER_REVIEWED',
      details: `Determination [${decision}] recorded for token ${finalRecord.id}. Rationalization: ${notes}`,
      status: decision === 'CLEAR' ? 'SUCCESS' : decision === 'REVIEW_REQUIRED' ? 'WARNING' : 'ALERT'
    });

    setCompletedRecord(finalRecord);
    onScreeningCompleted(finalRecord);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Interactive 8-Stage Progress Stepper */}
      <PipelineStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={step => {
          if (step <= currentStep || completedSteps.includes(step)) {
            setCurrentStep(step);
          }
        }}
      />

      {/* Step Render Switcher */}
      <div className="transition-all duration-200">
        {currentStep === 1 && (
          <Step1DocumentType
            selectedType={documentType}
            onSelectType={handleSelectDocType}
            onNext={goToNextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2Capture
            documentImageUrl={documentImageUrl}
            documentImageName={documentImageName}
            initialRawText={rawTextCapture}
            onImageCaptured={handleImageCaptured}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 3 && (
          <Step3Preprocessing
            documentImageUrl={documentImageUrl}
            quality={qualityAssessment}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 4 && ocrResult && (
          <Step4OCR
            ocrResult={ocrResult}
            onUpdateField={handleUpdateOCRField}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 5 && validationResult && (
          <Step5Validation
            validationResult={validationResult}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 6 && tamperingResult && (
          <Step6Forensics
            documentImageUrl={documentImageUrl}
            tamperingResult={tamperingResult}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 7 && (
          <Step7FaceVerification
            documentImageUrl={documentImageUrl}
            presentedPersonUrl={presentedPersonUrl}
            faceResult={faceResult || undefined}
            onPersonImageCaptured={setPresentedPersonUrl}
            onRunFaceComparison={handleRunFace}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 8 && riskResult && (
          <Step8RiskEngine
            riskResult={riskResult}
            onNext={() => setCurrentStep(9)}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 9 && completedRecord && (
          <FinalResultView
            screening={completedRecord}
            currentUser={currentUser}
            onSubmitReview={handleSubmitReview}
            onDownloadReport={() => onDownloadReport(completedRecord)}
            onNavigateToHistory={onNavigateToHistory}
          />
        )}
      </div>
    </div>
  );
};
