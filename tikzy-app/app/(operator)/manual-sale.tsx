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
import { useLocalSearchParams, useRouter } from "expo-router";

const QUICK_SEATS = ["12A", "12B", "13A", "13B"];

export default function ManualSaleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  // Initialize quantity and selected seats from params if they exist (when coming back from map)
  const initialSeats = params.seats ? (params.seats as string).split(",") : [];
  const [quantity, setQuantity] = useState(
    params.quantity ? parseInt(params.quantity as string, 10) : 1
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>(initialSeats);

  const PRICE_PER_TICKET = 350;
  const totalPrice = PRICE_PER_TICKET * quantity;

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleConfirm = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Venta Manual</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Route Badge */}
        <View style={styles.routeBadge}>
          <Text style={styles.routeBadgeLabel}>RUTA ACTUAL</Text>
          <Text style={styles.routeBadgeText}>TGU → SPS</Text>
        </View>

        {/* Name Input */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Nombre Completo</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#94A3B8" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. Juan Pérez Hernández"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
        </View>

        {/* DNI Input */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>DNI / ID (Opcional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#94A3B8" />
            <TextInput
              value={dni}
              onChangeText={setDni}
              placeholder="0801-1990-12345"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Ticket Quantity */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Cantidad de Boletos</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={decrementQuantity}
              activeOpacity={0.8}
              disabled={quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={22}
                color={quantity <= 1 ? "#D1D5DB" : "#1F3CCF"}
              />
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Text style={styles.quantityLabel}>
                {quantity === 1 ? "boleto" : "boletos"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity >= 10 && styles.quantityButtonDisabled,
              ]}
              onPress={incrementQuantity}
              activeOpacity={0.8}
              disabled={quantity >= 10}
            >
              <Ionicons
                name="add"
                size={22}
                color={quantity >= 10 ? "#D1D5DB" : "#1F3CCF"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seat Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Asiento</Text>
          <View style={styles.seatsGrid}>
            {QUICK_SEATS.map((seat) => {
              const isSelected = selectedSeats.includes(seat);
              return (
                <TouchableOpacity
                  key={seat}
                  style={[
                    styles.seatButton,
                    isSelected && styles.seatButtonSelected,
                  ]}
                  onPress={() => {
                    if (selectedSeats.includes(seat)) {
                      setSelectedSeats(selectedSeats.filter(s => s !== seat));
                    } else if (selectedSeats.length < quantity) {
                      setSelectedSeats([...selectedSeats, seat]);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.seatButtonText,
                      isSelected && styles.seatButtonTextSelected,
                    ]}
                  >
                    {seat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.viewMapLink}
            onPress={() => router.push({ pathname: "/(operator)/seat-map", params: { quantity } })}
            activeOpacity={0.8}
          >
            <Ionicons name="grid-outline" size={18} color="#1F3CCF" />
            <Text style={styles.viewMapText}>Ver mapa completo</Text>
          </TouchableOpacity>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabel}>Total a cobrar</Text>
            <View style={styles.cashBadge}>
              <Text style={styles.cashBadgeText}>EFECTIVO</Text>
            </View>
          </View>

          <Text style={styles.totalPrice}>
            L. {totalPrice.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </Text>

          <View style={styles.totalMeta}>
            <View style={styles.totalMetaItem}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.totalMetaText}>Salida: 08:15 AM</Text>
            </View>
            <View style={styles.totalMetaItem}>
              <Ionicons name="ticket-outline" size={16} color="#6B7280" />
              <Text style={styles.totalMetaText}>
                Ticket: {selectedSeats.length > 0 ? selectedSeats.map(s => `#MAN-${s}`).join(", ") : "---"}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!name || selectedSeats.length === 0) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.9}
          disabled={!name || selectedSeats.length === 0}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirmar Venta</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F0FE",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  routeBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F3CCF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  routeBadgeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
  },
  routeBadgeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#111827",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#F1F5F9",
  },
  quantityDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  quantityValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
  },
  seatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  seatButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  seatButtonSelected: {
    backgroundColor: "#1F3CCF",
    borderColor: "#1F3CCF",
  },
  seatButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  seatButtonTextSelected: {
    color: "#FFFFFF",
  },
  viewMapLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  viewMapText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F3CCF",
  },
  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  totalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  cashBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cashBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D97706",
    letterSpacing: 0.5,
  },
  totalPrice: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1F3CCF",
    marginBottom: 12,
  },
  totalMeta: {
    gap: 8,
  },
  totalMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalMetaText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#F5A400",
    borderRadius: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
    shadowColor: "#F5A400",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  cancelButton: {
    borderRadius: 20,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
