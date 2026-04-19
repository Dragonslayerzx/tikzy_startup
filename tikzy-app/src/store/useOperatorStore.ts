import { create } from "zustand";

import {
  CurrentTripSessionResponse,
  OperatorAssignedTripItem,
  PassengerManifestItem,
  PassengerManifestResponse,
  TicketValidationResponse,
  confirmTicketBoarding,
  getCurrentPassengerManifest,
  getCurrentTripSession,
  getOperatorPanel,
  startTripSession,
  validateTicket,
} from "@/src/services/operator.service";
import { useAuthStore } from "@/src/store/auth.store";

type OperatorStoreState = {
  isLoading: boolean;
  isStartingTrip: boolean;
  isValidatingTicket: boolean;
  isConfirmingBoarding: boolean;
  isLoadingManifest: boolean;
  error: string | null;

  operatorId: number | null;
  operatorName: string;

  assignedTrips: OperatorAssignedTripItem[];
  selectedTrip: OperatorAssignedTripItem | null;

  currentTrip: CurrentTripSessionResponse | null;
  isTripActive: boolean;

  scannedTicket: TicketValidationResponse | null;

  manifest: PassengerManifestResponse | null;
  passengers: PassengerManifestItem[];

  loadPanel: () => Promise<void>;
  loadCurrentTrip: () => Promise<void>;
  loadPassengerManifest: () => Promise<void>;
  selectTrip: (trip: OperatorAssignedTripItem) => void;
  startTrip: () => Promise<void>;

  validateScannedTicket: (qrCode: string) => Promise<void>;
  confirmBoarding: () => Promise<void>;
  boardPassenger: (bookingId: number) => Promise<void>;
  clearScannedTicket: () => void;

  clearError: () => void;
  resetOperator: () => void;
};

export const useOperatorStore = create<OperatorStoreState>((set, get) => ({
  isLoading: false,
  isStartingTrip: false,
  isValidatingTicket: false,
  isConfirmingBoarding: false,
  isLoadingManifest: false,
  error: null,

  operatorId: null,
  operatorName: "",

  assignedTrips: [],
  selectedTrip: null,

  currentTrip: null,
  isTripActive: false,

  scannedTicket: null,

  manifest: null,
  passengers: [],

  loadPanel: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const panel = await getOperatorPanel(token);

      set((state) => ({
        operatorId: panel.operator_id,
        operatorName: panel.operator_name,
        assignedTrips: panel.assigned_trips,
        selectedTrip: state.selectedTrip ?? panel.assigned_trips[0] ?? null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "No se pudo cargar el panel del operador",
      });
    }
  },

  loadCurrentTrip: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({
        currentTrip: null,
        isTripActive: false,
        error: "No authenticated operator session",
      });
      return;
    }

    try {
      const trip = await getCurrentTripSession(token);
      set({
        currentTrip: trip,
        isTripActive: true,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No active trip session";

      if (message.includes("No active trip session found") || message.includes("404")) {
        set({
          currentTrip: null,
          isTripActive: false,
          manifest: null,
          passengers: [],
        });
        return;
      }

      set({
        currentTrip: null,
        isTripActive: false,
        error: message,
      });
    }
  },

  loadPassengerManifest: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isLoadingManifest: true, error: null });

    try {
      const manifest = await getCurrentPassengerManifest(token);
      set({
        manifest,
        passengers: manifest.passengers,
        isLoadingManifest: false,
      });
    } catch (error) {
      set({
        manifest: null,
        passengers: [],
        isLoadingManifest: false,
        error:
          error instanceof Error ? error.message : "No se pudo cargar el manifiesto",
      });
    }
  },

  selectTrip: (trip) => set({ selectedTrip: trip }),

  startTrip: async () => {
    const token = useAuthStore.getState().token;
    const selectedTrip = get().selectedTrip;

    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    if (!selectedTrip) {
      set({ error: "Selecciona un viaje antes de iniciar" });
      return;
    }

    set({ isStartingTrip: true, error: null });

    try {
      await startTripSession(
        {
          scheduled_trip_id: selectedTrip.scheduled_trip_id,
          vehicle_id: selectedTrip.vehicle_id,
        },
        token
      );

      const currentTrip = await getCurrentTripSession(token);

      set({
        currentTrip,
        isTripActive: true,
        isStartingTrip: false,
        error: null,
      });
    } catch (error) {
      set({
        isStartingTrip: false,
        error:
          error instanceof Error ? error.message : "No se pudo iniciar el viaje",
      });
      throw error;
    }
  },

  validateScannedTicket: async (qrCode) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isValidatingTicket: true, error: null, scannedTicket: null });

    try {
      const ticket = await validateTicket(qrCode, token);

      set({
        scannedTicket: ticket,
        isValidatingTicket: false,
        error: null,
      });
    } catch (error) {
      set({
        scannedTicket: null,
        isValidatingTicket: false,
        error:
          error instanceof Error ? error.message : "No se pudo validar el boleto",
      });
      throw error;
    }
  },

  confirmBoarding: async () => {
    const token = useAuthStore.getState().token;
    const scannedTicket = get().scannedTicket;

    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    if (!scannedTicket) {
      set({ error: "No hay boleto validado" });
      return;
    }

    set({ isConfirmingBoarding: true, error: null });

    try {
      const updatedTicket = await confirmTicketBoarding(
        scannedTicket.booking_id,
        token
      );

      set({
        scannedTicket: updatedTicket,
        isConfirmingBoarding: false,
        error: null,
      });

      await get().loadCurrentTrip();
      await get().loadPassengerManifest();
    } catch (error) {
      set({
        isConfirmingBoarding: false,
        error:
          error instanceof Error ? error.message : "No se pudo confirmar el abordaje",
      });
      throw error;
    }
  },

  boardPassenger: async (bookingId) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isConfirmingBoarding: true, error: null });

    try {
      await confirmTicketBoarding(bookingId, token);
      set({ isConfirmingBoarding: false });
      await get().loadCurrentTrip();
      await get().loadPassengerManifest();
    } catch (error) {
      set({
        isConfirmingBoarding: false,
        error:
          error instanceof Error ? error.message : "No se pudo confirmar el abordaje",
      });
      throw error;
    }
  },

  clearScannedTicket: () => set({ scannedTicket: null }),
  clearError: () => set({ error: null }),

  resetOperator: () =>
    set({
      isLoading: false,
      isStartingTrip: false,
      isValidatingTicket: false,
      isConfirmingBoarding: false,
      isLoadingManifest: false,
      error: null,
      operatorId: null,
      operatorName: "",
      assignedTrips: [],
      selectedTrip: null,
      currentTrip: null,
      isTripActive: false,
      scannedTicket: null,
      manifest: null,
      passengers: [],
    }),
}));