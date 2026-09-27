import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  Stamp,
  Car,
  Compass,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { DocumentType } from '../../types';
import { DOCUMENT_SCHEMAS } from '../../types/documentSchemas';

interface Step1DocumentTypeProps {
  selectedType: DocumentType;
  onSelectType: (type: DocumentType, isAutoDetect?: boolean) => void;
  onNext: () => void;
}

export const Step1DocumentType: React.FC<Step1DocumentTypeProps> = ({
  selectedType,
  onSelectType,
  onNext
}) => {
  const [isAutoDetect, setIsAutoDetect] = useState(false);

  const docOptions: Array<{
    type: DocumentType;
    label: string;
    description: string;
    standard: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      type: 'passport',
      label: 'Passport',
      description: 'International & National Travel Document with ICAO TD3 MRZ Zone',
      standard: 'ICAO Doc 9303 Part 4',
      icon: FileText
    },
    {
      type: 'visa',
      label: 'Entry / Transit Visa',
      description: 'Immigration visa authorization sticker with MRV-A/B format',
      standard: 'ICAO Doc 9303 Part 7',
      icon: Stamp
    },
    {
      type: 'national_id',
      label: 'National ID / Aadhaar',
      description: 'Official citizen identity card with QR / 12-digit UID verification',
      standard: 'ISO/IEC 7810 ID-1',
      icon: CreditCard
    },
    {
      type: 'driving_licence',
      label: 'Driving Licence',
      description: 'Motor vehicle operator license with class endorsement & chip/QR',
      standard: 'ISO/IEC 18013 / MoRTH',
      icon: Car
    },
    {
      type: 'travel_permit',
      label: 'Frontier Travel Permit',
      description: 'Border checkpost transit token and border movement slip',
      standard: 'Border Protocol 2024',
      icon: Compass
    },
    {
      type: 'residence_permit',
      label: 'Residence Permit',
      description: 'Alien permanent or temporary residency card with biometrics',
      standard: 'Uniform Format EU / USCIS',
      icon: CreditCard
    }
  ];

  const currentSchema = DOCUMENT_SCHEMAS[selectedType] || DOCUMENT_SCHEMAS.passport;

  const handleSelect = (type: DocumentType) => {
    setIsAutoDetect(false);
    onSelectType(type, false);
  };

  const handleAutoDetectToggle = () => {
    setIsAutoDetect(true);
    onSelectType('passport', true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Select Document Classification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Specify the identity substrate type to activate matching ICAO / national extraction schemas.
          </p>
        </div>

        {/* Auto Detect Option */}
        <button
          type="button"
          onClick={handleAutoDetectToggle}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
            isAutoDetect
              ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Auto-Detect Document Substrate</span>
        </button>
      </div>

      {isAutoDetect && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Auto-Detection Enabled:</strong> Image preprocessing and OCR will dynamically inspect optical markers, aspect ratios, and MRZ bounding boxes to infer the document type.
          </span>
        </div>
      )}

      {/* Grid of Document Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {docOptions.map(option => {
          const Icon = option.icon;
          const isSelected = selectedType === option.type && !isAutoDetect;

          return (
            <div
              key={option.type}
              onClick={() => handleSelect(option.type)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {option.standard}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{option.label}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-medium">Standard schema ready</span>
                <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                  {isSelected ? 'Active' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Schema Technical Summary Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Configured Verification Rules: {currentSchema.title}</span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Category: {currentSchema.category} · Standard: {currentSchema.standard}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-600 font-medium block">Total Field Rules</span>
            <span className="text-slate-900 font-semibold font-mono text-xs">
              {currentSchema.fields.length} attributes
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-600 font-medium block">Mandatory Fields</span>
            <span className="text-slate-900 font-semibold font-mono text-xs">
              {currentSchema.fields.filter(f => f.isMandatory).length} required
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-600 font-medium block">Machine Readable Zone</span>
            <span className="text-slate-900 font-semibold font-mono text-xs">
              {currentSchema.hasMRZ ? 'MRZ Mandatory' : 'None (VIZ Only)'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-600 font-medium block">Verification Standard</span>
            <span className="text-slate-900 font-semibold font-mono text-xs truncate">
              {currentSchema.standard}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation action button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>Continue to Document &amp; Text Acquisition</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
