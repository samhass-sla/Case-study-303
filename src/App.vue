<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { createEmptyReport, type ReportDraft } from './types/report'

const step = ref(0)
const report = reactive<ReportDraft>(createEmptyReport())
const errors = ref<Record<string, string>>({})
const stepTitles = [
  'Who is reporting?',
  'What happened?',
  'When and what happened next?',
  'About Castelzor',
  'Other relevant context',
  'Contact and review',
]
const currentTitle = computed(() => stepTitles[step.value - 1] ?? '')
const subjectCopy = computed(() => {
  const self = report.reporterType === 'self'
  return {
    step2Intro: self
      ? 'Describe what you experienced. These examples are not confirmed Castelzor side effects.'
      : 'Describe what the person experienced. These examples are not confirmed Castelzor side effects.',
    experienceQuestion: self ? 'What did you experience?' : 'What did the person experience?',
    otherSymptomQuestion: self
      ? 'What other symptom or problem did you experience?'
      : 'What other symptom or problem did the person experience?',
    medicationProblemQuestion: self
      ? 'Did you also have a medication or product problem?'
      : 'Did the person also have a medication or product problem?',
    eventDescriptionQuestion: self ? 'Tell us what happened to you' : 'Tell us what happened to the person',
    onsetQuestion: self ? 'About when did it start for you?' : 'About when did it start for the person?',
    ongoingQuestion: self ? 'Is it still happening to you?' : 'Is the person still experiencing it?',
    endQuestion: self ? 'About when did it end for you?' : 'About when did it end for the person?',
    soughtCareQuestion: self ? 'Did you seek medical care?' : 'Did the person seek medical care?',
    seriousOutcomeQuestion: self
      ? 'Did you experience a serious medical outcome, such as hospitalization or a life-threatening event?'
      : 'Did the person experience a serious medical outcome, such as hospitalization or a life-threatening event?',
    seriousDetailsQuestion: self
      ? 'Tell us more about the serious medical event you experienced'
      : 'Tell us more about the serious medical event the person experienced',
    productStartQuestion: self ? 'When did you start taking Castelzor?' : 'When did the person start taking Castelzor?',
    productStopQuestion: self ? 'When did you stop taking Castelzor?' : 'When did the person stop taking Castelzor?',
    stillTakingLabel: self ? 'I am still taking Castelzor' : 'The person is still taking Castelzor',
    emergencyPrompt: self
      ? 'If you are having a medical emergency, call 911 now.'
      : 'If you or the person you’re reporting for is having a medical emergency, call 911 now.',
    contextIntro: self
      ? 'These details may help a safety team understand your report; they do not show what caused your experience.'
      : 'These details may help a safety team understand the person’s report; they do not show what caused the experience.',
    aboutSubjectHeading: self ? 'About you' : 'About the person',
    identifierLabel: self ? 'Your initials or demo identifier' : 'Patient initials or demo identifier',
    ageLabel: self ? 'Your age or age range' : 'The person’s age or age range',
    otherMedicinesQuestion: self
      ? 'What other medicines or supplements do you take?'
      : 'What other medicines or supplements does the person take?',
    healthConditionsQuestion: self ? 'Do you have relevant health conditions?' : 'Does the person have relevant health conditions?',
    otherContextQuestion: self
      ? 'Anything else you think is relevant?'
      : 'Anything else about the person that you think is relevant?',
    reviewSubjectHeading: self ? 'About you' : 'About the person',
    reviewIdentifierLabel: self ? 'Identifier' : 'Patient identifier',
    reviewAgeLabel: self ? 'Age range' : 'Person’s age range',
    reviewExperienceHeading: self ? 'Your experience' : 'The person’s experience',
    stillTakingReview: self ? 'Still taking Castelzor' : 'The person is still taking Castelzor',
  }
})
const symptomOptions = [
  { value: 'nausea', label: 'Nausea' },
  { value: 'headache', label: 'Headache' },
  { value: 'dizziness', label: 'Dizziness' },
  { value: 'rash', label: 'Rash' },
  { value: 'pain', label: 'Pain' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'other', label: 'Other symptom or problem' },
  { value: 'none', label: 'No symptoms to report' },
]
const seriousOutcomeOptions = [
  { value: 'hospitalization', label: 'Hospitalization' },
  { value: 'life-threatening', label: 'A life-threatening event' },
  { value: 'other-serious', label: 'Another serious medical event' },
]

watch(
  () => report.symptoms.includes('other'),
  (selected) => {
    if (!selected) report.otherSymptom = ''
  },
)

watch(
  () => report.seriousEvent,
  (answer) => {
    if (answer !== 'yes') {
      report.seriousOutcomes = []
      report.seriousOutcomeDetails = ''
    }
  },
)

watch(
  () => report.seriousOutcomes.includes('other-serious'),
  (selected) => {
    if (!selected) report.seriousOutcomeDetails = ''
  },
)

watch(
  () => report.medicationProblem === 'yes',
  (selected) => {
    if (!selected) report.eventDescription = ''
  },
)

watch(
  () => report.reporterType,
  (reporterType) => {
    if (reporterType !== 'caregiver') report.relationship = ''
  },
)

async function focusHeading() {
  await nextTick()
  document.querySelector<HTMLElement>('[data-step-heading]')?.focus()
}

async function startReport() {
  step.value = 1
  await focusHeading()
}

async function goBack() {
  errors.value = {}
  step.value = step.value <= 1 ? 0 : step.value - 1
  await focusHeading()
}

async function editStep(target: number) {
  errors.value = {}
  step.value = target
  await focusHeading()
}

function validateCurrentStep() {
  const nextErrors: Record<string, string> = {}

  if (step.value === 1) {
    if (!report.reporterType) nextErrors.reporterType = 'Choose who is reporting.'
    if (report.reporterType === 'caregiver' && !report.relationship.trim()) {
      nextErrors.relationship = 'Tell us how you are related to the person.'
    }
  }

  if (step.value === 5) {
    if (!report.patientIdentifier.trim()) nextErrors.patientIdentifier = 'Enter fictional initials or a demo identifier.'
    if (!report.ageRange) nextErrors.ageRange = 'Choose an age range, or select “I’m not sure.”'
  }

  if (step.value === 2) {
    if (!report.medicationProblem) nextErrors.medicationProblem = 'Choose yes or no.'
    if (report.symptoms.length === 0) {
      nextErrors.symptoms = 'Choose one or more symptoms, or select “No symptoms to report.”'
    }
    if (report.symptoms.includes('none') && report.medicationProblem !== 'yes') {
      nextErrors.symptoms = 'Select a symptom, or answer yes to a medication or product problem.'
    }
    if (report.symptoms.includes('other') && !report.otherSymptom.trim()) {
      nextErrors.otherSymptom = 'Describe the other symptom or problem.'
    }
    if (report.medicationProblem === 'yes' && !report.eventDescription.trim()) {
      nextErrors.eventDescription = 'Describe what happened with the medication or product problem.'
    }
  }

  if (step.value === 3) {
    if (!report.onsetUnknown && !report.onsetDate) nextErrors.onsetDate = 'Enter an approximate date, or choose “I’m not sure.”'
    if (!report.patientStatus) nextErrors.patientStatus = 'Choose whether the experience is ongoing or has ended.'
    if (!report.soughtCare) nextErrors.soughtCare = 'Choose an answer, including “I’m not sure.”'
    if (!report.seriousEvent) nextErrors.seriousEvent = 'Choose an answer, including “I’m not sure.”'
    if (report.seriousEvent === 'yes' && report.seriousOutcomes.length === 0) {
      nextErrors.seriousOutcomes = 'Choose any serious outcomes that occurred.'
    }
    if (report.seriousOutcomes.includes('other-serious') && !report.seriousOutcomeDetails.trim()) {
      nextErrors.seriousOutcomeDetails = 'Add details about the other serious medical event.'
    }
  }

  if (step.value === 6) {
    if (!report.reporterName.trim()) nextErrors.reporterName = 'Enter a fictional name for the demo.'
    if (!report.contactMethod) nextErrors.contactMethod = 'Choose how a real service might contact you.'
    if (report.contactMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.email.trim())) {
      nextErrors.email = 'Enter a valid fictional email address.'
    }
    if (report.contactMethod === 'phone' && report.phone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Enter a valid fictional phone number.'
    }
    if (!report.demoAcknowledged) nextErrors.demoAcknowledged = 'Acknowledge that this is a demonstration to finish.'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

async function continueFlow() {
  if (!validateCurrentStep()) {
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  step.value += 1
  errors.value = {}
  await focusHeading()
}

function finishDemo() {
  if (!validateCurrentStep()) {
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  step.value = 7
  errors.value = {}
  focusHeading()
}

async function startOver() {
  Object.assign(report, createEmptyReport())
  errors.value = {}
  step.value = 0
  await focusHeading()
}

function answerLabel(answer: string) {
  return answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : answer === 'unsure' ? 'I’m not sure' : 'Not provided'
}

function selectedSymptoms() {
  return symptomOptions
    .filter((option) => report.symptoms.includes(option.value))
    .map((option) => option.value === 'other' ? `Other: ${report.otherSymptom}` : option.label)
}

function toggleSymptom(value: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (value === 'none') {
    report.symptoms = checked ? ['none'] : []
    return
  }
  if (checked) {
    report.symptoms = [...report.symptoms.filter((symptom) => symptom !== 'none'), value]
  } else {
    report.symptoms = report.symptoms.filter((symptom) => symptom !== value)
  }
}

function setProductStopUnknown(event: Event) {
  report.productStopUnknown = (event.target as HTMLInputElement).checked
  if (report.productStopUnknown) {
    report.productStillTaking = false
    report.productStopDate = ''
  }
}

function setProductStillTaking(event: Event) {
  report.productStillTaking = (event.target as HTMLInputElement).checked
  if (report.productStillTaking) {
    report.productStopUnknown = false
    report.productStopDate = ''
  }
}

function displayDate(date: string, unknown: boolean) {
  if (unknown) return 'I’m not sure'
  return date || 'Not provided'
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Castelzor patient safety demo home" @click.prevent="startOver">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <span class="brand-name">castelzor<span> / safety</span></span>
      </a>
      <div class="header-status"><span class="status-dot"></span> Demonstration environment</div>
    </header>

    <main id="top" class="main-content">
      <section v-if="step === 0" class="welcome-layout" aria-labelledby="welcome-heading">
        <div class="welcome-copy">
          <p class="eyebrow"><span class="eyebrow-line"></span> Patient safety reporting</p>
          <h1 id="welcome-heading" data-step-heading tabindex="-1">Tell us what<br class="desktop-break"> happened.</h1>
          <p class="welcome-lede">Share what you noticed while taking Castelzor. You don’t need to know what caused it to tell us what happened.</p>

          <div class="notice notice-emergency">
            <span class="notice-symbol" aria-hidden="true">!</span>
            <p><strong>If you are having a medical emergency, call 911 now.</strong> This form does not provide medical advice or urgent care. If you have concerns about your symptoms or your medicine, contact a healthcare professional.</p>
          </div>
          <div class="notice notice-demo">
            <span class="demo-label">Demonstration only</span>
            <p>Castelzor is fictional. This prototype does not send a report to a safety team or the FDA. Please use made-up information, not real personal or medical details.</p>
          </div>
          <button class="button button-primary button-start" type="button" @click="startReport">
            Begin report <span aria-hidden="true">→</span>
          </button>
          <p class="welcome-footnote"><span aria-hidden="true">↳</span> Your answers stay in this page and clear when you leave or reload.</p>
        </div>

        <aside class="welcome-aside" aria-label="Castelzor patient safety">
          <div class="aside-topline"><span>CS / 303</span><span>DEMO EDITION</span></div>
          <div class="aside-art" aria-hidden="true">
            <div class="art-grid"></div>
            <div class="art-ring art-ring-one"></div>
            <div class="art-ring art-ring-two"></div>
            <div class="art-cross"><i></i><i></i></div>
            <div class="art-number">01</div>
          </div>
          <div class="aside-caption">
            <p class="aside-kicker">A place for your observation</p>
            <p>Patient and caregiver reports help describe an experience in the reporter’s own words.</p>
          </div>
          <div class="aside-bottom"><span>CASTELZOR</span><span>FICTIONAL MEDICINE</span></div>
        </aside>
      </section>

      <section v-else-if="step >= 1 && step <= 6" class="flow-layout" aria-label="Patient safety report">
        <div class="flow-topline">
          <button class="text-button back-button" type="button" @click="goBack"><span aria-hidden="true">←</span> Back</button>
          <span class="demo-inline"><span class="status-dot"></span> Demo data only</span>
        </div>

        <div class="progress-block" role="progressbar" :aria-valuenow="step" aria-valuemin="1" aria-valuemax="6" :aria-valuetext="`Step ${step} of 6: ${currentTitle}`">
          <div class="progress-label"><span>Step {{ step }} of 6</span><span>{{ currentTitle }}</span></div>
          <div class="progress-segments" aria-hidden="true">
            <span v-for="index in 6" :key="index" :class="{ active: index <= step }"></span>
          </div>
        </div>

        <div v-if="step === 2 || step === 3" class="notice notice-emergency notice-compact">
          <span class="notice-symbol" aria-hidden="true">!</span>
          <p><strong>{{ subjectCopy.emergencyPrompt }}</strong> This form is not urgent care.</p>
        </div>

        <section class="question-panel" :aria-labelledby="`step-heading-${step}`">
          <div class="question-heading">
            <p class="step-index">0{{ step }} <span>/</span> 06</p>
            <h1 :id="`step-heading-${step}`" data-step-heading tabindex="-1">{{ currentTitle }}</h1>
            <p v-if="step === 1" class="question-intro">First, tell us who is completing the report.</p>
            <p v-else-if="step === 2" class="question-intro">{{ subjectCopy.step2Intro }}</p>
            <p v-else-if="step === 3" class="question-intro">Approximate answers are okay. It’s fine to say you’re not sure.</p>
            <p v-else-if="step === 4" class="question-intro">Share only the product details you know about {{ report.reporterType === 'self' ? 'yourself' : 'the person' }}. Unknown details are okay.</p>
            <p v-else-if="step === 5" class="question-intro">{{ subjectCopy.contextIntro }}</p>
            <p v-else class="question-intro">Use fictional details only. Review what you entered before finishing the demo.</p>
          </div>

          <div v-if="step === 1" class="form-content">
            <fieldset class="form-group" :aria-describedby="errors.reporterType ? 'reporter-type-error' : undefined">
              <legend class="field-label">Are you reporting for yourself or someone else? <span class="required-mark">Required</span></legend>
              <div class="choice-row">
                <label class="choice-card" :class="{ selected: report.reporterType === 'self' }">
                  <input v-model="report.reporterType" type="radio" name="reporter-type" value="self" :aria-invalid="Boolean(errors.reporterType)">
                  <span class="choice-check" aria-hidden="true"></span><span><strong>For myself</strong><small>I’m the person who had the experience</small></span>
                </label>
                <label class="choice-card" :class="{ selected: report.reporterType === 'caregiver' }">
                  <input v-model="report.reporterType" type="radio" name="reporter-type" value="caregiver" :aria-invalid="Boolean(errors.reporterType)">
                  <span class="choice-check" aria-hidden="true"></span><span><strong>For someone else</strong><small>I’m a caregiver or support person</small></span>
                </label>
              </div>
              <p v-if="errors.reporterType" id="reporter-type-error" class="field-error" role="alert">{{ errors.reporterType }}</p>
            </fieldset>
            <div v-if="report.reporterType === 'caregiver'" class="form-group conditional-field">
              <label class="field-label" for="relationship">How are you related to the person? <span class="required-mark">Required</span></label>
              <input id="relationship" v-model="report.relationship" type="text" autocomplete="off" placeholder="For example, family member or friend" :aria-invalid="Boolean(errors.relationship)" :aria-describedby="errors.relationship ? 'relationship-error' : undefined">
              <p v-if="errors.relationship" id="relationship-error" class="field-error" role="alert">{{ errors.relationship }}</p>
            </div>
          </div>

          <div v-else-if="step === 2" class="form-content">
            <fieldset class="form-group" :aria-describedby="errors.symptoms ? 'symptoms-error' : 'symptoms-help'">
              <legend class="field-label">{{ subjectCopy.experienceQuestion }} <span class="required-mark">Required · choose all that apply</span></legend>
              <p id="symptoms-help" class="field-help field-help-spaced">Examples only. Select all that apply, or choose “No symptoms to report.”</p>
              <div class="symptom-grid">
                <label v-for="option in symptomOptions" :key="option.value" class="check-card" :class="{ selected: report.symptoms.includes(option.value), 'check-card-other': option.value === 'other', 'check-card-none': option.value === 'none' }">
                  <input type="checkbox" :checked="report.symptoms.includes(option.value)" :value="option.value" :aria-invalid="Boolean(errors.symptoms)" @change="toggleSymptom(option.value, $event)">
                  <span class="check-box" aria-hidden="true"></span><span>{{ option.label }}</span>
                </label>
              </div>
              <p v-if="errors.symptoms" id="symptoms-error" class="field-error" role="alert">{{ errors.symptoms }}</p>
            </fieldset>

            <div v-if="report.symptoms.includes('other')" class="form-group conditional-field">
              <label class="field-label" for="other-symptom">{{ subjectCopy.otherSymptomQuestion }} <span class="required-mark">Required</span></label>
              <input id="other-symptom" v-model="report.otherSymptom" type="text" autocomplete="off" placeholder="Describe it in your own words" :aria-invalid="Boolean(errors.otherSymptom)" :aria-describedby="errors.otherSymptom ? 'other-symptom-error' : undefined">
              <p v-if="errors.otherSymptom" id="other-symptom-error" class="field-error" role="alert">{{ errors.otherSymptom }}</p>
            </div>

            <fieldset class="form-group product-problem-group" :aria-describedby="errors.medicationProblem ? 'medication-problem-error' : 'medication-problem-help'">
              <legend class="field-label">{{ subjectCopy.medicationProblemQuestion }} <span class="required-mark">Required</span></legend>
              <p id="medication-problem-help" class="field-help field-help-spaced"><em>For example, a mix-up, packaging issue, inappropriate dose, or difficulty using the product.</em></p>
              <div class="choice-row">
                <label class="choice-card choice-card-small" :class="{ selected: report.medicationProblem === 'yes' }">
                  <input v-model="report.medicationProblem" type="radio" name="medication-problem" value="yes" :aria-invalid="Boolean(errors.medicationProblem)">
                  <span class="choice-check" aria-hidden="true"></span><strong>Yes, there was a medication or product problem</strong>
                </label>
                <label class="choice-card choice-card-small" :class="{ selected: report.medicationProblem === 'no' }">
                  <input v-model="report.medicationProblem" type="radio" name="medication-problem" value="no" :aria-invalid="Boolean(errors.medicationProblem)">
                  <span class="choice-check" aria-hidden="true"></span><strong>No</strong>
                </label>
              </div>
              <p v-if="errors.medicationProblem" id="medication-problem-error" class="field-error" role="alert">{{ errors.medicationProblem }}</p>
            </fieldset>

            <div v-if="report.medicationProblem === 'yes'" class="form-group conditional-field">
              <label class="field-label" for="event-description">{{ subjectCopy.eventDescriptionQuestion }} <span class="required-mark">Required</span></label>
              <textarea id="event-description" v-model="report.eventDescription" rows="4" placeholder="Describe what happened in your own words. Please don’t include real names or contact details." :aria-invalid="Boolean(errors.eventDescription)" :aria-describedby="errors.eventDescription ? 'event-description-error' : undefined"></textarea>
              <p v-if="errors.eventDescription" id="event-description-error" class="field-error" role="alert">{{ errors.eventDescription }}</p>
            </div>
          </div>

          <div v-else-if="step === 3" class="form-content">
            <div class="form-group">
              <label class="field-label" for="onset-date">{{ subjectCopy.onsetQuestion }} <span class="required-mark">Required, or choose not sure</span></label>
              <input id="onset-date" v-model="report.onsetDate" type="date" :disabled="report.onsetUnknown" :aria-invalid="Boolean(errors.onsetDate)" :aria-describedby="errors.onsetDate ? 'onset-date-error' : undefined">
              <p v-if="errors.onsetDate" id="onset-date-error" class="field-error" role="alert">{{ errors.onsetDate }}</p>
              <label class="inline-check"><input v-model="report.onsetUnknown" type="checkbox" @change="report.onsetUnknown && (report.onsetDate = '')"><span>I’m not sure</span></label>
            </div>

            <fieldset class="form-group" :aria-describedby="errors.patientStatus ? 'patient-status-error' : undefined">
              <legend class="field-label">{{ subjectCopy.ongoingQuestion }} <span class="required-mark">Required</span></legend>
              <div class="choice-row choice-row-compact">
                <label class="choice-card choice-card-small" :class="{ selected: report.patientStatus === 'ongoing' }"><input v-model="report.patientStatus" type="radio" name="patient-status" value="ongoing" :aria-invalid="Boolean(errors.patientStatus)"><span class="choice-check" aria-hidden="true"></span><strong>Yes, ongoing</strong></label>
                <label class="choice-card choice-card-small" :class="{ selected: report.patientStatus === 'ended' }"><input v-model="report.patientStatus" type="radio" name="patient-status" value="ended" :aria-invalid="Boolean(errors.patientStatus)"><span class="choice-check" aria-hidden="true"></span><strong>No, it ended</strong></label>
              </div>
              <p v-if="errors.patientStatus" id="patient-status-error" class="field-error" role="alert">{{ errors.patientStatus }}</p>
            </fieldset>
            <div v-if="report.patientStatus === 'ended'" class="form-group conditional-field">
              <label class="field-label" for="end-date">{{ subjectCopy.endQuestion }} <span class="optional-mark">Optional</span></label>
              <input id="end-date" v-model="report.endDate" type="date">
            </div>

            <fieldset class="form-group" :aria-describedby="errors.soughtCare ? 'sought-care-error' : undefined">
              <legend class="field-label">{{ subjectCopy.soughtCareQuestion }} <span class="required-mark">Required</span></legend>
              <div class="choice-row choice-row-compact">
                <label v-for="answer in ['yes', 'no', 'unsure']" :key="answer" class="choice-card choice-card-small" :class="{ selected: report.soughtCare === answer }"><input v-model="report.soughtCare" type="radio" name="sought-care" :value="answer" :aria-invalid="Boolean(errors.soughtCare)"><span class="choice-check" aria-hidden="true"></span><strong>{{ answer === 'unsure' ? 'Not sure' : answer === 'yes' ? 'Yes' : 'No' }}</strong></label>
              </div>
              <p v-if="errors.soughtCare" id="sought-care-error" class="field-error" role="alert">{{ errors.soughtCare }}</p>
            </fieldset>

            <fieldset class="form-group" :aria-describedby="errors.seriousEvent ? 'serious-event-error' : undefined">
              <legend class="field-label">{{ subjectCopy.seriousOutcomeQuestion }} <span class="required-mark">Required</span></legend>
              <div class="choice-row choice-row-compact">
                <label v-for="answer in ['yes', 'no', 'unsure']" :key="answer" class="choice-card choice-card-small" :class="{ selected: report.seriousEvent === answer }"><input v-model="report.seriousEvent" type="radio" name="serious-event" :value="answer" :aria-invalid="Boolean(errors.seriousEvent)"><span class="choice-check" aria-hidden="true"></span><strong>{{ answer === 'unsure' ? 'Not sure' : answer === 'yes' ? 'Yes' : 'No' }}</strong></label>
              </div>
              <p v-if="errors.seriousEvent" id="serious-event-error" class="field-error" role="alert">{{ errors.seriousEvent }}</p>
              <div v-if="report.seriousEvent === 'yes'" class="outcome-list">
                <label v-for="outcome in seriousOutcomeOptions" :key="outcome.value" class="check-card check-card-wide" :class="{ selected: report.seriousOutcomes.includes(outcome.value) }"><input v-model="report.seriousOutcomes" type="checkbox" :value="outcome.value" :aria-invalid="Boolean(errors.seriousOutcomes)"><span class="check-box" aria-hidden="true"></span><span>{{ outcome.label }}</span></label>
                <p v-if="errors.seriousOutcomes" class="field-error" role="alert">{{ errors.seriousOutcomes }}</p>
                <div v-if="report.seriousOutcomes.includes('other-serious')" class="form-group conditional-field">
                  <label class="field-label" for="serious-outcome-details">{{ subjectCopy.seriousDetailsQuestion }} <span class="required-mark">Required</span></label>
                  <textarea id="serious-outcome-details" v-model="report.seriousOutcomeDetails" rows="3" placeholder="Add a few details in your own words." :aria-invalid="Boolean(errors.seriousOutcomeDetails)" :aria-describedby="errors.seriousOutcomeDetails ? 'serious-outcome-details-error' : undefined"></textarea>
                  <p v-if="errors.seriousOutcomeDetails" id="serious-outcome-details-error" class="field-error" role="alert">{{ errors.seriousOutcomeDetails }}</p>
                </div>
              </div>
            </fieldset>
          </div>

          <div v-else-if="step === 4" class="form-content">
            <div class="form-group">
              <label class="field-label" for="product-name">Product</label>
              <input id="product-name" type="text" value="Castelzor" readonly aria-readonly="true">
            </div>
            <div class="form-group"><label class="field-label" for="dose">Dose, if known <span class="optional-mark">Optional</span></label><input id="dose" v-model="report.dose" type="text" autocomplete="off" placeholder="For example, 10 mg"></div>
            <div class="field-grid">
              <div class="form-group">
                <label class="field-label" for="product-start-date">{{ subjectCopy.productStartQuestion }} <span class="optional-mark">Optional</span></label>
                <input id="product-start-date" v-model="report.productStartDate" type="date" :disabled="report.productStartUnknown" @change="report.productStartUnknown && (report.productStartDate = '')">
                <label class="inline-check"><input v-model="report.productStartUnknown" type="checkbox" @change="report.productStartUnknown && (report.productStartDate = '')"><span>I’m not sure</span></label>
              </div>
              <div class="form-group">
                <label class="field-label" for="product-stop-date">{{ subjectCopy.productStopQuestion }} <span class="optional-mark">Optional</span></label>
                <input id="product-stop-date" v-model="report.productStopDate" type="date" :disabled="report.productStopUnknown || report.productStillTaking" @change="report.productStopDate && (report.productStopUnknown = false, report.productStillTaking = false)">
                <label class="inline-check"><input type="checkbox" :checked="report.productStillTaking" @change="setProductStillTaking"><span>{{ subjectCopy.stillTakingLabel }}</span></label>
                <label class="inline-check"><input type="checkbox" :checked="report.productStopUnknown" @change="setProductStopUnknown"><span>I’m not sure</span></label>
              </div>
            </div>
            <div class="form-group">
              <label class="field-label" for="lot-number">Lot number <span class="optional-mark">Optional</span></label>
              <input id="lot-number" v-model="report.lotNumber" type="text" autocomplete="off" placeholder="Enter it if you have the package" :disabled="report.lotUnknown">
              <label class="inline-check"><input v-model="report.lotUnknown" type="checkbox" @change="report.lotUnknown && (report.lotNumber = '')"><span>I don’t know or don’t have the package</span></label>
            </div>
          </div>

          <div v-else-if="step === 5" class="form-content">
            <section class="context-subsection" aria-labelledby="subject-context-heading">
              <div class="review-section-heading"><h2 id="subject-context-heading">{{ subjectCopy.aboutSubjectHeading }}</h2></div>
              <div class="field-grid">
                <div class="form-group">
                  <label class="field-label" for="patient-identifier">{{ subjectCopy.identifierLabel }} <span class="required-mark">Required</span></label>
                  <input id="patient-identifier" v-model="report.patientIdentifier" type="text" autocomplete="off" placeholder="For example, AB-17" :aria-invalid="Boolean(errors.patientIdentifier)" :aria-describedby="errors.patientIdentifier ? 'patient-identifier-error' : 'patient-identifier-help'">
                  <p v-if="errors.patientIdentifier" id="patient-identifier-error" class="field-error" role="alert">{{ errors.patientIdentifier }}</p>
                  <p v-else id="patient-identifier-help" class="field-help">Please don’t enter a real person’s initials.</p>
                </div>
                <div class="form-group">
                  <label class="field-label" for="age-range">{{ subjectCopy.ageLabel }} <span class="required-mark">Required</span></label>
                  <select id="age-range" v-model="report.ageRange" :aria-invalid="Boolean(errors.ageRange)" :aria-describedby="errors.ageRange ? 'age-range-error' : undefined">
                    <option value="" disabled>Select an age range</option>
                    <option value="Under 18">Under 18</option><option value="18–29">18–29</option><option value="30–44">30–44</option><option value="45–59">45–59</option><option value="60–74">60–74</option><option value="75 or older">75 or older</option><option value="I’m not sure">I’m not sure</option>
                  </select>
                  <p v-if="errors.ageRange" id="age-range-error" class="field-error" role="alert">{{ errors.ageRange }}</p>
                </div>
              </div>
            </section>
            <div class="form-group">
              <label class="field-label" for="other-medicines">{{ subjectCopy.otherMedicinesQuestion }} <span class="optional-mark">Optional</span></label>
              <textarea id="other-medicines" v-model="report.otherMedicines" rows="3" placeholder="Include only details you’re comfortable sharing as fictional demo information."></textarea>
            </div>
            <div class="form-group">
              <label class="field-label" for="health-conditions">{{ subjectCopy.healthConditionsQuestion }} <span class="optional-mark">Optional</span></label>
              <textarea id="health-conditions" v-model="report.healthConditions" rows="3" placeholder="For example, a condition that may help explain the timing."></textarea>
            </div>
            <div class="form-group">
              <label class="field-label" for="other-context">{{ subjectCopy.otherContextQuestion }} <span class="optional-mark">Optional</span></label>
              <textarea id="other-context" v-model="report.otherContext" rows="4" placeholder="Add any other fictional details you’d like included."></textarea>
            </div>
          </div>

          <div v-else-if="step === 6" class="form-content review-content">
            <section class="review-section" aria-labelledby="review-patient-heading">
              <div class="review-section-heading"><h2 id="review-patient-heading">{{ subjectCopy.reviewSubjectHeading }}</h2><button class="text-button edit-button" type="button" @click="editStep(5)">Edit <span aria-hidden="true">↗</span></button></div>
              <dl class="review-list"><div><dt>Reporting</dt><dd class="review-reporting-value"><span>{{ report.reporterType === 'self' ? 'For myself' : 'For someone else' }}</span><button class="text-button edit-button" type="button" aria-label="Edit who is reporting" @click="editStep(1)">Edit</button></dd></div><div><dt>{{ subjectCopy.reviewIdentifierLabel }}</dt><dd>{{ report.patientIdentifier }}</dd></div><div><dt>{{ subjectCopy.reviewAgeLabel }}</dt><dd>{{ report.ageRange }}</dd></div><div v-if="report.relationship"><dt>Relationship</dt><dd>{{ report.relationship }}</dd></div></dl>
            </section>

            <section class="review-section" aria-labelledby="review-event-heading">
              <div class="review-section-heading"><h2 id="review-event-heading">{{ subjectCopy.reviewExperienceHeading }}</h2><button class="text-button edit-button" type="button" @click="editStep(2)">Edit <span aria-hidden="true">↗</span></button></div>
              <dl class="review-list"><div><dt>Experience</dt><dd>{{ selectedSymptoms().join(', ') || 'Not provided' }}</dd></div><div><dt>Medication or product problem</dt><dd>{{ report.medicationProblem === 'yes' ? 'Yes' : 'No' }}</dd></div><div v-if="report.medicationProblem === 'yes' && report.eventDescription"><dt>{{ report.reporterType === 'self' ? 'In your words' : 'In the person’s words' }}</dt><dd class="review-long-text">{{ report.eventDescription }}</dd></div></dl>
            </section>

            <section class="review-section" aria-labelledby="review-timing-heading">
              <div class="review-section-heading"><h2 id="review-timing-heading">Timing and outcomes</h2><button class="text-button edit-button" type="button" @click="editStep(3)">Edit <span aria-hidden="true">↗</span></button></div>
              <dl class="review-list"><div><dt>Started</dt><dd>{{ displayDate(report.onsetDate, report.onsetUnknown) }}</dd></div><div><dt>Status</dt><dd>{{ report.patientStatus === 'ongoing' ? 'Ongoing' : 'Ended' }}<span v-if="report.patientStatus === 'ended' && report.endDate">, {{ report.endDate }}</span></dd></div><div><dt>Sought medical care</dt><dd>{{ answerLabel(report.soughtCare) }}</dd></div><div><dt>Serious outcomes</dt><dd>{{ report.seriousEvent === 'yes' ? seriousOutcomeOptions.filter((item) => report.seriousOutcomes.includes(item.value)).map((item) => item.label).join(', ') : answerLabel(report.seriousEvent) }}</dd></div><div v-if="report.seriousOutcomes.includes('other-serious')"><dt>Serious event details</dt><dd class="review-long-text">{{ report.seriousOutcomeDetails }}</dd></div></dl>
            </section>

            <section class="review-section" aria-labelledby="review-product-heading">
              <div class="review-section-heading"><h2 id="review-product-heading">About Castelzor</h2><button class="text-button edit-button" type="button" @click="editStep(4)">Edit <span aria-hidden="true">↗</span></button></div>
              <dl class="review-list"><div><dt>Dose</dt><dd>{{ report.dose || 'Not provided' }}</dd></div><div><dt>Started</dt><dd>{{ displayDate(report.productStartDate, report.productStartUnknown) }}</dd></div><div><dt>Stopped</dt><dd>{{ report.productStillTaking ? subjectCopy.stillTakingReview : displayDate(report.productStopDate, report.productStopUnknown) }}</dd></div><div><dt>Lot number</dt><dd>{{ report.lotUnknown ? 'I don’t know or don’t have the package' : report.lotNumber || 'Not provided' }}</dd></div></dl>
            </section>

            <section class="review-section" aria-labelledby="review-context-heading">
              <div class="review-section-heading"><h2 id="review-context-heading">Other context</h2><button class="text-button edit-button" type="button" @click="editStep(5)">Edit <span aria-hidden="true">↗</span></button></div>
              <dl class="review-list"><div><dt>Other medicines</dt><dd class="review-long-text">{{ report.otherMedicines || 'Not provided' }}</dd></div><div><dt>Health conditions</dt><dd class="review-long-text">{{ report.healthConditions || 'Not provided' }}</dd></div><div><dt>Other details</dt><dd class="review-long-text">{{ report.otherContext || 'Not provided' }}</dd></div></dl>
            </section>

            <section class="review-section" aria-labelledby="review-contact-heading">
              <div class="review-section-heading"><h2 id="review-contact-heading">Contact details</h2></div>
              <dl class="review-list"><div><dt>Reporter name</dt><dd>{{ report.reporterName }}</dd></div><div><dt>Contact method</dt><dd>{{ report.contactMethod === 'email' ? report.email : report.phone }}</dd></div></dl>
            </section>

            <div class="contact-fields">
              <p class="demo-label">Demo data only</p>
              <div class="form-group">
                <label class="field-label" for="reporter-name">Your fictional name <span class="required-mark">Required</span></label>
                <input id="reporter-name" v-model="report.reporterName" type="text" autocomplete="off" placeholder="For example, Jordan Sample" :aria-invalid="Boolean(errors.reporterName)" :aria-describedby="errors.reporterName ? 'reporter-name-error' : undefined">
                <p v-if="errors.reporterName" id="reporter-name-error" class="field-error" role="alert">{{ errors.reporterName }}</p>
              </div>
              <fieldset class="form-group" :aria-describedby="errors.contactMethod ? 'contact-method-error' : undefined">
                <legend class="field-label">How might a real safety team contact you? <span class="required-mark">Required</span></legend>
                <div class="choice-row choice-row-compact">
                  <label class="choice-card choice-card-small" :class="{ selected: report.contactMethod === 'email' }"><input v-model="report.contactMethod" type="radio" name="contact-method" value="email" :aria-invalid="Boolean(errors.contactMethod)"><span class="choice-check" aria-hidden="true"></span><strong>Email</strong></label>
                  <label class="choice-card choice-card-small" :class="{ selected: report.contactMethod === 'phone' }"><input v-model="report.contactMethod" type="radio" name="contact-method" value="phone" :aria-invalid="Boolean(errors.contactMethod)"><span class="choice-check" aria-hidden="true"></span><strong>Phone</strong></label>
                </div>
                <p v-if="errors.contactMethod" id="contact-method-error" class="field-error" role="alert">{{ errors.contactMethod }}</p>
              </fieldset>
              <div v-if="report.contactMethod === 'email'" class="form-group">
                <label class="field-label" for="reporter-email">Fictional email address <span class="required-mark">Required</span></label>
                <input id="reporter-email" v-model="report.email" type="email" autocomplete="off" inputmode="email" placeholder="jordan@example.test" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'reporter-email-error' : undefined">
                <p v-if="errors.email" id="reporter-email-error" class="field-error" role="alert">{{ errors.email }}</p>
              </div>
              <div v-else-if="report.contactMethod === 'phone'" class="form-group">
                <label class="field-label" for="reporter-phone">Fictional phone number <span class="required-mark">Required</span></label>
                <input id="reporter-phone" v-model="report.phone" type="tel" autocomplete="off" inputmode="tel" placeholder="(555) 010-0123" :aria-invalid="Boolean(errors.phone)" :aria-describedby="errors.phone ? 'reporter-phone-error' : undefined">
                <p v-if="errors.phone" id="reporter-phone-error" class="field-error" role="alert">{{ errors.phone }}</p>
              </div>
            </div>

            <label class="acknowledgment" :class="{ 'acknowledgment-error': errors.demoAcknowledged }">
              <input v-model="report.demoAcknowledged" type="checkbox" :aria-invalid="Boolean(errors.demoAcknowledged)" :aria-describedby="errors.demoAcknowledged ? 'acknowledgment-error' : undefined">
              <span>I understand this is a demonstration. My fictional answers will not be sent to Castelzor’s safety team or the FDA.</span>
            </label>
            <p v-if="errors.demoAcknowledged" id="acknowledgment-error" class="field-error" role="alert">{{ errors.demoAcknowledged }}</p>
          </div>

          <div class="flow-actions">
            <button v-if="step < 6" class="button button-primary" type="button" @click="continueFlow">Continue <span aria-hidden="true">→</span></button>
            <button v-else class="button button-primary" type="button" @click="finishDemo">Finish demo <span aria-hidden="true">→</span></button>
            <p class="action-note"><span class="required-dot"></span> Required fields are marked</p>
          </div>
        </section>
      </section>

      <section v-else class="completion-layout" aria-labelledby="completion-heading">
        <div class="completion-mark" aria-hidden="true"><span></span><span></span></div>
        <p class="eyebrow"><span class="eyebrow-line"></span> Demo complete</p>
        <h1 id="completion-heading" data-step-heading tabindex="-1">No report was sent. But the demo was successfully completed.</h1>
        <p class="completion-lede">Thank you for walking through the Castelzor reporting experience. Your answers were used only in this on-screen demonstration and were not sent to Castelzor’s safety team or the FDA.</p>
        <div class="real-service-note">
          <p class="demo-label">In a real Castelzor service</p>
          <p>The safety team would review the report, might contact the reporter if it needed more information, and would submit information to the FDA when required. This reporting flow would not provide medical advice or emergency care.</p>
        </div>
        <div class="completion-actions">
          <button class="button button-primary" type="button" @click="startOver">Start over <span aria-hidden="true">↺</span></button>
          <span class="completion-clear-note">Starting over clears all demo answers.</span>
        </div>
      </section>
    </main>

    <footer class="site-footer"><span>CASTELZOR PATIENT SAFETY</span><span>Fictional product · Demonstration only</span></footer>
  </div>
</template>
