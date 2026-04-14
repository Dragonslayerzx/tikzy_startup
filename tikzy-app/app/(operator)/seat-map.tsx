import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type SeatStatus = "free" | "occupied";

const generateSeats = (): { label: string; status: SeatStatus }[] => {
  const seats: { label: string; status: SeatStatus }[] = [];
  const occupiedSeats = ["01A", "01B", "01C", "01D", "02A", "02B", "02C", "02D", "03C", "03D", "04A", "04B", "05A", "05B", "05D", "06B", "06C", "07A", "07B", "08A", "08C", "09A", "09D", "10A", "10B", "11C", "11D"];

  for (let row = 1; row <= 15; row++) {
    const cols = ["A", "B", "C", "D"];
    cols.forEach((col) => {
      const label = `${String(row).padStart(2, "0")}${col}`;
      let status: SeatStatus = "free";
      if (occupiedSeats.includes(label)) status = "occupied";
      seats.push({ label, status });
    });
  }
  return seats;
};

export default function SeatMapScreen() {
  const router = useRouter();
  const [seats, setSeats] = useState(generateSeats);
  const [selected, setSelected] = useState<string | null>(null);

  const occupiedCount = seats.filter(
    (s) => s.status === "occupied"
  ).length;

  const handleSeatPress = (label: string, status: SeatStatus) => {
    if (status === "occupied") return;
    if (selected === label) {
      setSelected(null);
    } else {
      setSelected(label);
    }
  };

  const handleConfirmSeat = () => {
    router.push({
      pathname: "/(operator)/manual-sale",
      params: { seat: selected },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TGU → SPS</Text>
          <Text style={styles.headerSubtitle}>
            {occupiedCount}/60 ocupados
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

        {/* Rows */}
        {Array.from({ length: 15 }, (_, rowIndex) => {
          const rowNum = rowIndex + 1;
          const rowSeats = seats.filter((s) =>
            s.label.startsWith(String(rowNum).padStart(2, "0"))
          );
          return (
            <View key={rowNum} style={styles.row}>
              <Text style={styles.rowLabel}>
                {String(rowNum).padStart(2, "0")}
              </Text>
              {rowSeats.slice(0, 2).map((seat) => (
                <TouchableOpacity
                  key={seat.label}
                  style={[
                    styles.seat,
                    seat.status === "free" && styles.seatFree,
                    seat.status === "occupied" && styles.seatOccupied,
                    selected === seat.label && styles.seatSelected,
                  ]}
                  onPress={() => handleSeatPress(seat.label, seat.status)}
                  activeOpacity={0.8}
                  disabled={seat.status === "occupied"}
                >
                  <Text
                    style={[
                      styles.seatText,
                      seat.status === "occupied" && styles.seatTextOccupied,
                      selected === seat.label && styles.seatTextHighlight,
                    ]}
                  >
                    {seat.label.slice(-2)}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* Aisle */}
              <View style={styles.aisle} />
              {rowSeats.slice(2, 4).map((seat) => (
                <TouchableOpacity
                  key={seat.label}
                  style={[
                    styles.seat,
                    seat.status === "free" && styles.seatFree,
                    seat.status === "occupied" && styles.seatOccupied,
                    selected === seat.label && styles.seatSelected,
                  ]}
                  onPress={() => handleSeatPress(seat.label, seat.status)}
                  activeOpacity={0.8}
                  disabled={seat.status === "occupied"}
                >
                  <Text
                    style={[
                      styles.seatText,
                      seat.status === "occupied" && styles.seatTextOccupied,
                      selected === seat.label && styles.seatTextHighlight,
                    ]}
                  >
                    {seat.label.slice(-2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Panel */}
      {selected && (
        <View style={styles.bottomPanel}>
          <View style={styles.bottomInfo}>
            <View style={styles.bottomInfoRow}>
              <Text style={styles.bottomLabel}>Asiento</Text>
              <Text style={styles.bottomValue}>{selected}</Text>
            </View>
            <View style={styles.bottomInfoRow}>
              <Text style={styles.bottomLabel}>Tarifa</Text>
              <Text style={styles.bottomValue}>L. 350.00</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSeat}
            activeOpacity={0.9}
          >
            <Text style={styles.confirmButtonText}>Confirmar Asiento</Text>
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
