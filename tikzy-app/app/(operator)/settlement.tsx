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
import { useOperatorStore } from "@/src/store/useOperatorStore";

export default function SettlementScreen() {
  const router = useRouter();
  const {
    totalRevenue,
    scannedTickets,
    manualSales,
    totalKm,
    totalHours,
    appRevenue,
    cashRevenue,
    cancellations,
    routeOrigin,
    routeDestination,
    endTrip,
  } = useOperatorStore();

  const handleEndTrip = () => {
    endTrip();
    router.push("/(operator)/panel");
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
          <Text style={styles.headerTitle}>Resumen de Liquidación</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Total Revenue Card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total Recaudado</Text>
          <Text style={styles.revenueAmount}>
            L.{totalRevenue.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.revenueRoute}>
            <View style={styles.routeDot} />
            <Text style={styles.revenueRouteText}>
              {routeOrigin} → {routeDestination}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
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
            <Text style={styles.statValue}>{totalHours}</Text>
            <Text style={styles.statLabel}>Hrs Recorrido</Text>
          </View>
        </View>

        {/* Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Desglose de Operación</Text>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: "#1F3CCF" },
                ]}
              />
              <Text style={styles.breakdownLabel}>App Tikzy</Text>
            </View>
            <Text style={styles.breakdownValue}>
              L.{appRevenue.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: "#F5A400" },
                ]}
              />
              <Text style={styles.breakdownLabel}>Efectivo</Text>
            </View>
            <Text style={styles.breakdownValue}>
              L.{cashRevenue.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: "#EF4444" },
                ]}
              />
              <Text style={styles.breakdownLabel}>Cancelaciones</Text>
            </View>
            <Text style={[styles.breakdownValue, { color: "#EF4444" }]}>
              {cancellations}
            </Text>
          </View>
        </View>

        {/* Mini Map */}
        <View style={styles.miniMapCard}>
          <View style={styles.miniMapPlaceholder}>
            <View style={styles.miniMapContent}>
              <View style={styles.miniMapRoute}>
                <View style={styles.miniDotA} />
                <View style={styles.miniRouteLine} />
                <View style={styles.miniDotB} />
              </View>
              <View style={styles.miniMapLabels}>
                <Text style={styles.miniMapCityA}>TGU</Text>
                <Text style={styles.miniMapCityB}>SPS</Text>
              </View>
            </View>
          </View>
        </View>

        {/* End Trip Button */}
        <TouchableOpacity
          style={styles.endTripButton}
          onPress={handleEndTrip}
          activeOpacity={0.9}
        >
          <Ionicons name="flag" size={24} color="#FFFFFF" />
          <Text style={styles.endTripButtonText}>Finalizar Viaje</Text>
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
    marginBottom: 20,
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
    gap: 0,
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
