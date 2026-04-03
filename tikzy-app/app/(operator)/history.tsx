import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useOperatorStore } from "@/src/store/useOperatorStore";

export default function HistoryScreen() {
  const router = useRouter();
  const {
    passengers,
    routeOrigin,
    routeDestination,
    nextDeparture,
    selectedVehicle,
    boardPassenger,
  } = useOperatorStore();

  const [searchQuery, setSearchQuery] = useState("");

  const totalPassengers = passengers.length;
  const boardedCount = passengers.filter((p) => p.boarded).length;
  const boardingPercent = Math.round((boardedCount / totalPassengers) * 100);

  const filteredPassengers = passengers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manifiesto de Pasajeros</Text>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <Ionicons name="filter-outline" size={20} color="#1F3CCF" />
          </TouchableOpacity>
        </View>

        {/* Current Trip Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripRoute}>
              <View style={styles.routeDotOrigin} />
              <Text style={styles.tripRouteText}>
                {routeOrigin} → {routeDestination}
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
              <Text style={styles.tripStatText}>{nextDeparture}</Text>
            </View>
            <View style={styles.tripStat}>
              <Ionicons name="bus-outline" size={16} color="#6B7280" />
              <Text style={styles.tripStatText}>
                {selectedVehicle?.interno}
              </Text>
            </View>
            <View style={styles.tripStat}>
              <Ionicons name="people-outline" size={16} color="#6B7280" />
              <Text style={styles.tripStatText}>
                {boardedCount}/{totalPassengers}
              </Text>
            </View>
          </View>

          {/* Boarding Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso de Abordaje</Text>
              <Text style={styles.progressPercent}>{boardingPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${boardingPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre o asiento..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        {/* Passengers List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Pasajeros ({filteredPassengers.length})
          </Text>
        </View>

        {filteredPassengers.map((passenger) => (
          <View key={passenger.id} style={styles.passengerCard}>
            <View style={styles.passengerLeft}>
              <View
                style={[
                  styles.seatBadge,
                  passenger.boarded
                    ? styles.seatBadgeBoarded
                    : styles.seatBadgePending,
                ]}
              >
                <Text
                  style={[
                    styles.seatText,
                    passenger.boarded
                      ? styles.seatTextBoarded
                      : styles.seatTextPending,
                  ]}
                >
                  {passenger.seat}
                </Text>
              </View>

              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
                <Text style={styles.passengerTicket}>
                  #{passenger.ticketNumber} · {passenger.type}
                </Text>
              </View>
            </View>

            {passenger.boarded ? (
              <View style={styles.boardedIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color="#22C55E"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.boardButton}
                onPress={() => boardPassenger(passenger.id)}
                activeOpacity={0.9}
              >
                <Text style={styles.boardButtonText}>ABORDAR</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F0FE",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  tripRoute: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeDotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1F3CCF",
  },
  tripRouteText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#166534",
  },
  tripStatsRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 16,
  },
  tripStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tripStatText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F3CCF",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#1F3CCF",
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#111827",
  },
  listHeader: {
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  passengerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  seatBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  seatBadgeBoarded: {
    backgroundColor: "#EEF1FF",
  },
  seatBadgePending: {
    backgroundColor: "#FEF3C7",
  },
  seatText: {
    fontSize: 16,
    fontWeight: "800",
  },
  seatTextBoarded: {
    color: "#1F3CCF",
  },
  seatTextPending: {
    color: "#F59E0B",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  passengerTicket: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  boardedIcon: {
    marginLeft: 8,
  },
  boardButton: {
    backgroundColor: "#F5A400",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },
  boardButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5A400",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F5A400",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
