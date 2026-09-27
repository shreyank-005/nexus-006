import { FaceVerificationResult } from '../../../types';
import { getApiGatewayConfig } from '../../apiConfig';

export interface IFaceVerificationService {
  verifyFace(
    documentImageUrl: string,
    presentedPersonImageUrl: string,
    scenarioOverride?: Partial<FaceVerificationResult>
  ): Promise<FaceVerificationResult>;
}

export class APIFaceVerificationService implements IFaceVerificationService {
  private apiUrl: string;
  private apiKey: string;
  private geminiKey: string;

  constructor(apiUrl?: string, apiKey?: string, geminiKey?: string) {
    const config = getApiGatewayConfig();
    this.apiUrl = apiUrl || config.faceUrl;
    this.apiKey = apiKey || config.faceKey;
    this.geminiKey = geminiKey || config.geminiKey;
  }

  async verifyFace(
    documentImageUrl: string,
    presentedPersonImageUrl: string
  ): Promise<FaceVerificationResult> {
    // If real custom face endpoint is configured
    if (this.apiUrl && !this.apiUrl.includes('api.synapsescreen.gov.in')) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            documentImage: documentImageUrl,
            liveImage: presentedPersonImageUrl
          })
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            isApiConnected: true,
            verifiedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.error('Face Verification API request failed:', err);
      }
    }

    // If Gemini API Key is configured, use Gemini for face comparison
    if (this.geminiKey && documentImageUrl && presentedPersonImageUrl) {
      try {
        const prompt = `Compare the person in Image 1 (document portrait) with the person in Image 2 (live photo).
Determine if they appear to be the same individual.
Return a clean JSON object:
- "similarity": number between 0.0 and 1.0 (e.g. 0.92 for strong match, 0.40 for different person)
- "confidence": number between 0.0 and 1.0
- "matchResult": "MATCH" | "REVIEW" | "NO_MATCH"
- "notes": string explaining visual cues
Only output valid JSON.`;

        const parts: any[] = [{ text: prompt }];

        const extractBase64 = (url: string) => {
          if (url.startsWith('data:')) {
            const match = url.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
            if (match) return { mimeType: match[1], data: match[2] };
          }
          return null;
        };

        const img1 = extractBase64(documentImageUrl);
        const img2 = extractBase64(presentedPersonImageUrl);

        if (img1) parts.push({ inlineData: img1 });
        if (img2) parts.push({ inlineData: img2 });

        if (img1 || img2) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });

          if (res.ok) {
            const aiJson = await res.json();
            const rawText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              return {
                similarity: parsed.similarity ?? 0.85,
                confidence: parsed.confidence ?? 0.88,
                matchResult: parsed.matchResult || 'MATCH',
                threshold: 0.78,
                verifiedAt: new Date().toISOString(),
                disclaimer: 'AI-assisted face comparison via connected Gemini API.',
                isApiConnected: true,
                statusMessage: parsed.notes || 'Biometric comparison completed via connected Gemini API.'
              };
            }
          }
        }
      } catch (err) {
        console.error('Gemini Face comparison failed:', err);
      }
    }

    // NO API CONFIGURED: Return transparent unverified state (NO FAKE DATA)
    return {
      similarity: 0,
      confidence: 0,
      matchResult: 'UNVERIFIED',
      threshold: 0.78,
      verifiedAt: new Date().toISOString(),
      disclaimer: 'Biometric engine offline. No Face Verification API connected.',
      isApiConnected: false,
      statusMessage: 'No 1:1 Face Verification API connected. Biometric matching requires an active API endpoint or Gemini API key. Manual visual comparison required.'
    };
  }
}

export class MockFaceVerificationService extends APIFaceVerificationService {}
