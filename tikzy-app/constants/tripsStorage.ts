import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip } from "@/constants/mockTrips";

const TRIPS_STORAGE_KEY = "tikzy_user_trips";

export async function getStoredTrips(): Promise<Trip[]> {
  try {
    const raw = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Trip[];
  } catch (error) {
    console.error("Error reading trips:", error);
    return [];
  }
}

export async function saveStoredTrips(trips: Trip[]) {
  try {
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Error saving trips:", error);
  }
}

export async function addTrip(newTrip: Trip) {
  const currentTrips = await getStoredTrips();
  const updatedTrips = [newTrip, ...currentTrips];
  await saveStoredTrips(updatedTrips);
}

export async function clearTrips() {
  try {
    await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing trips:", error);
  }
}