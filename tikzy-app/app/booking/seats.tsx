import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const seatRows = [
  ["1A", "1B", null, "1C", "1D"],
  ["2A", "2B", null, "2C", "2D"],
  ["3A", "3B", null, "3C", "3D"],
  ["4A", "4B", null, "4C", "4D"],
  ["5A", "5B", null, "5C", "5D"],
  ["6A", "6B", null, "6C", "6D"],
];

const occupiedSeats = new Set(["1A", "1B", "2D", "3C", "3D", "5A"]);

export default function SeatsScreen() {
  const [selectedSeat, setSelectedSeat] = useState<string>("2C");

  const tripData = {
    from: "Tegucigalpa",
    to: "San Pedro Sula",
    operator: "Transportes Cristina",
    date: "15 Oct 2026",
    departureTime: "1:00 PM",
    arrivalTime: "5:00 PM",
    terminal: "Terminal Centro",
    boardingPoint: "Bus #42",
    total: 235,
  };

  const handleSeatPress = (seat: string) => {
    if (occupiedSeats.has(seat)) return;
    setSelectedSeat(seat);
  };

  const handleContinue = () => {
    if (!selectedSeat) {
      Alert.alert("Selecciona un asiento", "Debes elegir un asiento para continuar.");
      return;
    }

    router.push({
      pathname: "/booking/payment",
      params: {
        from: tripData.from,
        to: tripData.to,
        operator: tripData.operator,
        date: tripData.date,
        departureTime: tripData.departureTime,
        arrivalTime: tripData.arrivalTime,
        terminal: tripData.terminal,
        boardingPoint: tripData.boardingPoint,
        total: String(tripData.total),
        seat: selectedSeat,
      },
    });
  };
  
  return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Selección de Asiento</Text>
            <Text style={styles.headerSubtitle}>
              {tripData.from.toUpperCase()} → {tripData.to.toUpperCase()}
            </Text>
            <Text style={styles.headerMeta}>
              {tripData.date} · {tripData.departureTime} · {tripData.boardingPoint}
            </Text>
          </View>

          <View style={styles.iconButton} />
        </View>

        <View style={styles.legendCard}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendFree]} />
            <Text style={styles.legendText}>Libre</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendOccupied]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]} />
            <Text style={styles.legendText}>Elegido</Text>
          </View>
        </View>

        <View style={styles.busCard}>
          <View style={styles.busTopIndicator} />
          <Text style={styles.busFrontText}>FRENTE DEL BUS</Text>

          <View style={styles.driverRow}>
            <View style={styles.driverBox}>
              <Ionicons name="person-outline" size={18} color={colors.muted} />
              <Text style={styles.driverText}>CONDUCTOR</Text>
            </View>

            <View style={styles.doorBox}>
              <Ionicons name="exit-outline" size={18} color={colors.muted} />
            </View>
          </View>

          <View style={styles.rowsWrapper}>
            {seatRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.seatRow}>
                {row.map((seat, seatIndex) => {
                  if (!seat) {
                    return (
                      <View key={`aisle-${rowIndex}-${seatIndex}`} style={styles.aisle}>
                        <Text style={styles.rowNumber}>{rowIndex + 1}</Text>
                      </View>
                    );
                  }

                  const isOccupied = occupiedSeats.has(seat);
                  const isSelected = seat === selectedSeat;

                  return (
                    <TouchableOpacity
                      key={seat}
                      style={[
                        styles.seat,
                        isOccupied && styles.seatOccupied,
                        isSelected && styles.seatSelected,
                      ]}
                      activeOpacity={0.85}
                      disabled={isOccupied}
                      onPress={() => handleSeatPress(seat)}
                    >
                      <Text
                        style={[
                          styles.seatText,
                          isOccupied && styles.seatTextOccupied,
                          isSelected && styles.seatTextSelected,
                        ]}
                      >
                        {seat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.busBottomIndicator} />
        </View>

        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.noteText}>
            Ticket electrónico válido para esta salida específica. No se aceptan
            cambios 1h antes.
          </Text>
        </View>

        <View style={styles.footerCard}>
          <View style={styles.footerTop}>
            <View>
              <Text style={styles.footerLabel}>VIAJE SELECCIONADO</Text>
              <View style={styles.routeRow}>
                <View style={styles.selectedSeatBadge}>
                  <Text style={styles.selectedSeatBadgeText}>{selectedSeat}</Text>
                </View>
                <Text style={styles.footerRoute}>
                  {tripData.from} → {tripData.to}
                </Text>
              </View>
            </View>

            <View style={styles.totalBlock}>
              <Text style={styles.footerLabel}>TOTAL</Text>
              <Text style={styles.totalText}>L. {tripData.total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const seatBase = {
  width: 54,
  height: 54,
  borderRadius: 12,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  borderWidth: 1,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    lineHeight: 28,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  headerMeta: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendItem: {
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
  },
  legendFree: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BFD0E6",
  },
  legendOccupied: {
    backgroundColor: "#E2E8F0",
    borderColor: "#E2E8F0",
  },
  legendSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  legendText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  busCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  busTopIndicator: {
    width: 90,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9E1ED",
    alignSelf: "center",
    marginBottom: 10,
  },
  busFrontText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 16,
  },
  driverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  driverBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  driverText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },
  doorBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  rowsWrapper: {
    gap: 12,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  seat: {
    ...seatBase,
    backgroundColor: "#FFFFFF",
    borderColor: "#BFD0E6",
  },
  seatOccupied: {
    backgroundColor: "#E2E8F0",
    borderColor: "#E2E8F0",
  },
  seatSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  seatText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  seatTextOccupied: {
    color: "#94A3B8",
  },
  seatTextSelected: {
    color: "#FFFFFF",
  },
  aisle: {
    width: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  rowNumber: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "700",
  },
  busBottomIndicator: {
    width: 110,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9E1ED",
    alignSelf: "center",
    marginTop: 18,
  },
  noteCard: {
    marginTop: 16,
    backgroundColor: "#EAF3FF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#D7E7FF",
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  footerCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
  },
  routeRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "72%",
  },
  selectedSeatBadge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedSeatBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  footerRoute: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    flexShrink: 1,
    lineHeight: 20,
  },
  totalBlock: {
    alignItems: "flex-end",
  },
  totalText: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});