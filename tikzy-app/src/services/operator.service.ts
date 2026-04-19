import { apiFetch } from "@/src/services/api";

export type OperatorAssignedTripItem = {
  scheduled_trip_id: number;
  vehicle_id: number;
  vehicle_internal_code: string;
  vehicle_plate_number: string;
  route_id: number;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  trip_status: string;
};

export type OperatorPanelResponse = {
  operator_id: number;
  operator_name: string;
  assigned_trips: OperatorAssignedTripItem[];
};

export type StartTripSessionPayload = {
  scheduled_trip_id: number;
  vehicle_id: number;
};

export type TripSessionResponse = {
  id: number;
  scheduled_trip_id: number;
  operator_id: number;
  vehicle_id: number;
  status: string;
  current_latitude?: number | null;
  current_longitude?: number | null;
  started_at: string;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type CurrentTripSessionResponse = {
  trip_session_id: number;
  scheduled_trip_id: number;
  operator_id: number;
  operator_name: string;
  vehicle_id: number;
  vehicle_internal_code: string;
  vehicle_plate_number: string;
  total_capacity: number;
  route_id: number;
  origin_city: string;
  destination_city: string;
  next_stop: string;
  next_stop_minutes: number;
  distance_km: number;
  current_occupancy: number;
  occupancy_percent: number;
  departure_time: string;
  arrival_time: string;
  price: string;
  currency: string;
  status: string;
  started_at: string;
};

export type TicketSeatItem = {
  seat_number: string;
};

export type TicketValidationResponse = {
  booking_id: number;
  ticket_code: string;
  status: string;
  is_boarded: boolean;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  passenger_count: number;
  seats: TicketSeatItem[];
  total_amount: number;
  scheduled_trip_id: number;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  route_label: string;
  validated_at?: string | null;
};

export type PassengerManifestItem = {
  booking_id: number;
  ticket_code: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  passenger_count: number;
  seat_numbers: string[];
  primary_seat?: string | null;
  status: string;
  is_boarded: boolean;
  total_amount: number;
  booked_at: string;
  boarded_at?: string | null;
};

export type PassengerManifestResponse = {
  trip_session_id: number;
  scheduled_trip_id: number;
  route_origin: string;
  route_destination: string;
  departure_time: string;
  vehicle_label: string;
  total_passengers: number;
  boarded_count: number;
  boarding_percent: number;
  passengers: PassengerManifestItem[];
};

export type SeatMapSeatItem = {
  seat_id: number;
  seat_number: string;
  row_number: number;
  column_number?: number | null;
  position_type?: string | null;
  is_occupied: boolean;
  is_boarded: boolean;
  booking_id?: number | null;
  passenger_name?: string | null;
  booking_status?: string | null;
};

export type SeatMapResponse = {
  trip_session_id: number;
  scheduled_trip_id: number;
  vehicle_id: number;
  vehicle_label: string;
  total_seats: number;
  occupied_seats: number;
  boarded_seats: number;
  available_seats: number;
  seats: SeatMapSeatItem[];
};

export type ManualSalePayload = {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  passenger_count: number;
  seat_numbers: string[];
  payment_method?: string;
  notes?: string;
};

export type ManualSaleResponse = {
  booking_id: number;
  ticket_code: string;
  scheduled_trip_id: number;
  customer_name: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  passenger_count: number;
  seat_numbers: string[];
  unit_price: string;
  subtotal_amount: string;
  service_fee: string;
  total_amount: string;
  status: string;
  payment_method: string;
  created_at: string;
};

export async function getCurrentSeatMap(token: string) {
  return apiFetch<SeatMapResponse>(
    "/trip-sessions/current/seats",
    { method: "GET" },
    token
  );
}

export async function getCurrentPassengerManifest(token: string) {
  return apiFetch<PassengerManifestResponse>(
    "/trip-sessions/current/passengers",
    { method: "GET" },
    token
  );
}

export async function validateTicket(qr_code: string, token: string) {
  return apiFetch<TicketValidationResponse>(
    "/tickets/validate",
    {
      method: "POST",
      body: JSON.stringify({ qr_code }),
    },
    token
  );
}

export async function confirmTicketBoarding(booking_id: number, token: string) {
  return apiFetch<TicketValidationResponse>(
    "/tickets/confirm",
    {
      method: "POST",
      body: JSON.stringify({ booking_id }),
    },
    token
  );
}

export async function getOperatorPanel(token: string) {
  return apiFetch<OperatorPanelResponse>(
    "/operators/me/panel",
    { method: "GET" },
    token
  );
}

export async function startTripSession(
  payload: StartTripSessionPayload,
  token: string
) {
  return apiFetch<TripSessionResponse>(
    "/trip-sessions/start",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function getCurrentTripSession(token: string) {
  return apiFetch<CurrentTripSessionResponse>(
    "/trip-sessions/current",
    { method: "GET" },
    token
  );
}

export async function endCurrentTripSession(token: string) {
  return apiFetch<{ message: string; trip_session: TripSessionResponse }>(
    "/trip-sessions/end",
    { method: "POST" },
    token
  );
}

export async function createManualSale(
  payload: ManualSalePayload,
  token: string
) {
  return apiFetch<ManualSaleResponse>(
    "/manual-sales/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function getCurrentManualSales(token: string) {
  return apiFetch<ManualSaleResponse[]>(
    "/manual-sales/current",
    { method: "GET" },
    token
  );
}