import {
  OCRResult,
  DocumentValidationResult,
  TamperingResult,
  FaceVerificationResult,
  RiskEngineResult,
  RiskFactor
} from '../../../types';
import { getApiGatewayConfig } from '../../apiConfig';

export interface IRiskService {
  computeRisk(params: {
    ocrResult: OCRResult;
    validationResult: DocumentValidationResult;
    tamperingResult: TamperingResult;
    faceResult?: FaceVerificationResult;
    scenarioOverride?: Partial<RiskEngineResult>;
  }): Promise<RiskEngineResult>;
}

export class APIRiskService implements IRiskService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    const config = getApiGatewayConfig();
    this.apiUrl = apiUrl || '';
    this.apiKey = apiKey || '';
  }

  async computeRisk({
    ocrResult,
    validationResult,
    tamperingResult,
    faceResult
  }: {
    ocrResult: OCRResult;
    validationResult: DocumentValidationResult;
    tamperingResult: TamperingResult;
    faceResult?: FaceVerificationResult;
    scenarioOverride?: Partial<RiskEngineResult>;
  }): Promise<RiskEngineResult> {
    const isCustomApiConfigured = !!(this.apiUrl && !this.apiUrl.includes('api.synapsescreen.gov.in') && this.apiKey);

    if (isCustomApiConfigured) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ ocrResult, validationResult, tamperingResult, faceResult })
        });

        if (response.ok) {
          const result = await response.json();
          return {
            ...result,
            isApiConnected: true,
            calculatedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.error('Risk API error:', err);
      }
    }

    const hasAnyAutomatedEngine = !!(
      ocrResult.isApiConnected ||
      tamperingResult.isApiConnected ||
      faceResult?.isApiConnected
    );

    // If NO automated AI engine is connected and no input was provided
    const factors: RiskFactor[] = [];
    const findingsSummary: Array<{
      text: string;
      type: 'pass' | 'warning' | 'alert';
      module: 'OCR' | 'VALIDATION' | 'FORENSICS' | 'FACE' | 'ENGINE';
    }> = [];

    // 1. OCR findings
    if (ocrResult.isApiConnected) {
      findingsSummary.push({
        text: `OCR API executed with ${(ocrResult.overallConfidence * 100).toFixed(1)}% confidence`,
        type: ocrResult.overallConfidence > 0.8 ? 'pass' : 'warning',
        module: 'OCR'
      });
      if (ocrResult.overallConfidence > 0.9) {
        factors.push({
          id: 'f_ocr_pass',
          label: 'High OCR Extraction Quality',
          delta: -10,
          description: 'Document text extracted with high character recognition fidelity.',
          category: 'mrz'
        });
      }
    } else if (ocrResult.rawText) {
      findingsSummary.push({
        text: 'Document text supplied via manual operator entry (OCR API not connected)',
        type: 'pass',
        module: 'OCR'
      });
      factors.push({
        id: 'f_ocr_manual',
        label: 'Manual Text Entry Supplied',
        delta: 0,
        description: 'Text was entered by operator for deterministic format validation.',
        category: 'mrz'
      });
    } else {
      findingsSummary.push({
        text: 'OCR Engine Offline: No automated character extraction API connected',
        type: 'warning',
        module: 'OCR'
      });
    }

    // 2. Validation findings
    const invalidChecks = validationResult.checks.filter(c => c.status === 'invalid');
    const warningChecks = validationResult.checks.filter(c => c.status === 'warning');

    if (invalidChecks.length > 0) {
      factors.push({
        id: 'f_val_invalid',
        label: 'Document Validation Invalidation',
        delta: 30,
        description: invalidChecks.map(c => c.label).join(', '),
        category: 'validity'
      });
      findingsSummary.push({
        text: `Validation failed: ${invalidChecks.map(c => c.label).join(', ')}`,
        type: 'alert',
        module: 'VALIDATION'
      });
    } else if (warningChecks.length > 0) {
      factors.push({
        id: 'f_val_warn',
        label: 'External Database or Syntax Warning',
        delta: 10,
        description: 'External registry database query skipped (endpoint not configured).',
        category: 'validity'
      });
      findingsSummary.push({
        text: 'Database check skipped (Watchlist API offline). Visual syntax check passed.',
        type: 'warning',
        module: 'VALIDATION'
      });
    }

    // 3. Forensics findings
    if (tamperingResult.isApiConnected) {
      findingsSummary.push({
        text: `Forensic tampering engine status: ${tamperingResult.overallTamperingRisk}`,
        type: tamperingResult.overallTamperingRisk === 'LOW' ? 'pass' : 'alert',
        module: 'FORENSICS'
      });
      if (tamperingResult.overallTamperingRisk === 'HIGH') {
        factors.push({
          id: 'f_tamper_high',
          label: 'Digital Alteration Suspected',
          delta: 40,
          description: 'Forensics API flagged anomalies in photo or text zones.',
          category: 'tampering'
        });
      }
    } else {
      findingsSummary.push({
        text: 'Forensics Engine Offline: Pixel tampering & splicing analysis requires an active API endpoint',
        type: 'warning',
        module: 'FORENSICS'
      });
    }

    // 4. Face findings
    if (faceResult?.isApiConnected) {
      findingsSummary.push({
        text: `Biometric face comparison: ${faceResult.matchResult} (${(faceResult.similarity * 100).toFixed(1)}%)`,
        type: faceResult.matchResult === 'MATCH' ? 'pass' : 'alert',
        module: 'FACE'
      });
      if (faceResult.matchResult === 'NO_MATCH') {
        factors.push({
          id: 'f_face_mismatch',
          label: 'Biometric Face Mismatch Flagged',
          delta: 45,
          description: 'Presented individual does not match document photo.',
          category: 'biometric'
        });
      }
    } else {
      findingsSummary.push({
        text: 'Biometric Engine Offline: 1:1 face verification API not configured',
        type: 'warning',
        module: 'FACE'
      });
    }

    // Determine final score and level
    if (!hasAnyAutomatedEngine) {
      findingsSummary.push({
        text: 'All automated AI detection engines are offline. Officer physical document review required.',
        type: 'warning',
        module: 'ENGINE'
      });

      return {
        score: invalidChecks.length > 0 ? 75 : 0,
        level: invalidChecks.length > 0 ? 'HIGH' : 'UNVERIFIED',
        factors,
        findingsSummary,
        calculatedAt: new Date().toISOString(),
        isApiConnected: false,
        statusMessage: 'Automated AI scoring engines are offline. No artificial scores generated. Physical inspection mandatory.'
      };
    }

    let calculatedScore = 20;
    factors.forEach(f => {
      calculatedScore += f.delta;
    });
    const finalScore = Math.max(0, Math.min(100, calculatedScore));

    const level =
      finalScore <= 25 ? 'LOW' : finalScore <= 50 ? 'MEDIUM' : finalScore <= 75 ? 'HIGH' : 'CRITICAL';

    return {
      score: finalScore,
      level,
      factors,
      findingsSummary,
      calculatedAt: new Date().toISOString(),
      isApiConnected: true,
      statusMessage: 'Multi-signal risk computed with active AI service connection.'
    };
  }
}

export class MockRiskService extends APIRiskService {}
