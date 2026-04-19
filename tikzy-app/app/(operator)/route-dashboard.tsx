import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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

import { useOperatorStore } from "@/src/store/useOperatorStore";

export default function RouteDashboardScreen() {
  const router = useRouter();

  const {
    isLoading,
    error,
    currentTrip,
    loadCurrentTrip,
    clearError,
  } = useOperatorStore();

  useEffect(() => {
    loadCurrentTrip();
  }, [loadCurrentTrip]);

  useEffect(() => {
    if (error) {
      Alert.alert("Ruta activa", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  if (isLoading && !currentTrip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1F3CCF" />
          <Text style={styles.centerText}>Cargando viaje activo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.centerTitle}>No hay viaje activo</Text>
          <Text style={styles.centerText}>
            Inicia un viaje desde el panel del operador.
          </Text>

          <TouchableOpacity
            style={styles.backToPanelButton}
            onPress={() => router.replace("/(operator)/panel")}
          >
            <Text style={styles.backToPanelButtonText}>Volver al panel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="bus" size={24} color="#1F3CCF" />
            </View>
            <Text style={styles.headerTitle}>Tikzy Operador</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>En línea</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.occupancyHeader}>
            <View>
              <Text style={styles.occupancyLabel}>Ocupación Actual</Text>
              <Text style={styles.occupancyValue}>
                {currentTrip.current_occupancy}/{currentTrip.total_capacity}
              </Text>
            </View>
            <View style={styles.busIconContainer}>
              <Ionicons name="bus" size={28} color="#1F3CCF" />
            </View>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${currentTrip.occupancy_percent}%` },
              ]}
            />
          </View>

          <Text style={styles.occupancyPercent}>
            {currentTrip.occupancy_percent}% de capacidad completada
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.statLabel}>PRÓXIMA PARADA</Text>
            <Text style={styles.statValue}>{currentTrip.next_stop}</Text>
            <View style={styles.statMeta}>
              <Ionicons name="time-outline" size={14} color="#1F3CCF" />
              <Text style={styles.statMetaText}>
                {currentTrip.next_stop_minutes} min
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statLabel}>DISTANCIA</Text>
            <Text style={styles.statValue}>{currentTrip.distance_km} km</Text>
            <View style={styles.statMeta}>
              <Ionicons name="git-compare-outline" size={14} color="#F5A400" />
              <Text style={[styles.statMetaText, { color: "#F5A400" }]}>
                Ruta {currentTrip.route_id}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapContent}>
              <Ionicons name="map-outline" size={48} color="#94A3B8" />
              <Text style={styles.mapPlaceholderText}>Vista previa del mapa</Text>
              <View style={styles.trafficBadge}>
                <Text style={styles.trafficText}>Tráfico Moderado</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.navigateButton}
            onPress={() => router.push("/(operator)/map")}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={18} color="#1F3CCF" />
            <Text style={styles.navigateText}>Navegar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.routeSummaryCard}>
          <Text style={styles.routeSummaryTitle}>
            {currentTrip.origin_city} → {currentTrip.destination_city}
          </Text>
          <Text style={styles.routeSummarySubtitle}>
            Salida {currentTrip.departure_time} · Llegada {currentTrip.arrival_time}
          </Text>
          <Text style={styles.vehicleText}>
            {currentTrip.vehicle_internal_code} · {currentTrip.vehicle_plate_number}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/(operator)/scanner")}
            activeOpacity={0.9}
          >
            <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Escanear{"\n"}Boleto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryButton}
            onPress={() => router.push("/(operator)/settlement")}
            activeOpacity={0.9}
          >
            <Ionicons name="list-outline" size={28} color="#FFFFFF" />
            <Text style={styles.summaryButtonText}>Resumen{"\n"}de Viaje</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.summaryButton}
            onPress={() => router.push("/(operator)/seat-map")}
            activeOpacity={0.9}
          >
            <Text style={styles.summaryButtonText}>Mapa{"\n"}de Asientos</Text>
          </TouchableOpacity>
        </View>
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
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },
  centerText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  backToPanelButton: {
    marginTop: 22,
    backgroundColor: "#1F3CCF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  backToPanelButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  onlineText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  occupancyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  occupancyLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  occupancyValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1F3CCF",
    marginTop: 4,
  },
  busIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#1F3CCF",
    borderRadius: 5,
  },
  occupancyPercent: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    minHeight: 62,
  },
  statMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  statMetaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F3CCF",
  },
  mapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mapPlaceholder: {
    height: 250,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mapContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "700",
    fontSize: 16,
  },
  trafficBadge: {
    marginTop: 12,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  trafficText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 13,
  },
  navigateButton: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  navigateText: {
    color: "#1F3CCF",
    fontSize: 18,
    fontWeight: "900",
  },
  routeSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  routeSummaryTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  routeSummarySubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "600",
  },
  vehicleText: {
    marginTop: 8,
    fontSize: 15,
    color: "#1F3CCF",
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  scanButton: {
    flex: 1,
    backgroundColor: "#F5A400",
    borderRadius: 26,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
  summaryButton: {
    flex: 1,
    backgroundColor: "#1F3CCF",
    borderRadius: 26,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  summaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
});