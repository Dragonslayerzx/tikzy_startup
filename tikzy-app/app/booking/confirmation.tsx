import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useBookingStore } from "@/src/store/useBookingStore";

export default function ConfirmationScreen() {
  const confirmedTrip = useBookingStore((state) => state.confirmedTrip);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  useEffect(() => {
    if (!confirmedTrip) {
      router.replace("/(tabs)/home");
    }
  }, [confirmedTrip]);

  if (!confirmedTrip) {
    return null;
  }

  const handleGoHome = () => {
    resetBooking();
    router.replace("/(tabs)/home");
  };

  const handleViewTrips = () => {
    router.replace("/(tabs)/trips");
  };

  const handleViewTripDetail = () => {
    router.push(`/trip/${confirmedTrip.tripId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successSection}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={34} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
            <Text style={styles.successSubtitle}>
              Tu boleto ya fue reservado y está listo para tu viaje.
            </Text>
          </View>

          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <View>
                <Text style={styles.ticketLabel}>Compañía</Text>
                <Text style={styles.ticketCompany}>{confirmedTrip.company}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Confirmado</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.routeBlock}>
                <Text style={styles.routeCity}>{confirmedTrip.origin}</Text>
                <Text style={styles.routeTime}>{confirmedTrip.departureTime}</Text>
              </View>

              <View style={styles.routeCenter}>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={styles.routeDate}>{confirmedTrip.date}</Text>
              </View>

              <View style={styles.routeBlock}>
                <Text style={styles.routeCity}>{confirmedTrip.destination}</Text>
                <Text style={styles.routeTime}>{confirmedTrip.arrivalTime}</Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Asientos</Text>
                <Text style={styles.infoValue}>
                  {confirmedTrip.seats.join(", ")}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Bus</Text>
                <Text style={styles.infoValue}>{confirmedTrip.busNumber}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Terminal</Text>
                <Text style={styles.infoValue}>{confirmedTrip.terminal}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total pagado</Text>
                <Text style={styles.infoValue}>
                  L. {confirmedTrip.totalPaid.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.qrSection}>
              <View style={styles.qrBox}>
                <Ionicons name="qr-code-outline" size={110} color="#111827" />
              </View>

              <Text style={styles.qrCodeText}>{confirmedTrip.qrValue}</Text>
              <Text style={styles.qrHint}>
                Presenta este código al momento de abordar.
              </Text>
            </View>
          </View>

          <View style={styles.referenceCard}>
            <View style={styles.referenceRow}>
              <Ionicons name="receipt-outline" size={18} color="#2F49E3" />
              <View style={styles.referenceTextWrap}>
                <Text style={styles.referenceLabel}>ID de viaje</Text>
                <Text style={styles.referenceValue}>{confirmedTrip.tripId}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewTrips}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Mis viajes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleViewTripDetail}
            activeOpacity={0.9}
          >
            <Text style={styles.outlineButtonText}>Ver detalle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Inicio</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  successSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#16A34A",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#101828",
    textAlign: "center",
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 18,
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  ticketLabel: {
    fontSize: 12,
    color: "#98A2B3",
    fontWeight: "700",
    marginBottom: 4,
  },
  ticketCompany: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
    maxWidth: 220,
  },
  statusBadge: {
    backgroundColor: "#ECFDF3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#027A48",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  routeBlock: {
    flex: 1,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 14,
    color: "#475467",
    fontWeight: "700",
  },
  routeCenter: {
    width: 84,
    alignItems: "center",
  },
  routeArrow: {
    fontSize: 22,
    color: "#2F49E3",
    fontWeight: "900",
  },
  routeDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#667085",
    fontWeight: "700",
    textAlign: "center",
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: "#667085",
    fontWeight: "700",
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: "#101828",
    fontWeight: "800",
    textAlign: "right",
  },
  qrSection: {
    alignItems: "center",
  },
  qrBox: {
    width: 170,
    height: 170,
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  qrCodeText: {
    fontSize: 13,
    color: "#101828",
    fontWeight: "800",
    marginBottom: 6,
  },
  qrHint: {
    fontSize: 12,
    color: "#667085",
    textAlign: "center",
  },
  referenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
  },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  referenceTextWrap: {
    marginLeft: 12,
  },
  referenceLabel: {
    fontSize: 12,
    color: "#98A2B3",
    fontWeight: "700",
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 15,
    color: "#101828",
    fontWeight: "800",
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2F49E3",
    fontSize: 13,
    fontWeight: "800",
  },
  outlineButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },
  outlineButtonText: {
    color: "#344054",
    fontSize: 13,
    fontWeight: "800",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2F49E3",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});