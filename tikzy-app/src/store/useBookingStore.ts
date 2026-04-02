import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StoredTrip } from "@/constants/tripsStorage";

export type PaymentMethod = "card" | "cash" | "transfer";

export type RouteOption = {
  id: string;
  company: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  meetingPoint: string;
  busNumber?: string;
};

export type ConfirmedTrip = StoredTrip;

type BookingState = {
  origin: string;
  destination: string;
  date: string;
  passengers: number;

  selectedRoute: RouteOption | null;
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

  setSelectedRoute: (route: RouteOption) => void;
  toggleSeat: (seat: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  confirmTrip: (trip: ConfirmedTrip) => void;

  clearSeats: () => void;
  resetBooking: () => void;
};

const initialState = {
  origin: "",
  destination: "",
  date: "",
  passengers: 1,
  selectedRoute: null,
  selectedSeats: [],
  paymentMethod: null,
  confirmedTrip: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      setSearchData: ({ origin, destination, date, passengers }) =>
        set({
          origin,
          destination,
          date,
          passengers,
          selectedRoute: null,
          selectedSeats: [],
          paymentMethod: null,
          confirmedTrip: null,
        }),

      setSelectedRoute: (route) =>
        set({
          selectedRoute: route,
          selectedSeats: [],
          paymentMethod: null,
          confirmedTrip: null,
        }),

      toggleSeat: (seat) =>
        set((state) => {
          const alreadySelected = state.selectedSeats.includes(seat);

          if (alreadySelected) {
            return {
              selectedSeats: state.selectedSeats.filter((s) => s !== seat),
            };
          }

          if (state.selectedSeats.length >= state.passengers) {
            return state;
          }

          return {
            selectedSeats: [...state.selectedSeats, seat],
          };
        }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      confirmTrip: (trip) => set({ confirmedTrip: trip }),

      clearSeats: () => set({ selectedSeats: [] }),

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
        selectedRoute: state.selectedRoute,
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