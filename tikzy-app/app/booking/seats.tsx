import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

import { apiFetch } from "@/src/services/api";
import { useBookingStore } from "@/src/store/useBookingStore";
import type { SeatMapItem } from "@/src/types/tikzy";

export default function SeatsScreen() {
  const selectedTrip = useBookingStore((state) => state.selectedTrip);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const passengers = useBookingStore((state) => state.passengers);
  const setSelectedSeats = useBookingStore((state) => state.setSelectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);

  const [seatMap, setSeatMap] = useState<SeatMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTrip) {
      router.replace("/booking/results");
      return;
    }

    const loadSeatMap = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<SeatMapItem[]>(
          `/vehicle-seats/scheduled-trip/${selectedTrip.id}/map`
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
  }, [selectedTrip]);

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

  const handleSeatPress = (seat: SeatMapItem) => {
    if (seat.is_occupied || !seat.is_active) return;
    toggleSeat(seat.seat_number);
  };

  const handleContinue = () => {
    if (selectedSeats.length !== passengers) {
      Alert.alert(
        "Selecciona tus asientos",
        `Debes elegir ${passengers} asiento${passengers > 1 ? "s" : ""} para continuar.`
      );
      return;
    }

    router.push("/booking/payment");
  };

  const remainingSeats = passengers - selectedSeats.length;
  const canContinue = selectedSeats.length === passengers;

  if (!selectedTrip) {
    return null;
  }

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
            <Text style={styles.headerTitle}>Selecciona tus asientos</Text>
            <Text style={styles.headerSubtitle}>
              {selectedTrip.origin_city} → {selectedTrip.destination_city}
            </Text>
          </View>

          <View style={styles.iconButtonPlaceholder} />
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2F49E3" />
            <Text style={styles.centerText}>Cargando mapa de asientos...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.tripCard}>
                <View style={styles.tripTop}>
                  <View style={styles.companyBadge}>
                    <Ionicons name="bus-outline" size={18} color="#FFFFFF" />
                  </View>

                  <View style={styles.tripInfo}>
                    <Text style={styles.companyName}>{selectedTrip.company_name}</Text>
                    <Text style={styles.busType}>{selectedTrip.vehicle_label}</Text>
                  </View>
                </View>

                <View style={styles.tripMetaRow}>
                  <View style={styles.tripMetaItem}>
                    <Text style={styles.metaLabel}>Salida</Text>
                    <Text style={styles.metaValue}>{selectedTrip.departure_time}</Text>
                  </View>

                  <View style={styles.tripMetaItem}>
                    <Text style={styles.metaLabel}>Llegada</Text>
                    <Text style={styles.metaValue}>{selectedTrip.arrival_time}</Text>
                  </View>

                  <View style={styles.tripMetaItem}>
                    <Text style={styles.metaLabel}>Precio</Text>
                    <Text style={styles.metaValue}>L. {Number(selectedTrip.price).toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.legendCard}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.availableDot]} />
                  <Text style={styles.legendText}>Libre</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.occupiedDot]} />
                  <Text style={styles.legendText}>Ocupado</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.selectedDot]} />
                  <Text style={styles.legendText}>Elegido</Text>
                </View>
              </View>

              <View style={styles.selectionCard}>
                <Text style={styles.selectionTitle}>Resumen de selección</Text>
                <Text style={styles.selectionText}>Pasajeros: {passengers}</Text>
                <Text style={styles.selectionText}>
                  Asientos elegidos:{" "}
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguno"}
                </Text>
                <Text style={styles.selectionHint}>
                  {remainingSeats > 0
                    ? `Te falta seleccionar ${remainingSeats} asiento${remainingSeats > 1 ? "s" : ""}.`
                    : "Ya puedes continuar al pago."}
                </Text>
              </View>

              <View style={styles.busCard}>
                <View style={styles.driverRow}>
                  <View style={styles.driverBox}>
                    <Ionicons name="person-outline" size={18} color="#2F49E3" />
                    <Text style={styles.driverText}>Conductor</Text>
                  </View>
                </View>

                <View style={styles.busBody}>
                  {groupedRows.map(([rowNumber, rowSeats]) => {
                    const leftSeats = rowSeats.filter((seat) =>
                      ["A", "B"].includes(seat.column_label.toUpperCase())
                    );
                    const rightSeats = rowSeats.filter((seat) =>
                      !["A", "B"].includes(seat.column_label.toUpperCase())
                    );

                    return (
                      <View key={`row-${rowNumber}`} style={styles.seatRow}>
                        <View style={styles.leftSeats}>
                          {leftSeats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.seat_number);
                            const isDisabled = seat.is_occupied || !seat.is_active;

                            return (
                              <TouchableOpacity
                                key={seat.vehicle_seat_id}
                                style={[
                                  styles.seat,
                                  isDisabled && styles.occupiedSeat,
                                  isSelected && styles.selectedSeat,
                                ]}
                                onPress={() => handleSeatPress(seat)}
                                activeOpacity={0.85}
                                disabled={isDisabled}
                              >
                                <Ionicons
                                  name="car-outline"
                                  size={16}
                                  color={
                                    isDisabled
                                      ? "#98A2B3"
                                      : isSelected
                                      ? "#FFFFFF"
                                      : "#2F49E3"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.seatText,
                                    isDisabled && styles.occupiedSeatText,
                                    isSelected && styles.selectedSeatText,
                                  ]}
                                >
                                  {seat.seat_number}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        <View style={styles.aisle} />

                        <View style={styles.rightSeats}>
                          {rightSeats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.seat_number);
                            const isDisabled = seat.is_occupied || !seat.is_active;

                            return (
                              <TouchableOpacity
                                key={seat.vehicle_seat_id}
                                style={[
                                  styles.seat,
                                  isDisabled && styles.occupiedSeat,
                                  isSelected && styles.selectedSeat,
                                ]}
                                onPress={() => handleSeatPress(seat)}
                                activeOpacity={0.85}
                                disabled={isDisabled}
                              >
                                <Ionicons
                                  name="car-outline"
                                  size={16}
                                  color={
                                    isDisabled
                                      ? "#98A2B3"
                                      : isSelected
                                      ? "#FFFFFF"
                                      : "#2F49E3"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.seatText,
                                    isDisabled && styles.occupiedSeatText,
                                    isSelected && styles.selectedSeatText,
                                  ]}
                                >
                                  {seat.seat_number}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={styles.bottomBar}>
              <View>
                <Text style={styles.bottomLabel}>Asientos</Text>
                <Text style={styles.bottomValue}>
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "--"}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !canContinue && styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                activeOpacity={0.9}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </>
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
    paddingBottom: 120,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginTop: 8,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tripTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  companyBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#2F49E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  busType: {
    fontSize: 13,
    color: "#667085",
    fontWeight: "600",
  },
  tripMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  tripMetaItem: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: "#98A2B3",
    marginBottom: 4,
    fontWeight: "700",
  },
  metaValue: {
    fontSize: 14,
    color: "#101828",
    fontWeight: "800",
  },
  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  availableDot: {
    backgroundColor: "#DDE7FF",
    borderWidth: 1,
    borderColor: "#2F49E3",
  },
  occupiedDot: {
    backgroundColor: "#E5E7EB",
  },
  selectedDot: {
    backgroundColor: "#2F49E3",
  },
  legendText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475467",
  },
  selectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  selectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 10,
  },
  selectionText: {
    fontSize: 14,
    color: "#344054",
    marginBottom: 4,
    fontWeight: "600",
  },
  selectionHint: {
    marginTop: 8,
    fontSize: 13,
    color: "#2F49E3",
    fontWeight: "700",
  },
  busCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  driverRow: {
    alignItems: "center",
    marginBottom: 18,
  },
  driverBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  driverText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2F49E3",
  },
  busBody: {
    gap: 12,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSeats: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  aisle: {
    width: 26,
  },
  rightSeats: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  seat: {
    minWidth: 62,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5E1FF",
  },
  occupiedSeat: {
    backgroundColor: "#ECEFF3",
    borderColor: "#ECEFF3",
  },
  selectedSeat: {
    backgroundColor: "#2F49E3",
    borderColor: "#2F49E3",
  },
  seatText: {
    marginTop: 4,
    color: "#2F49E3",
    fontSize: 12,
    fontWeight: "800",
  },
  occupiedSeatText: {
    color: "#98A2B3",
  },
  selectedSeatText: {
    color: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  bottomLabel: {
    fontSize: 12,
    color: "#98A2B3",
    fontWeight: "700",
  },
  bottomValue: {
    marginTop: 4,
    fontSize: 14,
    color: "#101828",
    fontWeight: "800",
  },
  continueButton: {
    backgroundColor: "#2F49E3",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  continueButtonDisabled: {
    backgroundColor: "#A5B4FC",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});