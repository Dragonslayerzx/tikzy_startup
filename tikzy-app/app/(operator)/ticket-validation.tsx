import React from "react";
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

export default function TicketValidationScreen() {
  const router = useRouter();

  const handleConfirmBoarding = () => {
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
          <Text style={styles.headerTitle}>Validación de Boleto</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
          </View>
          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>Boleto Validado</Text>
            <Text style={styles.successSubtitle}>ESCANEO EXITOSO</Text>
          </View>
        </View>

        {/* Passenger Info Card */}
        <View style={styles.card}>
          <View style={styles.passengerHeader}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={36} color="#94A3B8" />
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>Alejandro Ramírez Paz</Text>
              <Text style={styles.ticketId}>Boleto #TK-88902</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Seat Info */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ASIENTO ASIGNADO</Text>
              <View style={styles.seatBadge}>
                <Text style={styles.seatText}>04A</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>TIPO</Text>
              <Text style={styles.infoValue}>Adulto</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Route Info */}
          <View style={styles.routeSection}>
            <View style={styles.routeRow}>
              <View style={styles.routeDotOrigin} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>ORIGEN</Text>
                <Text style={styles.routeValue}>Tegucigalpa</Text>
              </View>
            </View>
            <View style={styles.routeConnector} />
            <View style={styles.routeRow}>
              <View style={styles.routeDotDestination} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>DESTINO</Text>
                <Text style={styles.routeValue}>San Pedro Sula</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Departure Info */}
          <View style={styles.departureRow}>
            <View style={styles.departureItem}>
              <Text style={styles.departureLabel}>SALIDA ESTIMADA</Text>
              <Text style={styles.departureValue}>08:15 AM</Text>
            </View>
            <View style={styles.departureItem}>
              <Text style={styles.departureLabel}>RUTA</Text>
              <Text style={styles.departureValue}>402 - Directo</Text>
            </View>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card-outline" size={22} color="#22C55E" />
            <Text style={styles.paymentTitle}>Estado de Pago</Text>
          </View>
          <View style={styles.paymentStatusRow}>
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>PAGADO</Text>
            </View>
            <Text style={styles.paymentMethod}>Tarjeta •••• 4242</Text>
          </View>
          <Text style={styles.paymentAmount}>L. 350.00</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBoarding}
          activeOpacity={0.9}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirmar Abordaje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
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
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 14,
  },
  successIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#166534",
  },
  successSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22C55E",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  ticketId: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  seatBadge: {
    backgroundColor: "#1F3CCF",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  seatText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  routeSection: {
    paddingLeft: 4,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  routeDotOrigin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#1F3CCF",
    backgroundColor: "#FFFFFF",
  },
  routeDotDestination: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#F5A400",
    backgroundColor: "#FFFFFF",
  },
  routeConnector: {
    width: 2,
    height: 24,
    backgroundColor: "#D1D5DB",
    marginLeft: 6,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  routeValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  departureRow: {
    flexDirection: "row",
    gap: 16,
  },
  departureItem: {
    flex: 1,
  },
  departureLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  departureValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  paymentTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  paymentStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  paidBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  paidText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#166534",
    letterSpacing: 0.5,
  },
  paymentMethod: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
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
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  closeButton: {
    borderRadius: 20,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
});
