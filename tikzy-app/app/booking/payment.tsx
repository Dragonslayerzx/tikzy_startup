import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
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
import { Ionicons } from "@expo/vector-icons";
import { useBookingStore, PaymentMethod } from "@/src/store/useBookingStore";
import { addTrip } from "@/constants/tripsStorage";

export default function PaymentScreen() {
  const origin = useBookingStore((state) => state.origin);
  const destination = useBookingStore((state) => state.destination);
  const date = useBookingStore((state) => state.date);
  const selectedRoute = useBookingStore((state) => state.selectedRoute);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const paymentMethod = useBookingStore((state) => state.paymentMethod);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  const confirmTrip = useBookingStore((state) => state.confirmTrip);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedRoute || selectedSeats.length === 0) {
      router.replace("/booking/seats");
    }
  }, [selectedRoute, selectedSeats]);

  if (!selectedRoute) {
    return null;
  }

  const subtotal = useMemo(() => {
    return selectedRoute.price * selectedSeats.length;
  }, [selectedRoute.price, selectedSeats.length]);

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

    if (!paymentMethod) {
      Alert.alert("Método de pago", "Selecciona un método de pago para continuar.");
      return;
    }

    if (paymentMethod === "card" && !isCardValid) {
      Alert.alert(
        "Datos incompletos",
        "Completa correctamente los datos de la tarjeta."
      );
      return;
    }

    if (!selectedRoute || selectedSeats.length === 0) {
      Alert.alert("Reserva inválida", "No se encontró información de la reserva.");
      return;
    }

    try {
      setIsSubmitting(true);

      const tripId = Date.now().toString();

      const tripData = {
        id: tripId,
        tripId,
        company: selectedRoute.company,
        origin,
        destination,
        date,
        departureTime: selectedRoute.departureTime,
        arrivalTime: selectedRoute.arrivalTime,
        seats: selectedSeats,
        totalPaid: total,
        terminal: selectedRoute.meetingPoint,
        busNumber: selectedRoute.busNumber ?? "#42",
        qrValue: `tikzy-${tripId}`,
        status: "upcoming" as const,
        createdAt: new Date().toISOString(),
      };

      confirmTrip(tripData);

      await addTrip(tripData);

      router.push("/booking/confirmation");
    } catch (error) {
      console.error("Error saving trip:", error);
      Alert.alert(
        "Error",
        "No se pudo completar la reserva. Intenta nuevamente."
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

            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.routeText}>
                  {origin} → {destination}
                </Text>
                <Text style={styles.companyText}>{selectedRoute.company}</Text>
              </View>

              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{selectedRoute.departureTime}</Text>
                <Text style={styles.timeDivider}>→</Text>
                <Text style={styles.timeText}>{selectedRoute.arrivalTime}</Text>
              </View>
            </View>

            <View style={styles.infoPillRow}>
              <View style={styles.infoPill}>
                <Ionicons name="calendar-outline" size={14} color="#2F49E3" />
                <Text style={styles.infoPillText}>{date}</Text>
              </View>

              <View style={styles.infoPill}>
                <Ionicons name="ticket-outline" size={14} color="#2F49E3" />
                <Text style={styles.infoPillText}>
                  {selectedSeats.join(", ")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.methodsCard}>
            <Text style={styles.cardTitle}>Método de pago</Text>

            {renderPaymentOption("card", "Tarjeta", "card-outline")}
            {renderPaymentOption("cash", "Pago en ventanilla", "cash-outline")}
            {renderPaymentOption(
              "transfer",
              "Transferencia",
              "swap-horizontal-outline"
            )}
          </View>

          {paymentMethod === "card" && (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Datos de la tarjeta</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del titular</Text>
                <TextInput
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Ej. Juan Pérez"
                  placeholderTextColor="#98A2B3"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de tarjeta</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={(value) => setCardNumber(formatCardNumber(value))}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#98A2B3"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Vencimiento</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={(value) => setExpiry(formatExpiry(value))}
                    placeholder="MM/AA"
                    placeholderTextColor="#98A2B3"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    value={cvv}
                    onChangeText={(value) =>
                      setCvv(value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    placeholderTextColor="#98A2B3"
                    keyboardType="numeric"
                    secureTextEntry
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.securityBox}>
                <Ionicons name="lock-closed-outline" size={16} color="#0E9F6E" />
                <Text style={styles.securityText}>
                  Tu información de pago se procesa de forma segura.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.priceCard}>
            <Text style={styles.cardTitle}>Detalle del pago</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Boletos</Text>
              <Text style={styles.priceValue}>L. {subtotal}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cargo por servicio</Text>
              <Text style={styles.priceValue}>L. {serviceFee}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>L. {total}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomLabel}>Total a pagar</Text>
            <Text style={styles.bottomValue}>L. {total}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.payButton,
              (!paymentMethod || isSubmitting) && styles.payButtonDisabled,
            ]}
            onPress={handlePayNow}
            activeOpacity={0.9}
          >
            <Text style={styles.payButtonText}>
              {isSubmitting ? "Procesando..." : "Pagar ahora"}
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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 14,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  routeText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  companyText: {
    fontSize: 14,
    color: "#667085",
    fontWeight: "600",
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2F49E3",
  },
  timeDivider: {
    marginHorizontal: 6,
    color: "#2F49E3",
    fontWeight: "800",
  },
  infoPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  infoPillText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#344054",
    fontWeight: "700",
  },
  methodsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  paymentOption: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentOptionSelected: {
    borderColor: "#2F49E3",
    backgroundColor: "#F5F7FF",
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentIconBoxSelected: {
    backgroundColor: "#2F49E3",
  },
  paymentOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#344054",
  },
  paymentOptionTextSelected: {
    color: "#101828",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D0D5DD",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#2F49E3",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2F49E3",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475467",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#101828",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  securityBox: {
    marginTop: 4,
    backgroundColor: "#ECFDF3",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  securityText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    color: "#027A48",
    fontWeight: "700",
    lineHeight: 18,
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#475467",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 14,
    color: "#101828",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: "#101828",
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 18,
    color: "#2F49E3",
    fontWeight: "800",
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
    fontSize: 18,
    color: "#101828",
    fontWeight: "800",
  },
  payButton: {
    minWidth: 160,
    backgroundColor: "#2F49E3",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonDisabled: {
    opacity: 0.65,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});