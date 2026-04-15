import type { Treatment } from '~~/types/store'

// ─── AI Feature Types ────────────────────────────────────────────────────────

export interface TreatmentRecommendation {
  treatment: Treatment
  rank: number
  rationale: string // max 20 words
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface BookingIntentParams {
  date: string
  time: string
  treatmentId: string
  branchId: string
}

export type ChatResponse =
  | { type: 'booking_intent'; params: BookingIntentParams }
  | { type: 'clarification'; missingField: string; message: string }
  | { type: 'data_response'; value: unknown; period: string; branch: string; formattedAnswer: string }
  | { type: 'error'; message: string }

export interface AlternativeSlot {
  date: string
  startTime: string
  endTime: string
  therapistId: number
  roomId: string
}

export interface ConflictRecord {
  id: number
  bookingId: number
  conflictingBookingId: number
  conflictType: 'therapist' | 'room'
  detectionTimestamp: string
  resolutionStatus: 'pending' | 'accepted' | 'dismissed' | 'expired'
  resolutionAction: 'accepted' | 'dismissed' | null
  resolutionTimestamp: string | null
  alternativeSlots: AlternativeSlot[]
  branchId: string
}

export interface Feedback {
  id: number
  sessionId: number
  customerId: number
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  sentimentScore: number | null
  sentimentLabel: 'positive' | 'neutral' | 'negative' | null
  analysisStatus: 'pending' | 'completed' | 'analysis_failed'
  submittedAt: string
  analyzedAt: string | null
}

export interface FeedbackSummary {
  customerFirstName: string
  treatmentName: string
  sentimentScore: number
  comment: string
}

export interface SentimentDashboardData {
  averageScore: number
  labelDistribution: { positive: number; neutral: number; negative: number }
  timeSeries: { date: string; averageScore: number }[]
  aiSummary: string // max 150 words
  recentNegative: FeedbackSummary[] // max 5
}
