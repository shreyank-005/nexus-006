# AI Service Integration Specification & Microservice Contracts

This guide documents the API schemas, network requirements, authentication models, and error handling policies required to connect production deep learning microservices to **SYNAPSE SCREEN**.

---

## 1. Global Architecture Principles

All AI services are decoupled behind interface adapters in `src/services/ai/`. 
The frontend workstation interacts strictly with the `AIServiceFactory`. When `AI_MODE="production"`, the factory invokes HTTP microservice clients (`APIOCRService`, `APITamperingService`, `APIFaceVerificationService`, `APIValidationService`, `APIRiskService`).

- **Authentication**: Bearer tokens via `Authorization: Bearer <API_KEY>` header.
- **Payload Format**: `application/json` with Base64 data URLs or signed Cloud Storage URLs.
- **Fail-Safe Policy**: Microservice network timeouts, 5xx responses, or unparseable JSON MUST NOT crash the workstation. The client automatically falls back to secondary inspection modes with visible operational flags.

---

## 2. OCR & Field Extraction Microservice

### Target Code Location
- File: `src/services/ai/ocr/OCRService.ts`
- Placeholder: `// INSERT OCR API HERE`
- Class: `APIOCRService.extractDocumentData()`

### Endpoint Specification
- **Method**: `POST`
- **Recommended Endpoint**: `/v1/ocr/extract`
- **Timeout**: `4500ms`

### Request Payload
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "documentType": "passport",
  "options": {
    "extractMRZ": true,
    "detectHandwriting": false,
    "targetDPI": 300
  }
}
```

### Expected Response Payload
```json
{
  "documentType": "passport",
  "overallConfidence": 0.985,
  "rawText": "REPUBLIC OF INDIA PASSPORT...",
  "mrz": "P<INDKUMAR<<RAHUL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\nP1234567<4IND9804128M3101142<<<<<<<<<<<<<<<4",
  "fields": {
    "name": {
      "key": "name",
      "label": "Full Legal Name",
      "value": "KUMAR, RAHUL",
      "confidence": 0.99,
      "status": "valid",
      "isMandatory": true
    },
    "documentNumber": {
      "key": "documentNumber",
      "label": "Passport Number",
      "value": "P1234567",
      "confidence": 0.995,
      "status": "valid",
      "isMandatory": true
    }
  }
}
```

---

## 3. Forensic Tampering & Splicing Detection Microservice

### Target Code Location
- File: `src/services/ai/tampering/TamperingService.ts`
- Placeholder: `// INSERT TAMPERING DETECTION MODEL/API HERE`
- Class: `APITamperingService.analyzeTampering()`

### Endpoint Specification
- **Method**: `POST`
- **Recommended Endpoint**: `/v1/forensics/analyze`
- **Timeout**: `6000ms`

### Request Payload
```json
{
  "image": "data:image/jpeg;base64,...",
  "includeHeatmap": true,
  "analysisLayers": ["ela", "noiseprint", "jpeg_ghost", "guilloche"]
}
```

### Expected Response Payload
```json
{
  "photoIntegrity": 95.0,
  "textIntegrity": 97.5,
  "stampIntegrity": 92.0,
  "metadataConsistency": 90.0,
  "overallTamperingRisk": "LOW",
  "regions": [
    {
      "id": "reg_photo_01",
      "name": "Bearer Portrait Zone",
      "type": "photo",
      "box": { "x": 8, "y": 32, "width": 26, "height": 48 },
      "integrity": 95.0,
      "finding": "Continuous noise distribution; no edge splicing halo detected.",
      "confidence": 0.94,
      "status": "pass"
    }
  ],
  "metadataExif": {
    "Acquisition Device": "Flatbed Scanner",
    "Compression Baseline": "Standard JPEG Q96"
  }
}
```

---

## 4. 1:1 Biometric Face Verification Microservice

### Target Code Location
- File: `src/services/ai/face/FaceVerificationService.ts`
- Placeholder: `// INSERT FACE VERIFICATION MODEL/API HERE`
- Class: `APIFaceVerificationService.verifyFace()`

### Endpoint Specification
- **Method**: `POST`
- **Recommended Endpoint**: `/v1/face/verify-1to1`
- **Timeout**: `3000ms`

### Request Payload
```json
{
  "documentImage": "data:image/jpeg;base64,...",
  "liveImage": "data:image/jpeg;base64,...",
  "cropDocumentFace": true
}
```

### Expected Response Payload
```json
{
  "similarity": 0.962,
  "confidence": 0.958,
  "matchResult": "MATCH",
  "threshold": 0.78,
  "disclaimer": "AI-assisted face comparison. Final decision remains with authorized personnel."
}
```

---

## 5. Document Validation & National Registry Service

### Target Code Location
- File: `src/services/ai/validation/ValidationService.ts`
- Placeholder: `// INSERT AUTHORIZED DOCUMENT VALIDATION API HERE`
- Class: `APIValidationService.validateDocument()`

### Endpoint Specification
- **Method**: `POST`
- **Recommended Endpoint**: `/v1/registry/validate`
- **Timeout**: `4000ms`

### Expected Response Payload
```json
{
  "isValid": true,
  "referenceDbStatus": "CONNECTED",
  "referenceDbMessage": "Authoritative registry check executed against central CCTNS & IVFRT cache.",
  "checks": [
    {
      "id": "chk_format",
      "label": "Document Number Syntax Compliance",
      "category": "format",
      "passed": true,
      "status": "valid",
      "detail": "Alphanumeric mask matches standard issuing criteria."
    }
  ]
}
```

---

## 6. Composite Bayesian Risk Engine

### Target Code Location
- File: `src/services/ai/risk/RiskService.ts`
- Placeholder: `// INSERT RISK ENGINE MODEL/API HERE`
- Class: `APIRiskService.computeRisk()`

### Expected Response Payload
```json
{
  "score": 18,
  "level": "LOW",
  "factors": [
    {
      "id": "f_biometric_match",
      "label": "Biometric Face Match Verified",
      "delta": -20,
      "description": "Live face matches document photo (96.2% similarity).",
      "category": "biometric"
    }
  ],
  "findingsSummary": [
    {
      "text": "High optical fidelity across all character zones",
      "type": "pass",
      "module": "OCR"
    }
  ]
}
```
