export interface CompletedKeyPoint {
  name: string;
  reachedAt: string;
}

export type ExecutionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface TourExecution {
  id: string;
  touristId: number;
  tourId: string;
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string | null;
  abandonedAt?: string | null;
  lastActivityAt?: string | null;
  startLat?: number | null;
  startLon?: number | null;
  completedKeyPoints?: CompletedKeyPoint[];
}
