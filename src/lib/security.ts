export async function generateAuditHash(payload: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload + '-' + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  } catch {
    // Fallback pseudo-hash if SubtleCrypto unavailable in sandbox
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = (hash << 5) - hash + payload.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0') + 'a8f902';
  }
}

export function maskSensitiveIdentifier(value: string, showLast = 4): string {
  if (!value) return '';
  if (value.length <= showLast) return value;
  const maskedLength = value.length - showLast;
  return '•'.repeat(maskedLength) + value.slice(maskedLength);
}

export function generateScreeningId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SYN-${year}-${randomDigits}`;
}

export function formatISODateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return isoString;
  }
}
