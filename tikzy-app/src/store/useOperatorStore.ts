import { create } from "zustand";

import {
  CurrentTripSessionResponse,
  ManualSalePayload,
  ManualSaleResponse,
  OperatorAssignedTripItem,
  PassengerManifestItem,
  PassengerManifestResponse,
  SeatMapResponse,
  TicketValidationResponse,
  confirmTicketBoarding,
  createManualSale,
  endCurrentTripSession,
  getCurrentPassengerManifest,
  getCurrentSeatMap,
  getCurrentTripSession,
  getOperatorPanel,
  startTripSession,
  validateTicket,
} from "@/src/services/operator.service";
import { useAuthStore } from "@/src/store/auth.store";

type OperatorStoreState = {
  isLoading: boolean;
  isStartingTrip: boolean;
  isEndingTrip: boolean;
  isValidatingTicket: boolean;
  isConfirmingBoarding: boolean;
  isLoadingManifest: boolean;
  isLoadingSeatMap: boolean;
  isCreatingManualSale: boolean;
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

  seatMap: SeatMapResponse | null;

  lastManualSale: ManualSaleResponse | null;
  manualSalesHistory: ManualSaleResponse[];

  loadPanel: () => Promise<void>;
  loadCurrentTrip: () => Promise<void>;
  loadPassengerManifest: () => Promise<void>;
  loadSeatMap: () => Promise<void>;

  selectTrip: (trip: OperatorAssignedTripItem) => void;
  startTrip: () => Promise<void>;
  endTrip: () => Promise<void>;

  validateScannedTicket: (qrCode: string) => Promise<void>;
  confirmBoarding: () => Promise<void>;
  boardPassenger: (bookingId: number) => Promise<void>;
  clearScannedTicket: () => void;

  createSale: (payload: ManualSalePayload) => Promise<void>;

  totalRevenue: number;
  scannedTickets: number;
  manualSales: number;
  totalKm: number;
  totalHours: number;
  appRevenue: number;
  cashRevenue: number;
  cancellations: number;
  routeOrigin: string;
  routeDestination: string;

  clearError: () => void;
  resetOperator: () => void;
};

const hoursBetween = (startedAt?: string | null) => {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return 0;
  const diffMs = Date.now() - start;
  return Math.max(0, diffMs / (1000 * 60 * 60));
};

export const useOperatorStore = create<OperatorStoreState>((set, get) => ({
  isLoading: false,
  isStartingTrip: false,
  isEndingTrip: false,
  isValidatingTicket: false,
  isConfirmingBoarding: false,
  isLoadingManifest: false,
  isLoadingSeatMap: false,
  isCreatingManualSale: false,
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

  seatMap: null,

  lastManualSale: null,
  manualSalesHistory: [],

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
          error instanceof Error
            ? error.message
            : "No se pudo cargar el panel del operador",
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

      if (
        message.includes("No active trip session found") ||
        message.includes("404")
      ) {
        set({
          currentTrip: null,
          isTripActive: false,
          manifest: null,
          passengers: [],
          seatMap: null,
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
          error instanceof Error
            ? error.message
            : "No se pudo cargar el manifiesto",
      });
    }
  },

  loadSeatMap: async () => {
    const token = useAuthStore.getState().token;

    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isLoadingSeatMap: true, error: null });

    try {
      const seatMap = await getCurrentSeatMap(token);

      set({
        seatMap,
        isLoadingSeatMap: false,
      });
    } catch (error) {
      set({
        seatMap: null,
        isLoadingSeatMap: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar el mapa de asientos",
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
          error instanceof Error
            ? error.message
            : "No se pudo iniciar el viaje",
      });
      throw error;
    }
  },

  endTrip: async () => {
    const token = useAuthStore.getState().token;

    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({ isEndingTrip: true, error: null });

    try {
      await endCurrentTripSession(token);

      set({
        isEndingTrip: false,
        currentTrip: null,
        isTripActive: false,
        manifest: null,
        passengers: [],
        seatMap: null,
        scannedTicket: null,
        lastManualSale: null,
      });
    } catch (error) {
      set({
        isEndingTrip: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo finalizar el viaje",
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
          error instanceof Error
            ? error.message
            : "No se pudo validar el boleto",
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
      await get().loadSeatMap();
    } catch (error) {
      set({
        isConfirmingBoarding: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo confirmar el abordaje",
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
      await get().loadSeatMap();
    } catch (error) {
      set({
        isConfirmingBoarding: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo confirmar el abordaje",
      });
      throw error;
    }
  },

  clearScannedTicket: () => set({ scannedTicket: null }),

  createSale: async (payload) => {
    const token = useAuthStore.getState().token;

    if (!token) {
      set({ error: "No authenticated operator session" });
      return;
    }

    set({
      isCreatingManualSale: true,
      error: null,
      lastManualSale: null,
    });

    try {
      const sale = await createManualSale(payload, token);

      set((state) => ({
        lastManualSale: sale,
        manualSalesHistory: [sale, ...state.manualSalesHistory],
        isCreatingManualSale: false,
      }));

      await get().loadCurrentTrip();
      await get().loadPassengerManifest();
      await get().loadSeatMap();
    } catch (error) {
      set({
        isCreatingManualSale: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo registrar la venta manual",
      });
      throw error;
    }
  },

  get totalRevenue() {
    const manifestRevenue = get().passengers.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    );
    return manifestRevenue;
  },

  get scannedTickets() {
    return get().passengers.filter((p) => p.is_boarded).length;
  },

  get manualSales() {
    return get().manualSalesHistory.length;
  },

  get totalKm() {
    return Math.round(Number(get().currentTrip?.distance_km ?? 0));
  },

  get totalHours() {
    const hrs = hoursBetween(get().currentTrip?.started_at);
    return Number(hrs.toFixed(1));
  },

  get appRevenue() {
    const manualIds = new Set(get().manualSalesHistory.map((sale) => sale.booking_id));
    return get().passengers
      .filter((p) => !manualIds.has(p.booking_id))
      .reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  },

  get cashRevenue() {
    return get().manualSalesHistory.reduce(
      (sum, sale) => sum + Number(sale.total_amount || 0),
      0
    );
  },

  get cancellations() {
    return get().passengers.filter((p) => p.status === "cancelled").length;
  },

  get routeOrigin() {
    return get().currentTrip?.origin_city ?? get().manifest?.route_origin ?? "Origen";
  },

  get routeDestination() {
    return (
      get().currentTrip?.destination_city ??
      get().manifest?.route_destination ??
      "Destino"
    );
  },

  clearError: () => set({ error: null }),

  resetOperator: () =>
    set({
      isLoading: false,
      isStartingTrip: false,
      isEndingTrip: false,
      isValidatingTicket: false,
      isConfirmingBoarding: false,
      isLoadingManifest: false,
      isLoadingSeatMap: false,
      isCreatingManualSale: false,
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
      seatMap: null,
      lastManualSale: null,
      manualSalesHistory: [],
    }),
}));