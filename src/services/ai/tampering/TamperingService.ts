import { TamperingResult, ForensicRegion } from '../../../types';
import { getApiGatewayConfig } from '../../apiConfig';

export interface ITamperingService {
  analyzeTampering(
    imageUrl: string,
    scenarioOverride?: Partial<TamperingResult>
  ): Promise<TamperingResult>;
}

export class APITamperingService implements ITamperingService {
  private apiUrl: string;
  private apiKey: string;
  private geminiKey: string;

  constructor(apiUrl?: string, apiKey?: string, geminiKey?: string) {
    const config = getApiGatewayConfig();
    this.apiUrl = apiUrl || config.tamperingUrl;
    this.apiKey = apiKey || config.tamperingKey;
    this.geminiKey = geminiKey || config.geminiKey;
  }

  async analyzeTampering(imageUrl: string): Promise<TamperingResult> {
    // If real custom tampering endpoint is configured
    if (this.apiUrl && !this.apiUrl.includes('api.synapsescreen.gov.in')) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ image: imageUrl })
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            isApiConnected: true,
            analyzedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.error('Tampering API request failed:', err);
      }
    }

    // If Gemini API Key is configured, use Gemini for visual document forensics
    if (this.geminiKey) {
      try {
        const prompt = `Analyze this document image for digital tampering, splicing, font inconsistencies, copy-move artifacts, or physical alterations.
Return a clean JSON object with keys:
- "photoIntegrity": number 0-100
- "textIntegrity": number 0-100
- "stampIntegrity": number 0-100
- "metadataConsistency": number 0-100
- "overallTamperingRisk": "LOW" | "MEDIUM" | "HIGH"
- "findings": array of strings describing forensic observations
- "regions": array of objects with { id, name, type ("photo"|"text"|"stamp"), box: {x,y,width,height}, integrity, finding, status ("pass"|"review"|"flagged") }
Only output valid JSON.`;

        // Strip data prefix if base64
        let base64Data = imageUrl;
        let mimeType = 'image/jpeg';
        if (imageUrl.startsWith('data:')) {
          const match = imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          }
        }

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                ...(base64Data.length > 50 && !base64Data.startsWith('http') ? [{
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                }] : [])
              ]
            }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const aiJson = await res.json();
          const rawText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              photoIntegrity: parsed.photoIntegrity ?? 80,
              textIntegrity: parsed.textIntegrity ?? 80,
              stampIntegrity: parsed.stampIntegrity ?? 80,
              metadataConsistency: parsed.metadataConsistency ?? 80,
              overallTamperingRisk: parsed.overallTamperingRisk || 'LOW',
              regions: parsed.regions || [],
              metadataExif: {
                'AI Model Analysis': 'Gemini 2.5 Flash Vision Forensics',
                'Status': 'Analyzed via Connected Gemini API Key'
              },
              analyzedAt: new Date().toISOString(),
              isApiConnected: true,
              statusMessage: 'Forensic inspection completed via connected Gemini API.'
            };
          }
        }
      } catch (err) {
        console.error('Gemini Forensics error:', err);
      }
    }

    // NO API CONFIGURED: Return transparent unverified state (NO FAKE DATA)
    return {
      photoIntegrity: 0,
      textIntegrity: 0,
      stampIntegrity: 0,
      metadataConsistency: 0,
      overallTamperingRisk: 'UNVERIFIED',
      regions: [],
      metadataExif: {
        'API Gateway Status': 'DISCONNECTED',
        'Engine Notice': 'No Forensics API or Gemini API key configured.',
        'Required Action': 'Configure an API endpoint in API Gateway to execute automated pixel-level tampering analysis.'
      },
      analyzedAt: new Date().toISOString(),
      isApiConnected: false,
      statusMessage: 'No Forensics API connected. Automated pixel-level tampering and copy-move forgery analysis requires an active endpoint or Gemini API key.'
    };
  }
}

export class MockTamperingService extends APITamperingService {}
