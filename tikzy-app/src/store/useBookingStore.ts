import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { StoredTrip } from "@/constants/tripsStorage";
import type { ScheduledTripSearchItem } from "@/src/types/tikzy";

export type PaymentMethod = "card" | "cash" | "transfer";
export type ConfirmedTrip = StoredTrip;

type BookingState = {
  origin: string;
  destination: string;
  date: string;
  passengers: number;

  selectedTrip: ScheduledTripSearchItem | null;
  selectedSeats: string[];
  paymentMethod: PaymentMethod | null;

  confirmedTrip: ConfirmedTrip | null;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  setSearchData: (payload: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }) => void;

  setSelectedTrip: (trip: ScheduledTripSearchItem | null) => void;
  setSelectedSeats: (seats: string[]) => void;
  toggleSeat: (seat: string) => void;
  clearSeats: () => void;

  setPaymentMethod: (method: PaymentMethod | null) => void;
  confirmTrip: (trip: ConfirmedTrip) => void;
  resetBooking: () => void;
};

const initialState = {
  origin: "",
  destination: "",
  date: "",
  passengers: 1,
  selectedTrip: null,
  selectedSeats: [],
  paymentMethod: null,
  confirmedTrip: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      setSearchData: ({ origin, destination, date, passengers }) =>
        set({
          origin,
          destination,
          date,
          passengers,
          selectedTrip: null,
          selectedSeats: [],
          paymentMethod: null,
          confirmedTrip: null,
        }),

      setSelectedTrip: (trip) =>
        set({
          selectedTrip: trip,
          selectedSeats: [],
          paymentMethod: null,
          confirmedTrip: null,
        }),

      setSelectedSeats: (seats) => set({ selectedSeats: seats }),

      toggleSeat: (seat) => {
        const { selectedSeats, passengers } = get();
        const normalizedSeat = seat.trim().toUpperCase();

        if (selectedSeats.includes(normalizedSeat)) {
          set({
            selectedSeats: selectedSeats.filter((item) => item !== normalizedSeat),
          });
          return;
        }

        if (selectedSeats.length >= passengers) {
          return;
        }

        set({
          selectedSeats: [...selectedSeats, normalizedSeat],
        });
      },

      clearSeats: () => set({ selectedSeats: [] }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      confirmTrip: (trip) => set({ confirmedTrip: trip }),

      resetBooking: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "tikzy-booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        origin: state.origin,
        destination: state.destination,
        date: state.date,
        passengers: state.passengers,
        selectedTrip: state.selectedTrip,
        selectedSeats: state.selectedSeats,
        paymentMethod: state.paymentMethod,
        confirmedTrip: state.confirmedTrip,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);