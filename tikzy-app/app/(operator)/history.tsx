import { useOperatorStore } from "@/src/store/useOperatorStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HistoryScreen() {
  const router = useRouter();
  const {
    error,
    manifest,
    passengers,
    isLoadingManifest,
    isConfirmingBoarding,
    loadPassengerManifest,
    boardPassenger,
    clearError,
  } = useOperatorStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPassengerManifest();
  }, [loadPassengerManifest]);

  useEffect(() => {
    if (error) {
      Alert.alert("Manifiesto", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const filteredPassengers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return passengers;

    return passengers.filter((p) => {
      const seats = p.seat_numbers.join(" ").toLowerCase();
      return (
        p.customer_name.toLowerCase().includes(q) ||
        (p.primary_seat ?? "").toLowerCase().includes(q) ||
        seats.includes(q) ||
        p.ticket_code.toLowerCase().includes(q)
      );
    });
  }, [passengers, searchQuery]);

  if (isLoadingManifest && !manifest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1F3CCF" />
          <Text style={styles.centerText}>Cargando manifiesto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!manifest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.centerTitle}>No hay viaje activo</Text>
          <Text style={styles.centerText}>
            Inicia un viaje para ver la lista de pasajeros.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manifiesto de Pasajeros</Text>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <Ionicons name="filter-outline" size={20} color="#1F3CCF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripRoute}>
              <View style={styles.routeDotOrigin} />
              <Text style={styles.tripRouteText}>
                {manifest.route_origin} → {manifest.route_destination}
              </Text>
            </View>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Activo</Text>
            </View>
          </View>

          <View style={styles.tripStatsRow}>
            <View style={styles.tripStat}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.tripStatText}>{manifest.departure_time}</Text>
            </View>
            <View style={styles.tripStat}>
              <Ionicons name="bus-outline" size={16} color="#6B7280" />
              <Text style={styles.tripStatText}>{manifest.vehicle_label}</Text>
            </View>
            <View style={styles.tripStat}>
              <Ionicons name="people-outline" size={16} color="#6B7280" />
              <Text style={styles.tripStatText}>
                {manifest.boarded_count}/{manifest.total_passengers}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso de Abordaje</Text>
              <Text style={styles.progressPercent}>{manifest.boarding_percent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${manifest.boarding_percent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre, asiento o boleto..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Pasajeros ({filteredPassengers.length})
          </Text>
        </View>

        {filteredPassengers.map((passenger) => (
          <View key={passenger.booking_id} style={styles.passengerCard}>
            <View style={styles.passengerLeft}>
              <View
                style={[
                  styles.seatBadge,
                  passenger.is_boarded
                    ? styles.seatBadgeBoarded
                    : styles.seatBadgePending,
                ]}
              >
                <Text
                  style={[
                    styles.seatText,
                    passenger.is_boarded
                      ? styles.seatTextBoarded
                      : styles.seatTextPending,
                  ]}
                >
                  {passenger.primary_seat ?? "--"}
                </Text>
              </View>

              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{passenger.customer_name}</Text>
                <Text style={styles.passengerTicket}>
                  #{passenger.ticket_code} · {passenger.passenger_count} pasajero(s)
                </Text>
                {passenger.seat_numbers.length > 1 ? (
                  <Text style={styles.passengerSeats}>
                    Asientos: {passenger.seat_numbers.join(", ")}
                  </Text>
                ) : null}
              </View>
            </View>

            {passenger.is_boarded ? (
              <View style={styles.boardedIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color="#22C55E"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.boardButton,
                  isConfirmingBoarding && styles.boardButtonDisabled,
                ]}
                onPress={() => boardPassenger(passenger.booking_id)}
                activeOpacity={0.9}
                disabled={isConfirmingBoarding}
              >
                <Text style={styles.boardButtonText}>ABORDAR</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(operator)/scanner")}
        activeOpacity={0.9}
      >
        <Ionicons name="qr-code" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F0FE" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  centerTitle: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 8 },
  centerText: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111827" },
  filterButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", shadowColor: "#000",
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  tripCard: {
    backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  tripHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
  },
  tripRoute: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  routeDotOrigin: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: "#1F3CCF", marginRight: 10,
  },
  tripRouteText: { fontSize: 16, fontWeight: "800", color: "#111827", flexShrink: 1 },
  activeBadge: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5",
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E", marginRight: 6 },
  activeText: { fontSize: 12, fontWeight: "800", color: "#166534" },
  tripStatsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 18 },
  tripStat: { flexDirection: "row", alignItems: "center", gap: 6 },
  tripStatText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  progressSection: { marginTop: 4 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { fontSize: 14, fontWeight: "700", color: "#374151" },
  progressPercent: { fontSize: 14, fontWeight: "800", color: "#1F3CCF" },
  progressBarBg: {
    height: 10, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden",
  },
  progressBarFill: { height: 10, backgroundColor: "#1F3CCF", borderRadius: 999 },
  searchContainer: {
    backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 16,
    height: 56, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827" },
  listHeader: { marginBottom: 12 },
  listTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  passengerCard: {
    backgroundColor: "#FFFFFF", borderRadius: 22, padding: 16, marginBottom: 12,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  passengerLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  seatBadge: {
    width: 58, height: 58, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  seatBadgeBoarded: { backgroundColor: "#DCFCE7" },
  seatBadgePending: { backgroundColor: "#EEF2FF" },
  seatText: { fontSize: 20, fontWeight: "900" },
  seatTextBoarded: { color: "#166534" },
  seatTextPending: { color: "#1F3CCF" },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontWeight: "800", color: "#111827" },
  passengerTicket: { fontSize: 13, color: "#6B7280", marginTop: 4, fontWeight: "600" },
  passengerSeats: { fontSize: 12, color: "#94A3B8", marginTop: 4, fontWeight: "600" },
  boardedIcon: { padding: 4 },
  boardButton: {
    backgroundColor: "#1F3CCF", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
  },
  boardButtonDisabled: { opacity: 0.6 },
  boardButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
  fab: {
    position: "absolute", right: 20, bottom: 24, width: 62, height: 62, borderRadius: 31,
    backgroundColor: "#1F3CCF", alignItems: "center", justifyContent: "center",
    shadowColor: "#1F3CCF", shadowOpacity: 0.28, shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
});