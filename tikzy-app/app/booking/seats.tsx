import React, { useEffect } from "react";
import { router } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookingStore } from "@/src/store/useBookingStore";

const occupiedSeats = new Set([
  "A2",
  "A4",
  "B1",
  "B3",
  "C2",
  "C4",
  "D1",
]);

const seatRows = [
  ["A1", "A2", "A3", "A4"],
  ["B1", "B2", "B3", "B4"],
  ["C1", "C2", "C3", "C4"],
  ["D1", "D2", "D3", "D4"],
  ["E1", "E2", "E3", "E4"],
];

export default function SeatsScreen() {
  const selectedRoute = useBookingStore((state) => state.selectedRoute);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const passengers = useBookingStore((state) => state.passengers);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);

  useEffect(() => {
    if (!selectedRoute) {
      router.replace("/booking/results");
    }
  }, [selectedRoute]);

  if (!selectedRoute) {
    return null;
  }

  const handleSeatPress = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;
    toggleSeat(seatId);
  };

  const handleContinue = () => {
    if (selectedSeats.length !== passengers) {
      Alert.alert(
        "Selecciona tus asientos",
        `Debes elegir ${passengers} asiento${
          passengers > 1 ? "s" : ""
        } para continuar.`
      );
      return;
    }

    router.push("/booking/payment");
  };

  const renderSeat = (seatId: string) => {
    const isOccupied = occupiedSeats.has(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <TouchableOpacity
        key={seatId}
        style={[
          styles.seat,
          isOccupied && styles.occupiedSeat,
          isSelected && styles.selectedSeat,
        ]}
        onPress={() => handleSeatPress(seatId)}
        activeOpacity={0.85}
        disabled={isOccupied}
      >
        <Ionicons
          name="car-outline"
          size={16}
          color={
            isOccupied ? "#98A2B3" : isSelected ? "#FFFFFF" : "#2F49E3"
          }
        />
        <Text
          style={[
            styles.seatText,
            isOccupied && styles.occupiedSeatText,
            isSelected && styles.selectedSeatText,
          ]}
        >
          {seatId}
        </Text>
      </TouchableOpacity>
    );
  };

  const remainingSeats = passengers - selectedSeats.length;
  const canContinue = selectedSeats.length === passengers;

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
              {selectedRoute.origin} → {selectedRoute.destination}
            </Text>
          </View>

          <View style={styles.iconButtonPlaceholder} />
        </View>

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
                <Text style={styles.companyName}>{selectedRoute.company}</Text>
                <Text style={styles.busType}>{selectedRoute.busType}</Text>
              </View>
            </View>

            <View style={styles.tripMetaRow}>
              <View style={styles.tripMetaItem}>
                <Text style={styles.metaLabel}>Salida</Text>
                <Text style={styles.metaValue}>{selectedRoute.departureTime}</Text>
              </View>

              <View style={styles.tripMetaItem}>
                <Text style={styles.metaLabel}>Llegada</Text>
                <Text style={styles.metaValue}>{selectedRoute.arrivalTime}</Text>
              </View>

              <View style={styles.tripMetaItem}>
                <Text style={styles.metaLabel}>Duración</Text>
                <Text style={styles.metaValue}>{selectedRoute.duration}</Text>
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
            <Text style={styles.selectionText}>
              Pasajeros: {passengers}
            </Text>
            <Text style={styles.selectionText}>
              Asientos elegidos:{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguno"}
            </Text>
            <Text style={styles.selectionHint}>
              {remainingSeats > 0
                ? `Te falta seleccionar ${remainingSeats} asiento${
                    remainingSeats > 1 ? "s" : ""
                  }.`
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
              {seatRows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.seatRow}>
                  <View style={styles.leftSeats}>
                    {renderSeat(row[0])}
                    {renderSeat(row[1])}
                  </View>

                  <View style={styles.aisle} />

                  <View style={styles.rightSeats}>
                    {renderSeat(row[2])}
                    {renderSeat(row[3])}
                  </View>
                </View>
              ))}
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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  driverRow: {
    alignItems: "flex-end",
    marginBottom: 18,
  },
  driverBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6FF",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  driverText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#2F49E3",
    fontWeight: "700",
  },
  busBody: {
    gap: 14,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftSeats: {
    flexDirection: "row",
    gap: 10,
  },
  aisle: {
    width: 26,
  },
  rightSeats: {
    flexDirection: "row",
    gap: 10,
  },
  seat: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    borderWidth: 1.5,
    borderColor: "#C7D7FE",
    alignItems: "center",
    justifyContent: "center",
  },
  occupiedSeat: {
    backgroundColor: "#F2F4F7",
    borderColor: "#E4E7EC",
  },
  selectedSeat: {
    backgroundColor: "#2F49E3",
    borderColor: "#2F49E3",
  },
  seatText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#2F49E3",
  },
  occupiedSeatText: {
    color: "#98A2B3",
  },
  selectedSeatText: {
    color: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  bottomLabel: {
    fontSize: 12,
    color: "#98A2B3",
    fontWeight: "700",
    marginBottom: 4,
  },
  bottomValue: {
    fontSize: 15,
    color: "#101828",
    fontWeight: "800",
    maxWidth: 160,
  },
  continueButton: {
    minWidth: 150,
    backgroundColor: "#2F49E3",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    opacity: 0.65,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});