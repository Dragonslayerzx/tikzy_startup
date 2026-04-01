import AsyncStorage from "@react-native-async-storage/async-storage";

export type TripStatus = "upcoming" | "completed" | "cancelled";

export type StoredTrip = {
  id: string;
  tripId: string;
  company: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalPaid: number;
  terminal: string;
  busNumber: string;
  qrValue: string;
  status: TripStatus;
  createdAt: string;
};

const TRIPS_STORAGE_KEY = "tikzy_trips";

export async function getTrips(): Promise<StoredTrip[]> {
  try {
    const raw = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((trip: any) => ({
      ...trip,
      id: trip.id ?? trip.tripId,
      status: trip.status ?? "upcoming",
      createdAt: trip.createdAt ?? new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error reading trips:", error);
    return [];
  }
}

export async function addTrip(trip: StoredTrip): Promise<void> {
  try {
    const existingTrips = await getTrips();

    const alreadyExists = existingTrips.some(
      (item) => item.id === trip.id || item.tripId === trip.tripId
    );

    if (alreadyExists) return;

    const updatedTrips = [trip, ...existingTrips];
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
  } catch (error) {
    console.error("Error saving trip:", error);
    throw error;
  }
}

export async function getTripById(id: string): Promise<StoredTrip | null> {
  try {
    const trips = await getTrips();
    return trips.find((trip) => trip.id === id) ?? null;
  } catch (error) {
    console.error("Error reading trip by id:", error);
    return null;
  }
}

export async function updateTripStatus(
  id: string,
  status: TripStatus
): Promise<void> {
  try {
    const trips = await getTrips();

    const updatedTrips = trips.map((trip) =>
      trip.id === id ? { ...trip, status } : trip
    );

    await AsyncStorage.setItem(
      TRIPS_STORAGE_KEY,
      JSON.stringify(updatedTrips)
    );
  } catch (error) {
    console.error("Error updating trip status:", error);
    throw error;
  }
}

export async function clearTrips(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing trips:", error);
  }
}