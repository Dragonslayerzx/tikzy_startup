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

import { useOperatorStore } from "@/src/store/useOperatorStore";

export default function ManualSaleScreen() {
  const router = useRouter();

  const {
    currentTrip,
    seatMap,
    isLoadingSeatMap,
    isCreatingManualSale,
    error,
    loadSeatMap,
    clearError,
    createSale,
  } = useOperatorStore();

  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    loadSeatMap();
  }, [loadSeatMap]);

  useEffect(() => {
    if (error) {
      Alert.alert("Venta manual", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const availableSeats = useMemo(() => {
    return (seatMap?.seats ?? [])
      .filter((seat) => !seat.is_occupied)
      .sort((a, b) => {
        if (a.row_number !== b.row_number) {
          return a.row_number - b.row_number;
        }
        return a.seat_number.localeCompare(b.seat_number);
      });
  }, [seatMap]);

  const totalPrice = 350 * quantity;

  const decrementQuantity = () => {
    if (quantity > 1) {
      const next = quantity - 1;
      setQuantity(next);
      setSelectedSeats((prev) => prev.slice(0, next));
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats((prev) => {
      const exists = prev.includes(seatNumber);

      if (exists) {
        return prev.filter((seat) => seat !== seatNumber);
      }

      if (prev.length >= quantity) {
        return prev;
      }

      return [...prev, seatNumber];
    });
  };

  const handleConfirm = async () => {
    if (!name.trim()) {
      Alert.alert("Falta información", "Ingresa el nombre completo.");
      return;
    }

    if (selectedSeats.length !== quantity) {
      Alert.alert(
        "Asientos incompletos",
        `Debes seleccionar ${quantity} asiento(s).`
      );
      return;
    }

    try {
      await createSale({
        customer_name: name.trim(),
        customer_phone: dni.trim() || undefined,
        passenger_count: quantity,
        seat_numbers: selectedSeats,
        payment_method: "cash",
        notes: "Venta manual en operador",
      });

      Alert.alert("Venta registrada", "La venta se guardó correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      // handled by store
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.routeBadge}>
          <Text style={styles.routeBadgeLabel}>RUTA ACTUAL</Text>
          <Text style={styles.routeBadgeText}>
            {currentTrip
              ? `${currentTrip.origin_city} → ${currentTrip.destination_city}`
              : "Sin viaje activo"}
          </Text>
        </View>

        <Text style={styles.label}>Nombre Completo</Text>
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan Pérez Hernández"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.label}>DNI / ID (Opcional)</Text>
        <View style={styles.inputBox}>
          <Ionicons name="card-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="0801-1990-12345"
            placeholderTextColor="#94A3B8"
            value={dni}
            onChangeText={setDni}
          />
        </View>

        <Text style={styles.label}>Cantidad de Boletos</Text>
        <View style={styles.quantityCard}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity <= 1 && styles.quantityButtonDisabled,
            ]}
            onPress={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={24}
              color={quantity <= 1 ? "#D1D5DB" : "#1F3CCF"}
            />
          </TouchableOpacity>

          <View style={styles.quantityCenter}>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Text style={styles.quantityText}>
              {quantity === 1 ? "boleto" : "boletos"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={incrementQuantity}
          >
            <Ionicons name="add" size={24} color="#1F3CCF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Asiento</Text>

        {isLoadingSeatMap ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#1F3CCF" />
            <Text style={styles.loadingText}>Cargando asientos...</Text>
          </View>
        ) : (
          <>
            <View style={styles.seatsRow}>
              {availableSeats.slice(0, 8).map((seat) => {
                const isSelected = selectedSeats.includes(seat.seat_number);
                const limitReached =
                  !isSelected && selectedSeats.length >= quantity;

                return (
                  <TouchableOpacity
                    key={seat.seat_id}
                    style={[
                      styles.seatButton,
                      isSelected && styles.seatButtonSelected,
                      limitReached && styles.seatButtonDisabled,
                    ]}
                    onPress={() => toggleSeat(seat.seat_number)}
                    disabled={limitReached}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.seatButtonText,
                        isSelected && styles.seatButtonTextSelected,
                      ]}
                    >
                      {seat.seat_number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.selectedInfo}>
              Seleccionados: {selectedSeats.length}/{quantity}
              {selectedSeats.length ? ` · ${selectedSeats.join(", ")}` : ""}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={styles.mapLink}
          onPress={() => router.push("/(operator)/seat-map")}
          activeOpacity={0.8}
        >
          <Ionicons name="grid-outline" size={18} color="#1F3CCF" />
          <Text style={styles.mapLinkText}>Ver mapa completo</Text>
        </TouchableOpacity>

        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabel}>Total a cobrar</Text>
            <View style={styles.cashBadge}>
              <Text style={styles.cashBadgeText}>EFECTIVO</Text>
            </View>
          </View>

          <Text style={styles.totalPrice}>
            L. {totalPrice.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!name.trim() ||
              selectedSeats.length !== quantity ||
              isCreatingManualSale) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={
            !name.trim() ||
            selectedSeats.length !== quantity ||
            isCreatingManualSale
          }
          activeOpacity={0.9}
        >
          {isCreatingManualSale ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Confirmar Venta</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar operación</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F0FE" },
  scrollContent: { padding: 20, paddingBottom: 32 },
  routeBadge: {
    backgroundColor: "#1F3CCF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  routeBadgeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
  routeBadgeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    marginTop: 8,
  },
  inputBox: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  quantityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quantityButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  quantityCenter: {
    alignItems: "center",
  },
  quantityValue: {
    fontSize: 42,
    fontWeight: "900",
    color: "#111827",
  },
  quantityText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "700",
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
  },
  seatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 10,
  },
  seatButton: {
    width: 92,
    height: 74,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  seatButtonSelected: {
    backgroundColor: "#1F3CCF",
  },
  seatButtonDisabled: {
    opacity: 0.45,
  },
  seatButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  seatButtonTextSelected: {
    color: "#FFFFFF",
  },
  selectedInfo: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 10,
  },
  mapLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 22,
  },
  mapLinkText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F3CCF",
  },
  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  totalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  cashBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cashBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#92400E",
  },
  totalPrice: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1F3CCF",
    marginTop: 14,
  },
  confirmButton: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#1F3CCF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 14,
  },
  confirmButtonDisabled: {
    opacity: 0.55,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  cancelButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
  },
});