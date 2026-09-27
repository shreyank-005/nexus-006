import { DocumentType } from './index';

export interface FieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  isMandatory: boolean;
  type: 'text' | 'date' | 'select';
  options?: string[];
  description: string;
  validationRegex?: string;
}

export interface DocumentSchema {
  type: DocumentType;
  title: string;
  category: string;
  standard: string;
  fields: FieldDefinition[];
  hasMRZ: boolean;
}

export const DOCUMENT_SCHEMAS: Record<DocumentType, DocumentSchema> = {
  passport: {
    type: 'passport',
    title: 'International / National Passport',
    category: 'Travel & Border Document',
    standard: 'ICAO Doc 9303 Part 4 (TD3)',
    hasMRZ: true,
    fields: [
      { key: 'name', label: 'Full Legal Name', placeholder: 'SURNAME, GIVEN NAMES', isMandatory: true, type: 'text', description: 'Primary legal name as recorded in visual zone and MRZ' },
      { key: 'documentNumber', label: 'Passport Number', placeholder: 'e.g. P1829472', isMandatory: true, type: 'text', description: 'Unique 8-9 character alphanumeric identifier', validationRegex: '^[A-Z0-9]{8,9}$' },
      { key: 'nationality', label: 'Nationality / State Code', placeholder: 'IND / USA / GBR', isMandatory: true, type: 'text', description: 'ISO 3166-1 alpha-3 code' },
      { key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Birthdate formatted ISO or DD/MM/YYYY' },
      { key: 'gender', label: 'Gender', placeholder: 'M / F / X', isMandatory: true, type: 'select', options: ['M', 'F', 'X'], description: 'Gender marker' },
      { key: 'dateOfIssue', label: 'Date of Issue', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Issuing authority stamp date' },
      { key: 'dateOfExpiry', label: 'Date of Expiry', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Must have at least 6 months validity for international transit' }
    ]
  },
  visa: {
    type: 'visa',
    title: 'Entry / Transit Visa Permit',
    category: 'Immigration & Entry Authorization',
    standard: 'ICAO Doc 9303 Part 7 (MRV)',
    hasMRZ: true,
    fields: [
      { key: 'visaNumber', label: 'Visa Number', placeholder: 'e.g. V9821410', isMandatory: true, type: 'text', description: 'Unique visa control number' },
      { key: 'visaType', label: 'Visa Category / Class', placeholder: 'TOURIST / BUSINESS / TRANSIT', isMandatory: true, type: 'select', options: ['TOURIST', 'BUSINESS', 'EMPLOYMENT', 'STUDENT', 'TRANSIT', 'DIPLOMATIC'], description: 'Permitted activity classification' },
      { key: 'name', label: 'Full Bearer Name', placeholder: 'SURNAME, GIVEN NAMES', isMandatory: true, type: 'text', description: 'Name of visa holder' },
      { key: 'passportNumber', label: 'Linked Passport Number', placeholder: 'e.g. P1829472', isMandatory: true, type: 'text', description: 'Passport associated with visa' },
      { key: 'entryValidity', label: 'Number of Entries', placeholder: 'SINGLE / MULTIPLE / DOUBLE', isMandatory: true, type: 'select', options: ['SINGLE', 'DOUBLE', 'MULTIPLE'], description: 'Permitted entries' },
      { key: 'dateOfIssue', label: 'Issue Date', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Date granted' },
      { key: 'dateOfExpiry', label: 'Valid Until / Expiry', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Last allowed entry date' },
      { key: 'stayDuration', label: 'Max Duration of Stay (Days)', placeholder: 'e.g. 90', isMandatory: true, type: 'text', description: 'Permitted continuous residency' }
    ]
  },
  national_id: {
    type: 'national_id',
    title: 'National Identity Card (Aadhaar / Citizen Card)',
    category: 'Primary Domestic Identity',
    standard: 'ISO/IEC 7810 ID-1 / UIDAI Verifiable Identity',
    hasMRZ: false,
    fields: [
      { key: 'name', label: 'Full Legal Name', placeholder: 'SURNAME, FIRST NAME', isMandatory: true, type: 'text', description: 'Full citizen name' },
      { key: 'documentNumber', label: 'Citizen Identity Number', placeholder: 'XXXX-XXXX-XXXX (Aadhaar/National ID)', isMandatory: true, type: 'text', description: '12-digit or alphanumeric unique identifier' },
      { key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Citizen birthdate' },
      { key: 'gender', label: 'Gender', placeholder: 'MALE / FEMALE / TRANSGENDER', isMandatory: true, type: 'select', options: ['MALE', 'FEMALE', 'TRANSGENDER'], description: 'Legal gender' },
      { key: 'address', label: 'Registered Address', placeholder: 'Residential Street, District, PIN', isMandatory: false, type: 'text', description: 'Recorded residency address' }
    ]
  },
  driving_licence: {
    type: 'driving_licence',
    title: 'Motor Vehicle Driving Licence',
    category: 'Government Issued Identity & Privilege',
    standard: 'ISO/IEC 18013 / MoRTH Standard',
    hasMRZ: false,
    fields: [
      { key: 'name', label: 'Licence Holder Name', placeholder: 'SURNAME, GIVEN NAMES', isMandatory: true, type: 'text', description: 'Operator name' },
      { key: 'documentNumber', label: 'Licence Identification Number', placeholder: 'e.g. DL-0420110023412', isMandatory: true, type: 'text', description: 'State transport licence code' },
      { key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Operator birthdate' },
      { key: 'vehicleClass', label: 'Authorized Vehicle Class', placeholder: 'LMV / MCWG / TRANS', isMandatory: true, type: 'text', description: 'Light Motor Vehicle, Motorcycle with Gear, Transport' },
      { key: 'dateOfIssue', label: 'Date of Issue', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Initial or renewal issue date' },
      { key: 'dateOfExpiry', label: 'Date of Expiry (Transport/Non-Transport)', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Licence validity cut-off' }
    ]
  },
  residence_permit: {
    type: 'residence_permit',
    title: 'Alien Residence Permit / Green Card',
    category: 'Immigration & Lawful Residency',
    standard: 'EU Uniform Format / USCIS Standard',
    hasMRZ: true,
    fields: [
      { key: 'name', label: 'Resident Legal Name', placeholder: 'SURNAME, GIVEN NAMES', isMandatory: true, type: 'text', description: 'Authorized resident name' },
      { key: 'documentNumber', label: 'Permit Registration Number', placeholder: 'e.g. RP-908123', isMandatory: true, type: 'text', description: 'Resident registration code' },
      { key: 'nationality', label: 'Origin Country / State', placeholder: 'ISO Alpha-3', isMandatory: true, type: 'text', description: 'Citizenship of origin' },
      { key: 'dateOfExpiry', label: 'Permit Expiry Date', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Residency expiration threshold' }
    ]
  },
  travel_permit: {
    type: 'travel_permit',
    title: 'Cross-Border Travel Permit (SSB Border Protocol)',
    category: 'Frontier Verification Pass',
    standard: 'Indo-Nepal / Indo-Bhutan Frontier Protocol 2024',
    hasMRZ: false,
    fields: [
      { key: 'name', label: 'Traveler Name', placeholder: 'Full Name', isMandatory: true, type: 'text', description: 'Border crosser identifier' },
      { key: 'documentNumber', label: 'Border Pass Token', placeholder: 'BP-2026-XXXX', isMandatory: true, type: 'text', description: 'Designated checkpost pass code' },
      { key: 'checkpoint', label: 'Authorized Checkpost', placeholder: 'Raxaul / Panitanki / Jogbani', isMandatory: true, type: 'text', description: 'SSB border entry point' },
      { key: 'dateOfExpiry', label: 'Transit Window Valid Until', placeholder: 'DD/MM/YYYY', isMandatory: true, type: 'date', description: 'Time-bounded frontier pass' }
    ]
  },
  other: {
    type: 'other',
    title: 'General Identity Document',
    category: 'Auxiliary Identification',
    standard: 'Generic Identity Baseline',
    hasMRZ: false,
    fields: [
      { key: 'name', label: 'Bearer Name', placeholder: 'Full Name', isMandatory: true, type: 'text', description: 'Name of document bearer' },
      { key: 'documentNumber', label: 'Document Number', placeholder: 'Unique Number', isMandatory: true, type: 'text', description: 'Serial or registration number' },
      { key: 'issuingAuthority', label: 'Issuing Authority / Agency', placeholder: 'Government Department', isMandatory: false, type: 'text', description: 'Agency of provenance' }
    ]
  }
};
