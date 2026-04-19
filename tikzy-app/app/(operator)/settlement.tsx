import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useOperatorLiveSync } from "@/src/hooks/useOperatorLiveSync";
import { useOperatorStore } from "@/src/store/useOperatorStore";

const hoursBetween = (startedAt?: string | null) => {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return 0;
  const diffMs = Date.now() - start;
  return Math.max(0, diffMs / (1000 * 60 * 60));
};

export default function SettlementScreen() {
  const router = useRouter();

  const {
    isEndingTrip,
    isLoadingManifest,
    isLoadingSeatMap,
    currentTrip,
    manifest,
    passengers,
    manualSalesHistory,
    endTrip,
  } = useOperatorStore();

  useOperatorLiveSync({
    currentTrip: true,
    manifest: true,
    seatMap: true,
  });

  const isLoading = isLoadingManifest || isLoadingSeatMap;

  const routeOrigin = useMemo(() => {
    return currentTrip?.origin_city ?? manifest?.route_origin ?? "Origen";
  }, [currentTrip, manifest]);

  const routeDestination = useMemo(() => {
    return currentTrip?.destination_city ?? manifest?.route_destination ?? "Destino";
  }, [currentTrip, manifest]);

  const totalKm = useMemo(() => {
    return Math.round(Number(currentTrip?.distance_km ?? 0));
  }, [currentTrip]);

  const totalHours = useMemo(() => {
    const hrs = hoursBetween(currentTrip?.started_at);
    return Number(hrs.toFixed(1));
  }, [currentTrip]);

  const scannedTickets = useMemo(() => {
    return passengers.filter((p) => p.is_boarded).length;
  }, [passengers]);

  const manualSales = useMemo(() => {
    return manualSalesHistory.length;
  }, [manualSalesHistory]);

  const cashRevenue = useMemo(() => {
    return manualSalesHistory.reduce(
      (sum, sale) => sum + Number(sale.total_amount || 0),
      0
    );
  }, [manualSalesHistory]);

  const appRevenue = useMemo(() => {
    const manualIds = new Set(manualSalesHistory.map((sale) => sale.booking_id));
    return passengers
      .filter((p) => !manualIds.has(p.booking_id))
      .reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  }, [passengers, manualSalesHistory]);

  const totalRevenue = useMemo(() => {
    return appRevenue + cashRevenue;
  }, [appRevenue, cashRevenue]);

  const cancellations = useMemo(() => {
    return passengers.filter((p) => p.status === "cancelled").length;
  }, [passengers]);

  const formattedRevenue = useMemo(() => {
    return `L.${Number(totalRevenue || 0).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [totalRevenue]);

  const formattedAppRevenue = useMemo(() => {
    return `L.${Number(appRevenue || 0).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [appRevenue]);

  const formattedCashRevenue = useMemo(() => {
    return `L.${Number(cashRevenue || 0).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [cashRevenue]);

  const displayHours = useMemo(() => {
    const value = Number(totalHours || 0);
    return value % 1 === 0 ? `${value.toFixed(0)}` : `${value.toFixed(1)}`;
  }, [totalHours]);

  const shortOrigin = useMemo(() => {
    if (!routeOrigin || routeOrigin === "Origen") return "TGU";
    return routeOrigin.slice(0, 3).toUpperCase();
  }, [routeOrigin]);

  const shortDestination = useMemo(() => {
    if (!routeDestination || routeDestination === "Destino") return "SPS";
    return routeDestination.slice(0, 3).toUpperCase();
  }, [routeDestination]);

  const handleEndTrip = async () => {
    try {
      await endTrip();
      router.replace("/(operator)/panel");
    } catch {
      // the store already handles the error state
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumen de Liquidación</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total Recaudado</Text>
          <Text style={styles.revenueAmount}>{formattedRevenue}</Text>
          <View style={styles.revenueRoute}>
            <View style={styles.routeDot} />
            <Text style={styles.revenueRouteText}>
              {routeOrigin} → {routeDestination}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1F3CCF" />
            <Text style={styles.loadingText}>Actualizando liquidación...</Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#EEF1FF" }]}>
              <Ionicons name="qr-code-outline" size={22} color="#1F3CCF" />
            </View>
            <Text style={styles.statValue}>{scannedTickets}</Text>
            <Text style={styles.statLabel}>Boletos Escaneados</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="create-outline" size={22} color="#F5A400" />
            </View>
            <Text style={styles.statValue}>{manualSales}</Text>
            <Text style={styles.statLabel}>Ventas Manuales</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="speedometer-outline" size={22} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{totalKm}</Text>
            <Text style={styles.statLabel}>Kilómetros</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="time-outline" size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>{displayHours}</Text>
            <Text style={styles.statLabel}>Hrs Recorrido</Text>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Desglose de Operación</Text>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[styles.breakdownDot, { backgroundColor: "#1F3CCF" }]}
              />
              <Text style={styles.breakdownLabel}>App Tikzy</Text>
            </View>
            <Text style={styles.breakdownValue}>{formattedAppRevenue}</Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[styles.breakdownDot, { backgroundColor: "#F5A400" }]}
              />
              <Text style={styles.breakdownLabel}>Efectivo</Text>
            </View>
            <Text style={styles.breakdownValue}>{formattedCashRevenue}</Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[styles.breakdownDot, { backgroundColor: "#EF4444" }]}
              />
              <Text style={styles.breakdownLabel}>Cancelaciones</Text>
            </View>
            <Text style={[styles.breakdownValue, { color: "#EF4444" }]}>
              {cancellations}
            </Text>
          </View>
        </View>

        <View style={styles.miniMapCard}>
          <View style={styles.miniMapPlaceholder}>
            <View style={styles.miniMapContent}>
              <View style={styles.miniMapRoute}>
                <View style={styles.miniDotA} />
                <View style={styles.miniRouteLine} />
                <View style={styles.miniDotB} />
              </View>
              <View style={styles.miniMapLabels}>
                <Text style={styles.miniMapCityA}>{shortOrigin}</Text>
                <Text style={styles.miniMapCityB}>{shortDestination}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tripSummaryCard}>
          <Text style={styles.tripSummaryTitle}>
            {routeOrigin} → {routeDestination}
          </Text>
          <Text style={styles.tripSummarySubtitle}>
            Salida {currentTrip?.departure_time ?? "--:--"} · Llegada{" "}
            {currentTrip?.arrival_time ?? "--:--"}
          </Text>
          <Text style={styles.tripSummaryVehicle}>
            {currentTrip?.vehicle_internal_code ?? "BUS---"} ·{" "}
            {currentTrip?.vehicle_plate_number ?? "---"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.endTripButton, isEndingTrip && { opacity: 0.7 }]}
          onPress={handleEndTrip}
          activeOpacity={0.9}
          disabled={isEndingTrip}
        >
          {isEndingTrip ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="flag" size={24} color="#FFFFFF" />
              <Text style={styles.endTripButtonText}>Finalizar Viaje</Text>
            </>
          )}
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
  revenueCard: {
    backgroundColor: "#1F3CCF",
    borderRadius: 28,
    padding: 28,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  revenueLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  revenueAmount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  revenueRoute: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  revenueRouteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
  },
  breakdownCard: {
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
  breakdownTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 18,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  miniMapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  miniMapPlaceholder: {
    height: 120,
    backgroundColor: "#D4E8D1",
  },
  miniMapContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  miniMapRoute: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  miniDotA: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1F3CCF",
  },
  miniRouteLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#1F3CCF",
    opacity: 0.4,
    marginHorizontal: 8,
  },
  miniDotB: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F5A400",
  },
  miniMapLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  miniMapCityA: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F3CCF",
  },
  miniMapCityB: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F5A400",
  },
  tripSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tripSummaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  tripSummarySubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  tripSummaryVehicle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F3CCF",
  },
  endTripButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    borderRadius: 20,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  endTripButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
});