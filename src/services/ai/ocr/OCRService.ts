import { DocumentType, OCRResult, ExtractedField } from '../../../types';
import { DOCUMENT_SCHEMAS } from '../../../types/documentSchemas';
import { getApiGatewayConfig } from '../../apiConfig';

export interface IOCRService {
  extractDocumentData(
    imageUrl: string,
    documentType: DocumentType,
    rawTextInput?: string
  ): Promise<OCRResult>;
}

export function parseFieldsFromRawText(
  rawText: string,
  documentType: DocumentType
): { fields: Record<string, ExtractedField>; mrz?: string } {
  const fields: Record<string, ExtractedField> = {};
  const schema = DOCUMENT_SCHEMAS[documentType] || DOCUMENT_SCHEMAS.passport;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let mrzLines: string[] = [];

  for (const line of lines) {
    // Check if line looks like MRZ (contains < and mostly uppercase)
    if (line.includes('<') && line.length >= 28) {
      mrzLines.push(line);
      continue;
    }

    if (line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const keyStr = line.slice(0, colonIdx).trim().toLowerCase();
      const valStr = line.slice(colonIdx + 1).trim();

      for (const f of schema.fields) {
        const fieldKey = f.key.toLowerCase();
        const fieldLabel = f.label.toLowerCase();

        const isMatch =
          keyStr === fieldKey ||
          keyStr === fieldLabel ||
          (fieldKey.includes('name') && keyStr.includes('name')) ||
          (fieldKey.includes('number') && (keyStr.includes('num') || keyStr.includes('no') || keyStr.includes('id'))) ||
          (fieldKey.includes('birth') && (keyStr.includes('dob') || keyStr.includes('birth'))) ||
          (fieldKey.includes('expiry') && (keyStr.includes('exp') || keyStr.includes('valid until') || keyStr.includes('validity'))) ||
          (fieldKey.includes('issue') && keyStr.includes('issue')) ||
          (fieldKey.includes('nationality') && (keyStr.includes('nation') || keyStr.includes('country'))) ||
          (fieldKey.includes('gender') && (keyStr.includes('sex') || keyStr.includes('gender')));

        if (isMatch && !fields[f.key]) {
          fields[f.key] = {
            key: f.key,
            label: f.label,
            value: valStr,
            confidence: 1.0,
            status: 'valid',
            isMandatory: f.isMandatory
          };
          break;
        }
      }
    }
  }

  // Attempt regex extraction for unlabeled text
  if (!fields['documentNumber']) {
    const numMatch = rawText.match(/\b([A-Z][0-9]{7,8})\b/);
    if (numMatch) {
      fields['documentNumber'] = {
        key: 'documentNumber',
        label: 'Document Number',
        value: numMatch[1],
        confidence: 0.95,
        status: 'valid',
        isMandatory: true
      };
    }
  }

  const mrz = mrzLines.length > 0 ? mrzLines.join('\n') : undefined;

  return { fields, mrz };
}

export class RealOCRService implements IOCRService {
  async extractDocumentData(
    imageUrl: string,
    documentType: DocumentType,
    rawTextInput?: string
  ): Promise<OCRResult> {
    const config = getApiGatewayConfig();

    // 1. If the user provided manual/pasted real text, parse ONLY that real text
    if (rawTextInput && rawTextInput.trim().length > 0) {
      const parsed = parseFieldsFromRawText(rawTextInput, documentType);
      return {
        documentType,
        fields: parsed.fields,
        rawText: rawTextInput,
        mrz: parsed.mrz,
        overallConfidence: Object.keys(parsed.fields).length > 0 ? 0.98 : 0.85,
        processedAt: new Date().toISOString(),
        isApiConnected: false,
        apiMessage: 'Extracted from user-provided text buffer (Direct Text Access).'
      };
    }

    // 2. If a dedicated OCR API endpoint is configured, invoke it
    if (config.ocrUrl && config.ocrKey) {
      try {
        const res = await fetch(config.ocrUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.ocrKey}`
          },
          body: JSON.stringify({ image: imageUrl, documentType })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            ...data,
            documentType,
            processedAt: new Date().toISOString(),
            isApiConnected: true,
            apiMessage: 'Live OCR API processing successful.'
          };
        }
      } catch (err) {
        console.warn('Custom OCR API error:', err);
      }
    }

    // 3. If a Gemini API key is configured, perform real OCR with Gemini Vision
    if (config.geminiKey) {
      try {
        // Extract base64 part if data URL
        const base64Data = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl;
        const mimeType = imageUrl.includes('data:') ? imageUrl.split(';')[0].replace('data:', '') : 'image/jpeg';

        const prompt = `You are a high-precision document OCR engine. Inspect this ${documentType} image.
Return a clean JSON object with this exact structure (do not wrap in markdown or backticks):
{
  "rawText": "full raw text seen on document",
  "mrz": "mrz lines if present, else empty string",
  "fields": {
    "name": "full name if present",
    "documentNumber": "document or passport number",
    "nationality": "nationality code or name",
    "dateOfBirth": "date of birth",
    "gender": "gender or sex",
    "dateOfExpiry": "expiry date",
    "dateOfIssue": "issue date"
  }
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inlineData: { mimeType, data: base64Data } },
                  { text: prompt }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const result = await response.json();
          const rawTextResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedJson = rawTextResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedData = JSON.parse(cleanedJson);

          const fields: Record<string, ExtractedField> = {};
          if (parsedData.fields) {
            for (const [k, v] of Object.entries(parsedData.fields)) {
              if (v && typeof v === 'string' && v.trim()) {
                fields[k] = {
                  key: k,
                  label: k.toUpperCase(),
                  value: v.trim(),
                  confidence: 0.98,
                  status: 'valid',
                  isMandatory: true
                };
              }
            }
          }

          return {
            documentType,
            fields,
            rawText: parsedData.rawText || '',
            mrz: parsedData.mrz || undefined,
            overallConfidence: 0.97,
            processedAt: new Date().toISOString(),
            isApiConnected: true,
            apiMessage: 'Extracted via real Gemini Vision OCR engine.'
          };
        }
      } catch (err) {
        console.warn('Gemini OCR API error:', err);
      }
    }

    // 4. NO API CONFIGURED AND NO TEXT INPUT:
    // DO NOT hardcode or synthesize fake data.
    return {
      documentType,
      fields: {},
      rawText: '',
      overallConfidence: 0,
      processedAt: new Date().toISOString(),
      isApiConnected: false,
      apiMessage: 'No OCR or AI API is configured yet. Automated extraction is offline. Please input document text manually or configure an API key in the Gateway.'
    };
  }
}

export class APIOCRService extends RealOCRService {}
export class MockOCRService extends RealOCRService {}
