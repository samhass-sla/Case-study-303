export type ReporterType = 'self' | 'caregiver' | ''
export type PatientStatus = 'ongoing' | 'ended' | ''
export type YesNoUnsure = 'yes' | 'no' | 'unsure' | ''
export type YesNo = 'yes' | 'no' | ''
export type ContactMethod = 'email' | 'phone' | ''

export interface ReportDraft {
  reporterType: ReporterType
  patientIdentifier: string
  ageRange: string
  relationship: string
  symptoms: string[]
  otherSymptom: string
  medicationProblem: YesNo
  eventDescription: string
  onsetDate: string
  onsetUnknown: boolean
  patientStatus: PatientStatus
  endDate: string
  soughtCare: YesNoUnsure
  seriousEvent: YesNoUnsure
  seriousOutcomes: string[]
  seriousOutcomeDetails: string
  dose: string
  productStartDate: string
  productStartUnknown: boolean
  productStopDate: string
  productStopUnknown: boolean
  productStillTaking: boolean
  lotNumber: string
  lotUnknown: boolean
  otherMedicines: string
  healthConditions: string
  otherContext: string
  reporterName: string
  contactMethod: ContactMethod
  email: string
  phone: string
  demoAcknowledged: boolean
}

export function createEmptyReport(): ReportDraft {
  return {
    reporterType: '',
    patientIdentifier: '',
    ageRange: '',
    relationship: '',
    symptoms: [],
    otherSymptom: '',
    medicationProblem: '',
    eventDescription: '',
    onsetDate: '',
    onsetUnknown: false,
    patientStatus: '',
    endDate: '',
    soughtCare: '',
    seriousEvent: '',
    seriousOutcomes: [],
    seriousOutcomeDetails: '',
    dose: '',
    productStartDate: '',
    productStartUnknown: false,
    productStopDate: '',
    productStopUnknown: false,
    productStillTaking: false,
    lotNumber: '',
    lotUnknown: false,
    otherMedicines: '',
    healthConditions: '',
    otherContext: '',
    reporterName: '',
    contactMethod: '',
    email: '',
    phone: '',
    demoAcknowledged: false,
  }
}
