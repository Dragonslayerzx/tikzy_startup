export type ScheduledTripSearchItem = {
  id: number;
  company_id: number;
  company_name: string;
  company_logo_url?: string | null;
  company_rating: number;

  vehicle_id: number;
  vehicle_label: string;
  bus_type: string;

  route_id: number;
  origin_city: string;
  destination_city: string;

  travel_date: string;
  departure_time: string;
  arrival_time: string;

  estimated_duration_minutes: number;
  meeting_point?: string | null;
  service_type: string;

  price: string;
  currency: string;
  available_seats: number;
  status: string;
};

export type SeatMapItem = {
  vehicle_seat_id: number;
  seat_number: string;
  row_number: number;
  column_label: string;
  seat_type: string;
  position?: string | null;
  is_active: boolean;
  is_occupied: boolean;
};

export type BookingResponse = {
  id: number;
  scheduled_trip_id: number;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  passenger_count: number;
  total_amount: string;
  status: string;
  seats: {
    id: number;
    vehicle_seat_id: number;
    seat_number: string;
  }[];
  created_at: string;
  updated_at: string;
};