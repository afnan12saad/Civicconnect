/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Urgency {
  LOW = 'Low',
  MEDIUM = 'Medium',
  MEDIUM_HIGH = 'Medium-High',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum ReportStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  STABLE = 'Stable'
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: Urgency;
  status: ReportStatus;
  location: string;
  timestamp: string;
  image?: string;
  adminId?: string;
}

export interface CityMetrics {
  totalActive: number;
  avgResolutionDays: number;
  citizenRating: number;
  weeklyTrend: number;
}
