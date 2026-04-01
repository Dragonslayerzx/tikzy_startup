import { addTrip } from "@/constants/tripsStorage";
import {
  clearBookingDraft,
  getBookingDraft,
  type BookingDraft,
} from "@/constants/bookingDraftStorage";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

function generateBookingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  return `TKZ-${part()}-${part().slice(0, 2)}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
  }).format(amount);
}

export default function ConfirmationScreen() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadDraft = async () => {
        setLoading(true);
        const storedDraft = await getBookingDraft();
        setDraft(storedDraft);
        setLoading(false);
      };

      loadDraft();
    }, [])
  );

  const bookingCode = useMemo(() => generateBookingCode(), []);

  const handleViewTrips = async () => {
    if (!draft) {
      router.replace("/trips");
      return;
    }

    const newTrip = {
      id: Date.now().toString(),
      from: draft.from,
      to: draft.to,
      operator: draft.operator,
      date: draft.date,
      departureTime: draft.departureTime,
      arrivalTime: draft.arrivalTime,
      seats: draft.seats,
      total: draft.total,
      status: "upcoming" as const,
      terminal: draft.terminal,
      boardingPoint: draft.boardingPoint,
    };

    await addTrip(newTrip);
    await clearBookingDraft();
    router.replace("/trips");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading confirmation...</Text>
      </View>
    );
  }

  if (!draft) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.noticeCard}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noticeText}>
            No booking data was found. Please complete your booking first.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.primaryButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const qrValue = JSON.stringify({
    from: draft.from,
    to: draft.to,
    operator: draft.operator,
    date: draft.date,
    departureTime: draft.departureTime,
    seats: draft.seats,
    total: draft.total,
    bookingCode,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={42} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>¡Compra Exitosa!</Text>
          <Text style={styles.subtitle}>
            Tu ticket ha sido confirmado y ya está listo para abordar.
          </Text>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketLabel}>TICKET ELECTRÓNICO</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmado</Text>
            </View>
          </View>

          <Text style={styles.companyName}>{draft.operator}</Text>
          <Text style={styles.routeText}>
            {draft.from} → {draft.to}
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{draft.date}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Salida</Text>
              <Text style={styles.infoValue}>{draft.departureTime}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Llegada</Text>
              <Text style={styles.infoValue}>{draft.arrivalTime}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Asientos</Text>
              <Text style={styles.infoValue}>{draft.seats.join(", ")}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Terminal</Text>
              <Text style={styles.infoValue}>{draft.terminal}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Abordaje</Text>
              <Text style={styles.infoValue}>{draft.boardingPoint}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <QRCode value={qrValue} size={150} />
            </View>
            <Text style={styles.qrCaption}>
              Código QR para validación al abordar
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomInfo}>
            <View>
              <Text style={styles.smallLabel}>Código de reserva</Text>
              <Text style={styles.bookingCode}>{bookingCode}</Text>
            </View>

            <View style={styles.priceBlock}>
              <Text style={styles.smallLabel}>Total pagado</Text>
              <Text style={styles.totalPaid}>{formatCurrency(draft.total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.noticeText}>
            Preséntate 20 minutos antes de la salida. Lleva tu documento de
            identidad y muestra este ticket en el abordaje.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={handleViewTrips}
        >
          <Text style={styles.primaryButtonText}>Ver Mis Viajes</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home-outline" size={18} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}

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
    paddingTop: 24,
    paddingBottom: 18,
  },
  centered: {
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 18,
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "800",
  },
  companyName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  routeText: {
    marginTop: 4,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "700",
  },
  infoGrid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  infoItem: {
    width: "50%",
  },
  infoLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
    borderStyle: "dashed",
  },
  qrSection: {
    alignItems: "center",
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrCaption: {
    marginTop: 10,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  smallLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 4,
  },
  bookingCode: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "800",
  },
  priceBlock: {
    alignItems: "flex-end",
  },
  totalPaid: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: "800",
  },
  noticeCard: {
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
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});