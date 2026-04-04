import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { apiFetch } from "@/src/services/api";
import type { SeatMapItem } from "@/src/types/tikzy";

export default function SeatMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const maxSeats = params.quantity ? parseInt(params.quantity as string, 10) : 1;
  const tripId = params.tripId ? Number(params.tripId) : 1; // Default to 1 if no trip specified
  
  const [seatMap, setSeatMap] = useState<SeatMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const loadSeatMap = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<SeatMapItem[]>(
          `/vehicle-seats/scheduled-trip/${tripId}/map`
        );
        setSeatMap(data);
      } catch (error) {
        console.error("Error loading seat map:", error);
        Alert.alert("Error", "No se pudo cargar el mapa de asientos.");
      } finally {
        setLoading(false);
      }
    };

    loadSeatMap();
  }, [tripId]);

  const groupedRows = useMemo(() => {
    const rows = new Map<number, SeatMapItem[]>();

    seatMap.forEach((seat) => {
      const currentRow = rows.get(seat.row_number) || [];
      currentRow.push(seat);
      currentRow.sort((a, b) => a.column_label.localeCompare(b.column_label));
      rows.set(seat.row_number, currentRow);
    });

    return Array.from(rows.entries()).sort((a, b) => a[0] - b[0]);
  }, [seatMap]);

  const occupiedCount = seatMap.filter((s) => s.is_occupied).length;
  const totalCount = seatMap.filter((s) => s.is_active).length;

  const handleSeatPress = (seat: SeatMapItem) => {
    if (seat.is_occupied || !seat.is_active) return;
    const label = seat.seat_number;
    if (selectedSeats.includes(label)) {
      setSelectedSeats(selectedSeats.filter(s => s !== label));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, label]);
    }
  };

  const handleConfirmSeat = () => {
    router.push({
      pathname: "/(operator)/manual-sale",
      params: { seats: selectedSeats.join(",") },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleConfirmSeat}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TGU → SPS</Text>
          <Text style={styles.headerSubtitle}>
            {occupiedCount}/{totalCount || 60} ocupados
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D1D5DB" }]} />
          <Text style={styles.legendText}>Libre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#CBD5E1" }]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F5A400" }]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
      </View>

      {/* Seat Grid */}
      <ScrollView
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bus front indicator */}
        <View style={styles.busFront}>
          <Ionicons name="bus" size={20} color="#94A3B8" />
          <Text style={styles.busFrontText}>Frente del bus</Text>
        </View>

        {/* Column headers */}
        <View style={styles.columnHeaders}>
          <Text style={styles.colHeader}>A</Text>
          <Text style={styles.colHeader}>B</Text>
          <View style={{ width: 28 }} />
          <Text style={styles.colHeader}>C</Text>
          <Text style={styles.colHeader}>D</Text>
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#1F3CCF" />
            <Text style={{ marginTop: 12, color: "#6B7280" }}>Cargando asientos...</Text>
          </View>
        ) : (
          <>
            {/* Rows */}
            {groupedRows.map(([rowNumber, rowSeats]) => {
              const leftSeats = rowSeats.filter((seat) =>
                ["A", "B"].includes(seat.column_label.toUpperCase())
              );
              const rightSeats = rowSeats.filter((seat) =>
                !["A", "B"].includes(seat.column_label.toUpperCase())
              );

              return (
                <View key={`row-${rowNumber}`} style={styles.row}>
                  <Text style={styles.rowLabel}>
                    {String(rowNumber).padStart(2, "0")}
                  </Text>
                  
                  {leftSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seat_number);
                    const isDisabled = seat.is_occupied || !seat.is_active;

                    return (
                      <TouchableOpacity
                        key={seat.vehicle_seat_id}
                        style={[
                          styles.seat,
                          !isDisabled && !isSelected && styles.seatFree,
                          isDisabled && styles.seatOccupied,
                          isSelected && styles.seatSelected,
                        ]}
                        onPress={() => handleSeatPress(seat)}
                        activeOpacity={0.8}
                        disabled={isDisabled}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isDisabled && styles.seatTextOccupied,
                            isSelected && styles.seatTextHighlight,
                          ]}
                        >
                          {seat.seat_number.slice(-2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  
                  {/* Aisle */}
                  <View style={styles.aisle} />
                  
                  {rightSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seat_number);
                    const isDisabled = seat.is_occupied || !seat.is_active;

                    return (
                      <TouchableOpacity
                        key={seat.vehicle_seat_id}
                        style={[
                          styles.seat,
                          !isDisabled && !isSelected && styles.seatFree,
                          isDisabled && styles.seatOccupied,
                          isSelected && styles.seatSelected,
                        ]}
                        onPress={() => handleSeatPress(seat)}
                        activeOpacity={0.8}
                        disabled={isDisabled}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isDisabled && styles.seatTextOccupied,
                            isSelected && styles.seatTextHighlight,
                          ]}
                        >
                          {seat.seat_number.slice(-2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Bottom Panel */}
      {selectedSeats.length > 0 && (
        <View style={styles.bottomPanel}>
          <View style={styles.bottomInfo}>
            <View style={styles.bottomInfoRow}>
              <Text style={styles.bottomLabel}>Asientos ({selectedSeats.length}/{maxSeats})</Text>
              <Text style={styles.bottomValue}>{selectedSeats.join(", ")}</Text>
            </View>
            <View style={styles.bottomInfoRow}>
              <Text style={styles.bottomLabel}>Tarifa</Text>
              <Text style={styles.bottomValue}>L. {(350 * selectedSeats.length).toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSeat}
            activeOpacity={0.9}
          >
            <Text style={styles.confirmButtonText}>Confirmar Asiento{selectedSeats.length > 1 ? "s" : ""}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F0FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
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
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  gridContent: {
    paddingHorizontal: 40,
    paddingBottom: 120,
    alignItems: "center",
  },
  busFront: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  busFrontText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },
  columnHeaders: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
    width: "100%",
    paddingLeft: 30,
  },
  colHeader: {
    width: 56,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  rowLabel: {
    width: 22,
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
  },
  seat: {
    width: 56,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  seatFree: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  seatOccupied: {
    backgroundColor: "#CBD5E1",
  },
  seatSelected: {
    backgroundColor: "#F5A400",
    borderWidth: 0,
  },
  seatText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  seatTextOccupied: {
    color: "#64748B",
  },
  seatTextHighlight: {
    color: "#FFFFFF",
  },
  aisle: {
    width: 28,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bottomInfoRow: {},
  bottomLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 4,
  },
  bottomValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  confirmButton: {
    backgroundColor: "#1F3CCF",
    borderRadius: 20,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});
