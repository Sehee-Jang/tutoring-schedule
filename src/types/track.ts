import { Batch } from "./batch";

// Track 타입 - 트랙 정보
export interface Track {
  id: string;
  name: string;
  batches: Batch[]; // 여러 기수
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackWithBatches extends Track {
  batches: Batch[]; // 여러 기수
  createdAt: Date;
  updatedAt: Date;
}

// Track 타입 - 트랙 정보
export interface TrackSummary {
  id: string;
  name: string;
}