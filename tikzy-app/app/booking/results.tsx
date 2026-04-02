import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { apiFetch } from "@/src/services/api";
import { useBookingStore } from "@/src/store/useBookingStore";
import type { ScheduledTripSearchItem } from "@/src/types/tikzy";

function formatDuration(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

function formatPrice(value: string) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return `L. ${amount.toFixed(2)}`;
}

export default function ResultsScreen() {
  const origin = useBookingStore((state) => state.origin);
  const destination = useBookingStore((state) => state.destination);
  const date = useBookingStore((state) => state.date);
  const passengers = useBookingStore((state) => state.passengers);
  const setSelectedTrip = useBookingStore((state) => state.setSelectedTrip);

  const [trips, setTrips] = useState<ScheduledTripSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    return `/scheduled-trips/search?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(
      date
    )}&passengers=${passengers}`;
  }, [origin, destination, date, passengers]);

  const loadTrips = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const data = await apiFetch<ScheduledTripSearchItem[]>(queryString);
      setTrips(data);
    } catch (err) {
      console.error("Error loading trips:", err);
      setTrips([]);
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar las rutas."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!origin || !destination || !date) {
      router.replace("/(tabs)/home");
      return;
    }

    loadTrips();
  }, [origin, destination, date, passengers]);

  const handleSelectTrip = (trip: ScheduledTripSearchItem) => {
    setSelectedTrip(trip);
    router.push("/booking/seats");
  };

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
            <Text style={styles.headerTitle}>Resultados</Text>
            <Text style={styles.headerSubtitle}>
              {origin} → {destination}
            </Text>
          </View>

          <View style={styles.iconButtonPlaceholder} />
        </View>

        <View style={styles.searchSummary}>
          <Text style={styles.searchSummaryText}>
            Fecha: {date} · Pasajeros: {passengers}
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2F49E3" />
            <Text style={styles.centerText}>Buscando rutas disponibles...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadTrips(true)}
              />
            }
          >
            {error ? (
              <View style={styles.errorCard}>
                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color="#DC2626"
                />
                <Text style={styles.errorTitle}>No se pudieron cargar rutas</Text>
                <Text style={styles.errorText}>{error}</Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => loadTrips()}
                  activeOpacity={0.9}
                >
                  <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {!error && trips.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="bus-outline" size={40} color="#2F49E3" />
                <Text style={styles.emptyTitle}>No encontramos rutas</Text>
                <Text style={styles.emptyText}>
                  Prueba con otra fecha, origen o destino.
                </Text>
              </View>
            ) : null}

            {trips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripTopRow}>
                  <View style={styles.companyBox}>
                    <Text style={styles.companyName}>{trip.company_name}</Text>
                    <Text style={styles.busType}>{trip.bus_type}</Text>
                  </View>

                  <View style={styles.pricePill}>
                    <Text style={styles.priceText}>{formatPrice(trip.price)}</Text>
                  </View>
                </View>

                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Salida</Text>
                    <Text style={styles.timeValue}>{trip.departure_time}</Text>
                  </View>

                  <View style={styles.centerRoute}>
                    <Text style={styles.routeDuration}>
                      {formatDuration(trip.estimated_duration_minutes)}
                    </Text>
                    <Text style={styles.routeArrow}>→</Text>
                  </View>

                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Llegada</Text>
                    <Text style={styles.timeValue}>{trip.arrival_time}</Text>
                  </View>
                </View>

                <View style={styles.metaWrap}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={16} color="#2F49E3" />
                    <Text style={styles.metaText}>
                      {trip.meeting_point || "Punto de encuentro por definir"}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="git-compare-outline" size={16} color="#2F49E3" />
                    <Text style={styles.metaText}>{trip.service_type}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={16} color="#2F49E3" />
                    <Text style={styles.metaText}>
                      {trip.available_seats} asientos disponibles
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="bus-outline" size={16} color="#2F49E3" />
                    <Text style={styles.metaText}>{trip.vehicle_label}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleSelectTrip(trip)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectButtonText}>Seleccionar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
    textAlign: "center",
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#667085",
    textAlign: "center",
  },
  searchSummary: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchSummaryText: {
    fontSize: 13,
    color: "#475467",
    fontWeight: "600",
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerText: {
    marginTop: 12,
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: "#2F49E3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tripTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  companyBox: {
    flex: 1,
  },
  companyName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  busType: {
    fontSize: 13,
    color: "#667085",
    fontWeight: "600",
  },
  pricePill: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2F49E3",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    color: "#98A2B3",
    marginBottom: 4,
    fontWeight: "700",
  },
  timeValue: {
    fontSize: 15,
    color: "#101828",
    fontWeight: "800",
  },
  centerRoute: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  routeDuration: {
    fontSize: 12,
    color: "#667085",
    fontWeight: "700",
    marginBottom: 4,
  },
  routeArrow: {
    fontSize: 22,
    color: "#2F49E3",
    fontWeight: "800",
  },
  metaWrap: {
    gap: 10,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontSize: 13,
    color: "#475467",
    fontWeight: "600",
  },
  selectButton: {
    backgroundColor: "#2F49E3",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});