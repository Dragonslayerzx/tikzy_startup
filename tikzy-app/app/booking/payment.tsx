import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { addTrip } from "@/constants/tripsStorage";
import { apiFetch } from "@/src/services/api";
import { PaymentMethod, useBookingStore } from "@/src/store/useBookingStore";
import type { BookingResponse } from "@/src/types/tikzy";

export default function PaymentScreen() {
  const origin = useBookingStore((state) => state.origin);
  const destination = useBookingStore((state) => state.destination);
  const date = useBookingStore((state) => state.date);
  const selectedTrip = useBookingStore((state) => state.selectedTrip);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const paymentMethod = useBookingStore((state) => state.paymentMethod);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  const confirmTrip = useBookingStore((state) => state.confirmTrip);

  const [customerName, setCustomerName] = useState("Eros Rivera");
  const [customerEmail, setCustomerEmail] = useState("eros@example.com");
  const [customerPhone, setCustomerPhone] = useState("99999999");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedTrip || selectedSeats.length === 0) {
      router.replace("/booking/seats");
    }
  }, [selectedTrip, selectedSeats]);

  const subtotal = useMemo(() => {
    if (!selectedTrip) return 0;
    return Number(selectedTrip.price) * selectedSeats.length;
  }, [selectedTrip, selectedSeats.length]);

  const serviceFee = useMemo(() => {
    return 10 * selectedSeats.length;
  }, [selectedSeats.length]);

  const total = subtotal + serviceFee;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isCardValid =
    cardName.trim().length > 2 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handlePayNow = async () => {
    if (isSubmitting) return;

    if (!selectedTrip) {
      Alert.alert("Error", "No se encontró el viaje seleccionado.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      Alert.alert("Datos incompletos", "Completa tus datos de contacto.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Método de pago", "Selecciona un método de pago.");
      return;
    }

    if (paymentMethod === "card" && !isCardValid) {
      Alert.alert(
        "Datos incompletos",
        "Completa correctamente los datos de la tarjeta."
      );
      return;
    }

    if (selectedSeats.length === 0) {
      Alert.alert("Asientos", "Debes seleccionar al menos un asiento.");
      return;
    }

    try {
      setIsSubmitting(true);

      const booking = await apiFetch<BookingResponse>("/bookings/", {
        method: "POST",
        body: JSON.stringify({
          scheduled_trip_id: selectedTrip.id,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone.trim(),
          passenger_count: selectedSeats.length,
          seat_numbers: selectedSeats,
        }),
      });

      const localTrip = {
        id: booking.id.toString(),
        tripId: booking.id.toString(),
        company: selectedTrip.company_name,
        origin,
        destination,
        date,
        departureTime: selectedTrip.departure_time,
        arrivalTime: selectedTrip.arrival_time,
        seats: booking.seats.map((seat) => seat.seat_number),
        totalPaid: Number(booking.total_amount),
        terminal: selectedTrip.meeting_point || "Terminal por definir",
        busNumber: selectedTrip.vehicle_label,
        qrValue: `tikzy-booking-${booking.id}`,
        status: "upcoming" as const,
        createdAt: booking.created_at,
      };

      confirmTrip(localTrip);
      await addTrip(localTrip);

      router.push("/booking/confirmation");
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo completar la reserva."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentOption = (
    method: PaymentMethod,
    label: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    const isSelected = paymentMethod === method;

    return (
      <TouchableOpacity
        style={[
          styles.paymentOption,
          isSelected && styles.paymentOptionSelected,
        ]}
        onPress={() => handleMethodSelect(method)}
        activeOpacity={0.85}
      >
        <View style={styles.paymentOptionLeft}>
          <View
            style={[
              styles.paymentIconBox,
              isSelected && styles.paymentIconBoxSelected,
            ]}
          >
            <Ionicons
              name={icon}
              size={18}
              color={isSelected ? "#FFFFFF" : "#2F49E3"}
            />
          </View>

          <Text
            style={[
              styles.paymentOptionText,
              isSelected && styles.paymentOptionTextSelected,
            ]}
          >
            {label}
          </Text>
        </View>

        <View
          style={[
            styles.radioOuter,
            isSelected && styles.radioOuterSelected,
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (!selectedTrip) return null;

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
            <Text style={styles.headerTitle}>Pago</Text>
            <Text style={styles.headerSubtitle}>Finaliza tu reserva</Text>
          </View>

          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Resumen del viaje</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ruta</Text>
              <Text style={styles.summaryValue}>
                {selectedTrip.origin_city} → {selectedTrip.destination_city}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Empresa</Text>
              <Text style={styles.summaryValue}>{selectedTrip.company_name}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha</Text>
              <Text style={styles.summaryValue}>{date}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hora</Text>
              <Text style={styles.summaryValue}>
                {selectedTrip.departure_time} - {selectedTrip.arrival_time}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Asientos</Text>
              <Text style={styles.summaryValue}>{selectedSeats.join(", ")}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Punto de salida</Text>
              <Text style={styles.summaryValue}>
                {selectedTrip.meeting_point || "Por definir"}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos del pasajero</Text>

            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Nombre completo"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />

            <TextInput
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="Correo electrónico"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Teléfono"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Método de pago</Text>

            {renderPaymentOption("card", "Tarjeta", "card-outline")}
            {renderPaymentOption("cash", "Efectivo", "cash-outline")}
            {renderPaymentOption("transfer", "Transferencia", "swap-horizontal-outline")}

            {paymentMethod === "card" && (
              <View style={styles.cardForm}>
                <TextInput
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Nombre del titular"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />

                <TextInput
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="Número de tarjeta"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <View style={styles.rowInputs}>
                  <TextInput
                    value={expiry}
                    onChangeText={(text) => setExpiry(formatExpiry(text))}
                    placeholder="MM/AA"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />

                  <TextInput
                    value={cvv}
                    onChangeText={(text) =>
                      setCvv(text.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="CVV"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    secureTextEntry
                    style={[styles.input, styles.halfInput]}
                  />
                </View>

                <View style={styles.securityBox}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color="#0E9F6E"
                  />
                  <Text style={styles.securityText}>
                    Tu información de pago se procesa de forma segura.
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.totalCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>L. {subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cargo por servicio</Text>
              <Text style={styles.summaryValue}>L. {serviceFee.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>L. {total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.payButton,
              isSubmitting && styles.payButtonDisabled,
            ]}
            onPress={handlePayNow}
            activeOpacity={0.9}
            disabled={isSubmitting}
          >
            <Text style={styles.payButtonText}>
              {isSubmitting ? "Procesando..." : "Confirmar reserva"}
            </Text>
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
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginTop: 8,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    backgroundColor: "#F8FAFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentOptionSelected: {
    borderColor: "#2F49E3",
    backgroundColor: "#EEF2FF",
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentIconBoxSelected: {
    backgroundColor: "#2F49E3",
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#344054",
  },
  paymentOptionTextSelected: {
    color: "#1D4ED8",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#2F49E3",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2F49E3",
  },
  cardForm: {
    marginTop: 4,
  },
  securityBox: {
    marginTop: 2,
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: "#027A48",
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
    color: "#667085",
    fontWeight: "700",
  },
  summaryValue: {
    flex: 1,
    fontSize: 13,
    color: "#101828",
    fontWeight: "800",
    textAlign: "right",
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2F49E3",
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  payButton: {
    backgroundColor: "#2F49E3",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#A5B4FC",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});