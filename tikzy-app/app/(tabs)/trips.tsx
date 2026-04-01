import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Screen from "@/src/components/ui/Screen";
import { colors } from "@/src/theme/colors";
import {
  getTrips,
  StoredTrip,
  TripStatus,
} from "@/constants/tripsStorage";

const FILTERS: { label: string; value: TripStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function TripsScreen() {
  const router = useRouter();

  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<TripStatus>("upcoming");

  const loadTrips = useCallback(async () => {
    try {
      const storedTrips = await getTrips();
      setTrips(Array.isArray(storedTrips) ? storedTrips : []);
    } catch (error) {
      console.error("Error loading trips:", error);
      setTrips([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips])
  );

  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => trip.status === selectedFilter)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [trips, selectedFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
  };

  function getStatusText(status: TripStatus) {
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

  function renderTripCard({ item }: { item: StoredTrip }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/trip/${item.id}`)}
      >
        <View style={styles.cardTop}>
          <View style={styles.routeBlock}>
            <Text style={styles.routeText}>
              {item.origin} → {item.destination}
            </Text>
            <Text style={styles.companyText}>{item.company}</Text>
          </View>

          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>
            {item.departureTime} - {item.arrivalTime}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Seats</Text>
          <Text style={styles.value}>{item.seats.join(", ")}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Terminal</Text>
          <Text style={styles.value}>{item.terminal}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Bus</Text>
          <Text style={styles.value}>{item.busNumber}</Text>
        </View>

        <View style={[styles.infoRow, styles.lastRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>L {item.totalPaid.toFixed(2)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>
          Check your bookings and their current status
        </Text>

        <View style={styles.filtersContainer}>
          {FILTERS.map((filter) => {
            const isActive = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : filteredTrips.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No trips here yet</Text>
            <Text style={styles.emptyText}>
              There are no {selectedFilter} trips to display.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTrips}
            keyExtractor={(item) => item.id}
            renderItem={renderTripCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
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
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 18,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 10,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  routeBlock: {
    flex: 1,
  },
  routeText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 13,
    color: colors.muted,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusUpcoming: {
    backgroundColor: "#DDEBFF",
  },
  statusCompleted: {
    backgroundColor: "#DDF5E6",
  },
  statusCancelled: {
    backgroundColor: "#FFE0E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#222",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: colors.muted,
  },
  value: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
  lastRow: {
    marginTop: 6,
    marginBottom: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.muted,
  },
  emptyBox: {
    marginTop: 40,
    padding: 24,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
});