import type { ProposalFormData } from './types'

export const technicalRequirements = [
  'User Authentication',
  'Payment Integration',
  'Admin Dashboard',
  'API Integration',
  'AI/ML Features',
  'Real-time Features',
  'Mobile Responsive',
  'SEO Optimization',
  'Analytics & Reporting',
  'Email Notifications',
  'Multi-language',
  'Cloud Storage'
]

export const additionalServices = [
  'Domain & Hosting Setup',
  'Logo Design',
  'Content Writing',
  'SEO Setup',
  'Training Session',
  'Technical Documentation'
]

export const includedSections = [
  'Executive Summary',
  'Understanding of Requirements',
  'Scope of Work',
  'Technical Approach',
  'Timeline & Milestones',
  'Investment & Pricing',
  'Terms & Conditions',
  'Next Steps'
]

export const emptyFormData: ProposalFormData = {
  step1: {
    agencyName: '',
    agencyTagline: 'AI & Web Development Agency',
    agencyEmail: '',
    agencyWebsite: '',
    clientName: '',
    clientCompany: '',
    projectName: '',
    projectType: 'Web Development',
    industry: 'E-commerce',
    problemStatement: ''
  },
  step2: {
    keyFeatures: '',
    technicalRequirements: [],
    preferredTechStack: '',
    constraints: '',
    targetUsers: ''
  },
  step3: {
    complexity: 'standard',
    budgetRange: '₹75,000 – ₹2,00,000',
    advancePercent: 40,
    revisions: 3,
    warrantyPeriod: '3 Months',
    additionalServices: [],
    paymentMilestone: '40-30-30'
  },
  step4: {
    tone: 'professional',
    language: 'English',
    includedSections,
    specialEmphasis: ''
  }
}
