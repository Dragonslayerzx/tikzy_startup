import React, { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

import { colors } from "@/src/theme/colors";
import {
  getTripById,
  StoredTrip,
  TripStatus,
  updateTripStatus,
} from "@/constants/tripsStorage";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function TripDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [trip, setTrip] = useState<StoredTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadTrip = useCallback(async () => {
    try {
      if (!tripId) {
        setTrip(null);
        return;
      }

      setLoading(true);
      const storedTrip = await getTripById(tripId);
      setTrip(storedTrip);
    } catch (error) {
      console.error("Error loading trip detail:", error);
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [loadTrip])
  );

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

  function getStatusBadgeStyle(status: TripStatus) {
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

  function getStatusTextStyle(status: TripStatus) {
    switch (status) {
      case "upcoming":
        return styles.statusUpcomingText;
      case "completed":
        return styles.statusCompletedText;
      case "cancelled":
        return styles.statusCancelledText;
      default:
        return styles.statusUpcomingText;
    }
  }

  async function handleUpdateStatus(nextStatus: TripStatus) {
    if (!trip) return;

    try {
      setActionLoading(true);
      await updateTripStatus(trip.id, nextStatus);
      await loadTrip();
    } catch (error) {
      console.error("Error updating trip status:", error);
      Alert.alert("Error", "Could not update trip status.");
    } finally {
      setActionLoading(false);
    }
  }

  function confirmCancelTrip() {
    Alert.alert(
      "Cancel trip",
      "Are you sure you want to cancel this trip?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: () => handleUpdateStatus("cancelled"),
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading trip detail...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={colors.primary}
            />
          </View>

          <Text style={styles.notFoundTitle}>Trip not found</Text>
          <Text style={styles.notFoundSubtitle}>
            We couldn’t find the trip you’re trying to view.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/trips")}
            activeOpacity={0.9}
          >
            <Text style={styles.backButtonText}>Back to My Trips</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Trip Detail</Text>
            <Text style={styles.headerSubtitle}>
              Your ticket and trip information
            </Text>
          </View>

          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.routeBlock}>
                <Text style={styles.routeText}>
                  {trip.origin} → {trip.destination}
                </Text>
                <Text style={styles.companyText}>{trip.company}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  getStatusBadgeStyle(trip.status),
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    getStatusTextStyle(trip.status),
                  ]}
                >
                  {getStatusLabel(trip.status)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{trip.date}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Departure</Text>
              <Text style={styles.infoValue}>{trip.departureTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Arrival</Text>
              <Text style={styles.infoValue}>{trip.arrivalTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Seats</Text>
              <Text style={styles.infoValue}>{trip.seats.join(", ")}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Terminal</Text>
              <Text style={styles.infoValue}>{trip.terminal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Boarding</Text>
              <Text style={styles.infoValue}>{trip.busNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trip ID</Text>
              <Text style={styles.infoValue}>{trip.tripId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(trip.totalPaid)}
              </Text>
            </View>
          </View>

          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Boarding QR</Text>

            <View style={styles.qrBox}>
              <QRCode value={trip.qrValue} size={180} />
            </View>

            <Text style={styles.qrValue}>{trip.qrValue}</Text>
            <Text style={styles.qrHint}>
              Show this QR code when boarding the bus.
            </Text>
          </View>

          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Trip actions</Text>

            {trip.status === "upcoming" && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => handleUpdateStatus("completed")}
                  activeOpacity={0.9}
                  disabled={actionLoading}
                >
                  <Text style={styles.completeButtonText}>
                    {actionLoading ? "Updating..." : "Mark as completed"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={confirmCancelTrip}
                  activeOpacity={0.9}
                  disabled={actionLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel trip</Text>
                </TouchableOpacity>
              </>
            )}

            {trip.status === "completed" && (
              <View style={styles.statusMessageBox}>
                <Text style={styles.statusMessageText}>
                  This trip has already been completed.
                </Text>
              </View>
            )}

            {trip.status === "cancelled" && (
              <View style={styles.statusMessageBox}>
                <Text style={styles.statusMessageText}>
                  This trip has been cancelled.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
    textAlign: "center",
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
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
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 15,
    color: colors.muted,
    fontWeight: "600",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusUpcomingText: {
    color: colors.primary,
  },
  statusCompletedText: {
    color: "#1E7A46",
  },
  statusCancelledText: {
    color: "#B42318",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
    textAlign: "right",
    flexShrink: 1,
  },
  totalValue: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: "800",
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },
  qrValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  qrHint: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 14,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cancelButton: {
    backgroundColor: "#FDECEC",
    borderWidth: 1,
    borderColor: "#F5C2C0",
  },
  cancelButtonText: {
    color: "#B42318",
    fontSize: 15,
    fontWeight: "800",
  },
  statusMessageBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusMessageText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.muted,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  notFoundIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});