export type TripStatus = "upcoming" | "completed" | "cancelled";

export type Trip = {
  id: string;
  from: string;
  to: string;
  operator: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  total: number;
  status: TripStatus;
  terminal: string;
  boardingPoint: string;
};

export const mockTrips: Trip[] = [
  {
    id: "1",
    from: "Tegucigalpa",
    to: "San Pedro Sula",
    operator: "Hedman Alas",
    date: "Apr 12, 2026",
    departureTime: "7:30 AM",
    arrivalTime: "11:30 AM",
    seats: ["B4", "B5"],
    total: 498.0,
    status: "upcoming",
    terminal: "Terminal Centro",
    boardingPoint: "Platform 4",
  },
  {
    id: "2",
    from: "Tegucigalpa",
    to: "La Ceiba",
    operator: "Cristina",
    date: "Apr 15, 2026",
    departureTime: "6:00 AM",
    arrivalTime: "12:00 PM",
    seats: ["C7"],
    total: 365.0,
    status: "completed",
    terminal: "Terminal Norte",
    boardingPoint: "Platform 2",
  },
  {
    id: "3",
    from: "San Pedro Sula",
    to: "Tegucigalpa",
    operator: "Viana",
    date: "Mar 20, 2026",
    departureTime: "2:00 PM",
    arrivalTime: "6:00 PM",
    seats: ["A1"],
    total: 310.0,
    status: "cancelled",
    terminal: "Gran Central Metropolitana",
    boardingPoint: "Platform 6",
  },
];