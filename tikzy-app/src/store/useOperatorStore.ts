import { create } from "zustand";

export type Vehicle = {
  id: string;
  interno: string;
  placa: string;
};

export type Passenger = {
  id: string;
  name: string;
  seat: string;
  ticketNumber: string;
  type: string; // Adulto, Estudiante, Adulto Mayor
  boarded: boolean;
};

export type OperatorState = {
  // Operator info
  operatorName: string;
  operatorId: string;

  // Vehicle
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;

  // Route
  routeOrigin: string;
  routeDestination: string;
  nextDeparture: string;
  routeId: string;
  routeName: string;

  // Trip state
  isTripActive: boolean;
  currentOccupancy: number;
  totalCapacity: number;
  nextStop: string;
  nextStopMinutes: number;
  distanceKm: number;

  // Passengers manifest
  passengers: Passenger[];

  // Settlement
  totalRevenue: number;
  scannedTickets: number;
  manualSales: number;
  totalKm: number;
  totalHours: string;
  appRevenue: number;
  cashRevenue: number;
  cancellations: number;

  // Actions
  selectVehicle: (vehicle: Vehicle) => void;
  startTrip: () => void;
  endTrip: () => void;
  boardPassenger: (passengerId: string) => void;
  addManualPassenger: (passenger: Passenger) => void;
  resetOperator: () => void;
};

const mockVehicles: Vehicle[] = [
  { id: "1", interno: "BUS-402", placa: "TPX-982" },
  { id: "2", interno: "BUS-115", placa: "TPX-441" },
  { id: "3", interno: "BUS-208", placa: "TPX-763" },
];

const mockPassengers: Passenger[] = [
  { id: "1", name: "Alejandro Ramírez", seat: "04A", ticketNumber: "TK-88902", type: "Adulto", boarded: true },
  { id: "2", name: "Sofía Valenzuela", seat: "04B", ticketNumber: "TK-88903", type: "Estudiante", boarded: true },
  { id: "3", name: "Roberto Mendez Ruiz", seat: "12C", ticketNumber: "TK-88915", type: "Adulto", boarded: false },
  { id: "4", name: "Lucía Fernández", seat: "12D", ticketNumber: "TK-88916", type: "Adulto Mayor", boarded: false },
  { id: "5", name: "Marcos Aurelio", seat: "15A", ticketNumber: "TK-88942", type: "Adulto", boarded: true },
];

const initialState = {
  operatorName: "Anthony Ochoa",
  operatorId: "OP-1024",
  vehicles: mockVehicles,
  selectedVehicle: mockVehicles[0],
  routeOrigin: "Tegucigalpa",
  routeDestination: "San Pedro Sula",
  nextDeparture: "08:15 AM",
  routeId: "A-12",
  routeName: "402 - Directo",
  isTripActive: false,
  currentOccupancy: 32,
  totalCapacity: 45,
  nextStop: "Terminal Norte",
  nextStopMinutes: 4,
  distanceKm: 89,
  passengers: mockPassengers,
  totalRevenue: 14500.0,
  scannedTickets: 342,
  manualSales: 58,
  totalKm: 128.5,
  totalHours: "06:45",
  appRevenue: 9240.0,
  cashRevenue: 5340.0,
  cancellations: 0,
};

export const useOperatorStore = create<OperatorState>()((set) => ({
  ...initialState,

  selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  startTrip: () => set({ isTripActive: true }),

  endTrip: () =>
    set({
      isTripActive: false,
    }),

  boardPassenger: (passengerId) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === passengerId ? { ...p, boarded: true } : p
      ),
      currentOccupancy: state.currentOccupancy + 1,
    })),

  addManualPassenger: (passenger) =>
    set((state) => ({
      passengers: [...state.passengers, passenger],
      manualSales: state.manualSales + 1,
      currentOccupancy: state.currentOccupancy + 1,
    })),

  resetOperator: () => set({ ...initialState }),
}));
