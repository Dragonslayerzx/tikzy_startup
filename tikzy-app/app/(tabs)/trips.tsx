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
import { Ionicons } from "@expo/vector-icons";

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

type StatusMeta = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  text: string;
  border: string;
};

function getStatusMeta(status: TripStatus): StatusMeta {
  switch (status) {
    case "upcoming":
      return {
        label: "Upcoming",
        icon: "time-outline",
        bg: "#E8F1FF",
        text: "#1D4ED8",
        border: "#BBD3FF",
      };
    case "completed":
      return {
        label: "Completed",
        icon: "checkmark-circle-outline",
        bg: "#EAF9F0",
        text: "#15803D",
        border: "#BFE8CB",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        icon: "close-circle-outline",
        bg: "#FDECEC",
        text: "#B91C1C",
        border: "#F5BDBD",
      };
    default:
      return {
        label: "Upcoming",
        icon: "time-outline",
        bg: "#E8F1FF",
        text: "#1D4ED8",
        border: "#BBD3FF",
      };
  }
}

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

  const tripCounts = useMemo(() => {
    return {
      upcoming: trips.filter((trip) => trip.status === "upcoming").length,
      completed: trips.filter((trip) => trip.status === "completed").length,
      cancelled: trips.filter((trip) => trip.status === "cancelled").length,
    };
  }, [trips]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
  };

  function renderTripCard({ item }: { item: StoredTrip }) {
    const statusMeta = getStatusMeta(item.status);

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/trip/${item.id}`)}
      >
        <View style={styles.cardTop}>
          <View style={styles.routeBlock}>
            <View style={styles.routeRow}>
              <Ionicons
                name="bus-outline"
                size={18}
                color={colors.primary}
                style={styles.routeIcon}
              />
              <Text style={styles.routeText}>
                {item.origin} → {item.destination}
              </Text>
            </View>

            <Text style={styles.companyText}>{item.company}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusMeta.bg,
                borderColor: statusMeta.border,
              },
            ]}
          >
            <Ionicons
              name={statusMeta.icon}
              size={14}
              color={statusMeta.text}
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: statusMeta.text }]}>
              {statusMeta.label}
            </Text>
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
            const count = tripCounts[filter.value];

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

                <View
                  style={[
                    styles.countBadge,
                    isActive && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isActive && styles.countTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
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
            <Ionicons
              name="ticket-outline"
              size={34}
              color={colors.muted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No trips here yet</Text>
            <Text style={styles.emptyText}>
              There are no {selectedFilter} trips to display right now.
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  countBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  countTextActive: {
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
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingRight: 8,
  },
  routeIcon: {
    marginRight: 6,
  },
  routeText: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  companyText: {
    fontSize: 13,
    color: colors.muted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
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
  emptyIcon: {
    marginBottom: 10,
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