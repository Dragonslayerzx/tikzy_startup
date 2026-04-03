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

export default function RouteDashboardScreen() {
  const router = useRouter();
  const {
    currentOccupancy,
    totalCapacity,
    nextStop,
    nextStopMinutes,
    distanceKm,
    routeId,
  } = useOperatorStore();

  const occupancyPercent = Math.round(
    (currentOccupancy / totalCapacity) * 100
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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

        {/* Occupancy Card */}
        <View style={styles.card}>
          <View style={styles.occupancyHeader}>
            <View>
              <Text style={styles.occupancyLabel}>Ocupación Actual</Text>
              <Text style={styles.occupancyValue}>
                {currentOccupancy}/{totalCapacity}
              </Text>
            </View>
            <View style={styles.busIconContainer}>
              <Ionicons name="bus" size={28} color="#1F3CCF" />
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${occupancyPercent}%` }]}
            />
          </View>
          <Text style={styles.occupancyPercent}>
            {occupancyPercent}% de capacidad completada
          </Text>
        </View>

        {/* Next Stop & Distance */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.statLabel}>PRÓXIMA PARADA</Text>
            <Text style={styles.statValue}>{nextStop}</Text>
            <View style={styles.statMeta}>
              <Ionicons name="time-outline" size={14} color="#1F3CCF" />
              <Text style={styles.statMetaText}>{nextStopMinutes} min</Text>
            </View>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statLabel}>DISTANCIA</Text>
            <Text style={styles.statValue}>{distanceKm} km</Text>
            <View style={styles.statMeta}>
              <Ionicons name="git-compare-outline" size={14} color="#F5A400" />
              <Text style={[styles.statMetaText, { color: "#F5A400" }]}>
                Ruta {routeId}
              </Text>
            </View>
          </View>
        </View>

        {/* Map Preview */}
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
          <TouchableOpacity style={styles.navigateButton} activeOpacity={0.8}>
            <Ionicons name="navigate" size={18} color="#1F3CCF" />
            <Text style={styles.navigateText}>Navegar</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
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
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  statMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statMetaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F3CCF",
  },
  mapCard: {
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
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#D4E8D1",
  },
  mapContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
  },
  trafficBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trafficText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22C55E",
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    backgroundColor: "rgba(209, 233, 206, 0.5)",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  navigateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F3CCF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 14,
  },
  scanButton: {
    flex: 1,
    backgroundColor: "#F5A400",
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#F5A400",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  summaryButton: {
    flex: 1,
    backgroundColor: "#1F3CCF",
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  summaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
});
