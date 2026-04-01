import Screen from "@/src/components/ui/Screen";
import Button from "@/src/components/ui/Button";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";
import { mockTrips, Trip } from "@/constants/mockTrips";
import { getStoredTrips } from "@/constants/tripsStorage";
import QRCode from "react-native-qrcode-svg";
import React, { useCallback, useState } from "react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
  }).format(amount);
}

function getStatusLabel(status: "upcoming" | "completed" | "cancelled") {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusStyle(status: "upcoming" | "completed" | "cancelled") {
  switch (status) {
    case "upcoming":
      return styles.statusUpcoming;
    case "completed":
      return styles.statusCompleted;
    case "cancelled":
      return styles.statusCancelled;
    default:
      return styles.statusUpcoming;
  }
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadTrip = async () => {
        const storedTrips = await getStoredTrips();
        const foundStoredTrip = storedTrips.find((item) => item.id === id);
        if (foundStoredTrip) {
          setTrip(foundStoredTrip);
          return;
        }

        const foundMockTrip = mockTrips.find((item) => item.id === id) ?? null;
        setTrip(foundMockTrip);
      };

      loadTrip();
    }, [id])
  );

  if (!trip) {
    return (
      <Screen>
        <View style={styles.container}>
          <Text style={styles.title}>Trip Detail</Text>

          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundTitle}>Trip not found</Text>
            <Text style={styles.notFoundText}>
              We couldn&apos;t find the selected trip.
            </Text>
            <Button title="Back to My Trips" onPress={() => router.push("/trips")} />
          </View>
        </View>
      </Screen>
    );
  }

  const qrValue = JSON.stringify({
    tripId: trip.id,
    from: trip.from,
    to: trip.to,
    operator: trip.operator,
    date: trip.date,
    departureTime: trip.departureTime,
    seats: trip.seats,
    total: trip.total,
  });

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Trip Detail</Text>
        <Text style={styles.subtitle}>Your ticket and trip information.</Text>

        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketHeaderLeft}>
              <Text style={styles.route}>
                {trip.from} → {trip.to}
              </Text>
              <Text style={styles.operator}>{trip.operator}</Text>
            </View>

            <View style={[styles.statusBadge, getStatusStyle(trip.status)]}>
              <Text style={styles.statusText}>{getStatusLabel(trip.status)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{trip.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Departure</Text>
            <Text style={styles.value}>{trip.departureTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Arrival</Text>
            <Text style={styles.value}>{trip.arrivalTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Seats</Text>
            <Text style={styles.value}>{trip.seats.join(", ")}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Terminal</Text>
            <Text style={styles.value}>{trip.terminal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Boarding</Text>
            <Text style={styles.value}>{trip.boardingPoint}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trip ID</Text>
            <Text style={styles.value}>{trip.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatCurrency(trip.total)}</Text>
          </View>
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Boarding QR</Text>

          <View style={styles.qrBox}>
            <QRCode value={qrValue} size={180} />
          </View>

          <Text style={styles.qrHint}>
            Show this QR code at boarding for validation.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button title="Back to My Trips" onPress={() => router.push("/trips")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text ?? "#111827",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  ticketCard: {
    backgroundColor: colors.surface ?? "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    marginBottom: 16,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  ticketHeaderLeft: {
    flex: 1,
  },
  route: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text ?? "#111827",
    marginBottom: 4,
  },
  operator: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border ?? "#E5E7EB",
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text ?? "#111827",
    textAlign: "right",
  },
  totalValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary ?? "#1F3CCF",
    textAlign: "right",
  },
  qrCard: {
    backgroundColor: colors.surface ?? "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    alignItems: "center",
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text ?? "#111827",
    marginBottom: 14,
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  qrHint: {
    fontSize: 13,
    color: colors.muted ?? "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  actions: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusUpcoming: {
    backgroundColor: "#DCFCE7",
  },
  statusCompleted: {
    backgroundColor: "#DBEAFE",
  },
  statusCancelled: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  notFoundCard: {
    backgroundColor: colors.surface ?? "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    marginTop: 12,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text ?? "#111827",
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
    marginBottom: 16,
  },
});