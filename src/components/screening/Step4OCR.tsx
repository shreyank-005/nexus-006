import React, { useState } from 'react';
import {
  ScanText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileCode,
  Edit2,
  Save,
  Info,
  Copy,
  Download,
  Check,
  Type
} from 'lucide-react';
import { OCRResult, ExtractedField } from '../../types';

interface Step4OCRProps {
  ocrResult: OCRResult;
  onUpdateField: (key: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4OCR: React.FC<Step4OCRProps> = ({
  ocrResult,
  onUpdateField,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'rawText' | 'mrz'>('fields');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(false);

  // Raw text editable state
  const [rawTextState, setRawTextState] = useState<string>(ocrResult.rawText || '');

  const startEdit = (field: ExtractedField) => {
    setEditingKey(field.key);
    setEditValue(field.value);
  };

  const saveEdit = (key: string) => {
    onUpdateField(key, editValue);
    setEditingKey(null);
  };

  const handleCopyText = async () => {
    try {
      const textToCopy =
        activeTab === 'rawText'
          ? rawTextState
          : activeTab === 'mrz' && ocrResult.mrz
          ? ocrResult.mrz
          : Object.values(ocrResult.fields)
              .map(f => `${f.label}: ${f.value}`)
              .join('\n');
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const handleDownloadText = () => {
    const textContent =
      `SYNAPSE SCREENING RECORD - OCR EXTRACTED TEXT\n` +
      `Processed: ${ocrResult.processedAt}\n` +
      `Confidence: ${(ocrResult.overallConfidence * 100).toFixed(1)}%\n\n` +
      `-- EXTRACTED ATTRIBUTES --\n` +
      Object.values(ocrResult.fields)
        .map(f => `${f.label} [${f.key}]: ${f.value}`)
        .join('\n') +
      `\n\n-- MRZ ZONE --\n` +
      (ocrResult.mrz || 'None') +
      `\n\n-- RAW TEXT STREAM --\n` +
      (rawTextState || ocrResult.rawText);

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_document_text_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ScanText className="w-5 h-5 text-blue-600" />
            <span>OCR &amp; Document Text Extraction</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full access to optical text parsing, visual inspection zone attributes, and machine-readable data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy All Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadText}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Text (.txt)</span>
          </button>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold shadow-2xs ${
              ocrResult.isApiConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : ocrResult.rawText
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {ocrResult.isApiConnected
              ? `Confidence: ${(ocrResult.overallConfidence * 100).toFixed(1)}%`
              : ocrResult.rawText
              ? 'Operator Text Input'
              : 'OCR API Offline (0%)'}
          </div>
        </div>
      </div>

      {/* API / Text Status Banner */}
      {!ocrResult.isApiConnected && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              {ocrResult.rawText
                ? 'Processing in Direct Text Mode (No OCR API Connected)'
                : 'No OCR API Connected — Awaiting Input'}
            </span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {ocrResult.rawText
                ? 'Attributes have been parsed directly from your submitted document text stream. To enable automated image character recognition, configure an OCR endpoint or Gemini API key in the API Gateway.'
                : 'Automated image text extraction requires an active OCR endpoint or Gemini API key. You can switch to the "Raw Text Stream" tab below to paste or type document text directly, or configure an API key.'}
            </p>
          </div>
        </div>
      )}

      {/* Access Tabs: Structured Fields vs Raw Text Stream vs MRZ */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('fields')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'fields'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ScanText className="w-4 h-4" />
          <span>Extracted Attributes Table</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
            {Object.keys(ocrResult.fields).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rawText')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rawText'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Raw Text Stream (Direct Access)</span>
        </button>

        {ocrResult.mrz && (
          <button
            type="button"
            onClick={() => setActiveTab('mrz')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mrz'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>MRZ Monospace Lines</span>
          </button>
        )}
      </div>

      {/* Tab 1: Extracted Fields Table */}
      {activeTab === 'fields' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Extracted Identity Attributes
              </h3>
              <p className="text-[11px] text-slate-500">
                Click &apos;Edit&apos; to apply human-in-the-loop corrections if character misreads occur
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              ICAO / National Schema Conformance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
                  <th className="py-3 px-5 font-semibold">Attribute Field</th>
                  <th className="py-3 px-4 font-semibold">Extracted Value</th>
                  <th className="py-3 px-4 font-semibold">Confidence</th>
                  <th className="py-3 px-4 font-semibold">Syntax Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Officer Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(ocrResult.fields).map(field => {
                  const isEditing = editingKey === field.key;

                  return (
                    <tr key={field.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-5 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{field.label}</span>
                          {field.isMandatory && (
                            <span className="text-[9px] text-blue-700 bg-blue-50 border border-blue-200 px-1 rounded font-mono font-medium">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          key: {field.key}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="px-2.5 py-1 text-xs bg-white border border-blue-500 rounded-md text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => saveEdit(field.key)}
                              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                              title="Save Edit"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-slate-900 font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200/80 inline-block">
                            {field.value || '—'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-slate-700 font-medium">
                          {(field.confidence * 100).toFixed(1)}%
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {field.status === 'valid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Valid Syntax
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Review Flag
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-5 text-right">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => startEdit(field)}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Field"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Raw Document Text Stream (Direct Access) */}
      {activeTab === 'rawText' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Full Optical Text Buffer
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct view and editing access of the raw text extracted from the document
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {rawTextState.length} characters
            </span>
          </div>

          <textarea
            value={rawTextState}
            onChange={e => setRawTextState(e.target.value)}
            rows={12}
            className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
            <span>You can modify, copy, or append text directly to the inspection buffer.</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  // Parse any key:value lines into fields
                  const lines = rawTextState.split('\n');
                  for (const line of lines) {
                    if (line.includes(':')) {
                      const [k, ...v] = line.split(':');
                      const val = v.join(':').trim();
                      const keyLower = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                      for (const fKey of Object.keys(ocrResult.fields)) {
                        if (keyLower.includes(fKey.toLowerCase())) {
                          onUpdateField(fKey, val);
                        }
                      }
                    }
                  }
                  setActiveTab('fields');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                Parse &amp; Update Attributes Table
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Copy Text Buffer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MRZ Monospace View */}
      {activeTab === 'mrz' && ocrResult.mrz && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ICAO 9303 Machine Readable Zone (MRZ)
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct optical reading of TD3 line matrix
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              MRZ SUBSTRATE DETECTED
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 tracking-widest leading-loose select-all overflow-x-auto">
            {ocrResult.mrz.split('\n').map((line, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 select-none w-12">LINE {idx + 1}:</span>
                <span className="font-bold text-slate-900">{line}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-[10px] block">Line 1 Length</span>
              <span className="text-slate-900 font-bold font-mono">
                {ocrResult.mrz.split('\n')[0]?.length || 0} characters
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 text-[10px] block">Line 2 Length</span>
              <span className="text-slate-900 font-bold font-mono">
                {ocrResult.mrz.split('\n')[1]?.length || 0} characters
              </span>
            </div>
          </div>
        </div>
      )}

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
          <span>Proceed to Document Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
