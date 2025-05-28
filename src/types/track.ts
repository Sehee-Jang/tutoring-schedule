import { Batch } from "./batch";

// Track 타입 - 트랙 정보
export interface Track {
  id: string;
  name: string;
  batches: Batch[]; // 여러 기수
  created_at: Date;
  updated_at: Date;
}

export interface TrackWithBatches extends Track {
  batches: Batch[]; // 여러 기수
  created_at: Date;
  updated_at: Date;
}

// Track 타입 - 트랙 정보
export interface TrackSummary {
  id: string;
  name: string;
}