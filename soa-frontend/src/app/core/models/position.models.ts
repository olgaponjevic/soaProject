export interface TouristPosition {
  id?: string;
  touristId: number;
  lat: number;
  lon: number;
  updatedAt?: string;
}

export interface UpsertPositionRequest {
  touristId: number;
  lat: number;
  lon: number;
}
