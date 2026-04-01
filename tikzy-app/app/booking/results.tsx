import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteOption, useBookingStore } from "@/src/store/useBookingStore";

type TripItem = {
  id: string;
  company: string;
  model: string;
  rating: number;
  reviews: string;
  departure: string;
  arrival: string;
  duration: string;
  type: string;
  pickup: string;
  price: string;
};

const trips: TripItem[] = [
  {
    id: "1",
    company: "Transportes San Pedro",
    model: "MERCEDES BENZ O-500",
    rating: 4.5,
    reviews: "1.1k",
    departure: "10:00",
    arrival: "15:00",
    duration: "5h 00m",
    type: "Directo",
    pickup: "Punto de encuentro: Terminal Mall Premier",
    price: "L. 150",
  },
  {
    id: "2",
    company: "Transportes Carolina",
    model: "MERCEDES - MARCO POLO",
    rating: 4.8,
    reviews: "2.4k",
    departure: "12:00",
    arrival: "17:00",
    duration: "5h 00m",
    type: "Directo",
    pickup: "Punto de encuentro: Terminal Comayagüela",
    price: "L. 200",
  },
  {
    id: "3",
    company: "Transportes Cristina",
    model: "MERCEDES - TURISMO",
    rating: 4.2,
    reviews: "800",
    departure: "13:00",
    arrival: "18:30",
    duration: "5h 30m",
    type: "1 Parada",
    pickup: "Punto de encuentro: Terminal Blvd. Fuerzas Armadas",
    price: "L. 220",
  },
];

type FilterType = "cheapest" | "fastest" | "company";

export default function ResultsScreen() {
  const origin = useBookingStore((state) => state.origin);
  const destination = useBookingStore((state) => state.destination);
  const date = useBookingStore((state) => state.date);
  const passengers = useBookingStore((state) => state.passengers);
  const setSelectedRoute = useBookingStore((state) => state.setSelectedRoute);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("cheapest");

  useEffect(() => {
    if (!origin || !destination || !date) {
      router.replace("/(tabs)/home");
    }
  }, [origin, destination, date]);

  const sortedTrips = useMemo(() => {
    const data = [...trips];

    if (selectedFilter === "cheapest") {
      return data.sort(
        (a, b) =>
          Number(a.price.replace("L.", "").trim()) -
          Number(b.price.replace("L.", "").trim())
      );
    }

    if (selectedFilter === "fastest") {
      const parseDuration = (value: string) => {
        const match = value.match(/(\d+)h\s*(\d+)m/i);
        if (!match) return 0;
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        return hours * 60 + minutes;
      };

      return data.sort(
        (a, b) => parseDuration(a.duration) - parseDuration(b.duration)
      );
    }

    if (selectedFilter === "company") {
      return data.sort((a, b) => a.company.localeCompare(b.company));
    }

    return data;
  }, [selectedFilter]);

  const handleSelectRoute = (trip: TripItem) => {
    const route: RouteOption = {
      id: trip.id,
      company: trip.company,
      busType: trip.model,
      origin,
      destination,
      departureTime: trip.departure,
      arrivalTime: trip.arrival,
      duration: trip.duration,
      price: Number(trip.price.replace("L.", "").trim()),
      meetingPoint: trip.pickup,
      busNumber: "#42",
    };

    setSelectedRoute(route);
    router.push("/booking/seats");
  };

  const passengerLabel =
    passengers > 1 ? `${passengers} Pasajeros` : `${passengers} Pasajero`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color="#23304A" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.routeTitle}>
              {origin} → {destination}
            </Text>
            <Text style={styles.routeMeta}>
              {date} · {passengerLabel}
            </Text>
          </View>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={20} color="#23304A" />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "cheapest" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("cheapest")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "cheapest" && styles.filterTextActive,
              ]}
            >
              Más barato
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={selectedFilter === "cheapest" ? "#FFFFFF" : "#667085"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "fastest" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("fastest")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "fastest" && styles.filterTextActive,
              ]}
            >
              Más rápido
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={selectedFilter === "fastest" ? "#FFFFFF" : "#667085"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "company" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("company")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "company" && styles.filterTextActive,
              ]}
            >
              Empresa
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={selectedFilter === "company" ? "#FFFFFF" : "#667085"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {sortedTrips.map((trip) => (
            <View key={trip.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.companyBadge}>
                  <Ionicons name="bus-outline" size={18} color="#FFFFFF" />
                </View>

                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{trip.company}</Text>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F5B301" />
                    <Text style={styles.ratingText}>
                      {trip.rating} ({trip.reviews})
                    </Text>
                  </View>
                </View>

                <View style={styles.modelChip}>
                  <Text style={styles.modelChipText} numberOfLines={1}>
                    {trip.model}
                  </Text>
                </View>
              </View>

              <View style={styles.scheduleRow}>
                <View style={styles.scheduleBlock}>
                  <Text style={styles.timeText}>{trip.departure}</Text>
                  <Text style={styles.stationText}>TGU</Text>
                </View>

                <View style={styles.middleBlock}>
                  <Text style={styles.durationText}>{trip.duration}</Text>

                  <View style={styles.lineRow}>
                    <View style={styles.line} />
                    <Ionicons name="bus-outline" size={14} color="#667085" />
                    <View style={styles.line} />
                  </View>

                  <Text style={styles.tripTypeText}>{trip.type}</Text>
                </View>

                <View style={styles.scheduleBlock}>
                  <Text style={styles.timeText}>{trip.arrival}</Text>
                  <Text style={styles.stationText}>SPS</Text>
                </View>
              </View>

              <View style={styles.pickupBox}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#5A67D8"
                  style={styles.pickupIcon}
                />
                <Text style={styles.pickupText}>{trip.pickup}</Text>
              </View>

              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.priceLabel}>DESDE</Text>
                  <Text style={styles.priceText}>{trip.price}</Text>
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleSelectRoute(trip)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectButtonText}>Seleccionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF1FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
    textAlign: "center",
  },
  routeMeta: {
    marginTop: 3,
    fontSize: 13,
    color: "#667085",
    textAlign: "center",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#2F49E3",
    borderColor: "#2F49E3",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475467",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  companyBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0E9F6E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
    paddingRight: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#475467",
  },
  modelChip: {
    maxWidth: 130,
    backgroundColor: "#F3F6FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modelChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2F49E3",
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  scheduleBlock: {
    alignItems: "center",
    width: 70,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
  },
  stationText: {
    marginTop: 4,
    fontSize: 13,
    color: "#667085",
  },
  middleBlock: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2F49E3",
    marginBottom: 6,
  },
  lineRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D5DD",
  },
  tripTypeText: {
    fontSize: 13,
    color: "#667085",
  },
  pickupBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F7FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  pickupIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  pickupText: {
    flex: 1,
    fontSize: 14,
    color: "#2F49E3",
    fontWeight: "600",
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#98A2B3",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
  },
  selectButton: {
    minWidth: 140,
    backgroundColor: "#2F49E3",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});