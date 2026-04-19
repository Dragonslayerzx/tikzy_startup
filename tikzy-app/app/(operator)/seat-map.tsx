import { useOperatorStore } from "@/src/store/useOperatorStore";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SeatMapScreen() {
  const {
    seatMap,
    isLoadingSeatMap,
    error,
    loadSeatMap,
    clearError,
  } = useOperatorStore();

  useEffect(() => {
    loadSeatMap();
  }, [loadSeatMap]);

  useEffect(() => {
    if (error) {
      Alert.alert("Mapa de asientos", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  if (isLoadingSeatMap && !seatMap) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1F3CCF" />
          <Text style={styles.centerText}>Cargando asientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!seatMap) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.centerTitle}>No hay mapa disponible</Text>
          <Text style={styles.centerText}>
            Inicia un viaje activo para ver la ocupación de asientos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedByRow = seatMap.seats.reduce<Record<number, typeof seatMap.seats>>(
    (acc, seat) => {
      if (!acc[seat.row_number]) acc[seat.row_number] = [];
      acc[seat.row_number].push(seat);
      return acc;
    },
    {}
  );

  const orderedRows = Object.keys(groupedByRow)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Mapa de Asientos</Text>
        <Text style={styles.headerSubtitle}>{seatMap.vehicle_label}</Text>

        <View style={styles.statsRow}>
          <StatCard label="Totales" value={String(seatMap.total_seats)} />
          <StatCard label="Ocupados" value={String(seatMap.occupied_seats)} />
          <StatCard label="Abordados" value={String(seatMap.boarded_seats)} />
          <StatCard label="Libres" value={String(seatMap.available_seats)} />
        </View>

        <View style={styles.legendCard}>
          <LegendDot label="Libre" style={styles.availableSeat} />
          <LegendDot label="Reservado" style={styles.occupiedSeat} />
          <LegendDot label="Abordado" style={styles.boardedSeat} />
        </View>

        <View style={styles.busCard}>
          <View style={styles.driverArea}>
            <Text style={styles.driverText}>Conductor</Text>
          </View>

          {orderedRows.map((rowNumber) => {
            const seats = groupedByRow[rowNumber].sort((a, b) =>
              a.seat_number.localeCompare(b.seat_number)
            );

            return (
              <View key={rowNumber} style={styles.rowContainer}>
                <Text style={styles.rowLabel}>Fila {rowNumber}</Text>

                <View style={styles.rowSeats}>
                  {seats.map((seat) => {
                    const seatStyle = seat.is_boarded
                      ? styles.boardedSeat
                      : seat.is_occupied
                      ? styles.occupiedSeat
                      : styles.availableSeat;

                    return (
                      <View key={seat.seat_id} style={[styles.seatBox, seatStyle]}>
                        <Text
                          style={[
                            styles.seatLabel,
                            (seat.is_occupied || seat.is_boarded) && styles.seatLabelWhite,
                          ]}
                        >
                          {seat.seat_number}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LegendDot({ label, style }: { label: string; style: object }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, style]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F0FE" },
  scrollContent: { padding: 20, paddingBottom: 32 },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  centerTitle: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 8 },
  centerText: { fontSize: 16, color: "#6B7280", textAlign: "center" },

  headerTitle: { fontSize: 28, fontWeight: "900", color: "#111827" },
  headerSubtitle: { fontSize: 15, color: "#6B7280", marginTop: 4, marginBottom: 18 },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: "22%",
    alignItems: "center",
    flexGrow: 1,
  },
  statValue: { fontSize: 20, fontWeight: "900", color: "#1F3CCF" },
  statLabel: { fontSize: 12, fontWeight: "700", color: "#6B7280", marginTop: 4 },

  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendSwatch: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: { fontSize: 13, fontWeight: "700", color: "#374151" },

  busCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  driverArea: {
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 18,
  },
  driverText: { fontSize: 14, fontWeight: "800", color: "#374151" },

  rowContainer: {
    marginBottom: 14,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },
  rowSeats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  seatBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  seatLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
  seatLabelWhite: {
    color: "#FFFFFF",
  },

  availableSeat: {
    backgroundColor: "#E5E7EB",
  },
  occupiedSeat: {
    backgroundColor: "#F59E0B",
  },
  boardedSeat: {
    backgroundColor: "#22C55E",
  },
});