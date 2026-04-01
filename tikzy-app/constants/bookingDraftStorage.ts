import AsyncStorage from "@react-native-async-storage/async-storage";

export type BookingDraft = {
  from: string;
  to: string;
  operator: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  total: number;
  terminal: string;
  boardingPoint: string;
};

const BOOKING_DRAFT_KEY = "tikzy_pending_booking";

export async function saveBookingDraft(draft: BookingDraft) {
  try {
    await AsyncStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("Error saving booking draft:", error);
  }
}

export async function getBookingDraft(): Promise<BookingDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingDraft;
  } catch (error) {
    console.error("Error reading booking draft:", error);
    return null;
  }
}

export async function clearBookingDraft() {
  try {
    await AsyncStorage.removeItem(BOOKING_DRAFT_KEY);
  } catch (error) {
    console.error("Error clearing booking draft:", error);
  }
}