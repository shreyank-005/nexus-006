export interface ApiGatewayConfig {
  geminiKey: string;
  ocrUrl: string;
  ocrKey: string;
  tamperingUrl: string;
  tamperingKey: string;
  faceUrl: string;
  faceKey: string;
  validationUrl: string;
  validationKey: string;
}

export function getApiGatewayConfig(): ApiGatewayConfig {
  let endpoints: Record<string, string> = {};
  let keys: Record<string, string> = {};

  try {
    const rawEndpoints = localStorage.getItem('synapse_custom_endpoints');
    if (rawEndpoints) endpoints = JSON.parse(rawEndpoints);
    const rawKeys = localStorage.getItem('synapse_custom_api_keys');
    if (rawKeys) keys = JSON.parse(rawKeys);
  } catch {}

  const geminiEnv = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  return {
    geminiKey: keys['gemini']?.trim() || geminiEnv || '',
    ocrUrl: endpoints['ocr']?.trim() || '',
    ocrKey: keys['ocr']?.trim() || '',
    tamperingUrl: endpoints['tampering']?.trim() || '',
    tamperingKey: keys['tampering']?.trim() || '',
    faceUrl: endpoints['face']?.trim() || '',
    faceKey: keys['face']?.trim() || '',
    validationUrl: endpoints['validation']?.trim() || '',
    validationKey: keys['validation']?.trim() || ''
  };
}

export function hasAnyApiConfigured(): boolean {
  const config = getApiGatewayConfig();
  return !!(
    config.geminiKey ||
    config.ocrKey ||
    config.tamperingKey ||
    config.faceKey ||
    config.validationKey
  );
}
