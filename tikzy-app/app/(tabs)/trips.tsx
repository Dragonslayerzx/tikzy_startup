import Screen from "@/src/components/ui/Screen";
import Button from "@/src/components/ui/Button";
import { colors } from "@/src/theme/colors";
import { Trip, TripStatus, mockTrips } from "@/constants/mockTrips";
import { getStoredTrips } from "@/constants/tripsStorage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
  }).format(amount);
}

function getStatusLabel(status: TripStatus) {
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

function getStatusStyle(status: TripStatus) {
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

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  useFocusEffect(
    useCallback(() => {
      const loadTrips = async () => {
        const storedTrips = await getStoredTrips();
        if (storedTrips.length > 0) {
          setTrips(storedTrips);
        } else {
          setTrips(mockTrips);
        }
      };

      loadTrips();
    }, [])
  );

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>
          Check your upcoming, completed, and cancelled trips.
        </Text>

        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.route}>
                    {item.from} → {item.to}
                  </Text>
                  <Text style={styles.operator}>{item.operator}</Text>
                </View>

                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{item.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Departure</Text>
                <Text style={styles.value}>{item.departureTime}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Arrival</Text>
                <Text style={styles.value}>{item.arrivalTime}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Seats</Text>
                <Text style={styles.value}>{item.seats.join(", ")}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.value}>{formatCurrency(item.total)}</Text>
              </View>

              <View style={styles.actions}>
                <Button
                  title="View Detail"
                  onPress={() =>
                    router.push({
                      pathname: "/trip/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptyText}>
                Your booked trips will appear here.
              </Text>
              <Button title="Book a trip" onPress={() => router.push("/home")} />
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text ?? "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted ?? "#6B7280",
    marginBottom: 18,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface ?? "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  route: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text ?? "#111827",
    marginBottom: 4,
  },
  operator: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text ?? "#111827",
  },
  actions: {
    marginTop: 12,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text ?? "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted ?? "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
});