import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <View style={styles.bannerLeft}>
          <View style={styles.locationIcon}>
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.bannerTitle}>Ubicación Activa</Text>
            <Text style={styles.bannerSubtitle}>
              Compartida con pasajeros
            </Text>
          </View>
        </View>
        <View style={styles.passengersBadge}>
          <Ionicons name="people" size={16} color="#1F3CCF" />
          <Text style={styles.passengersText}>12</Text>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          {/* Simulated route line */}
          <View style={styles.routeSimulation}>
            {/* Point A */}
            <View style={styles.markerA}>
              <View style={styles.markerDot}>
                <Text style={styles.markerLabel}>A</Text>
              </View>
              <View style={styles.markerCallout}>
                <Text style={styles.calloutText}>Tegucigalpa</Text>
              </View>
            </View>

            {/* Route line dashes */}
            <View style={styles.routeDashes}>
              {Array.from({ length: 8 }, (_, i) => (
                <View key={i} style={styles.dash} />
              ))}
            </View>

            {/* Bus icon on route */}
            <View style={styles.busMarker}>
              <Ionicons name="bus" size={22} color="#FFFFFF" />
            </View>

            {/* Point B */}
            <View style={styles.markerB}>
              <View style={[styles.markerDot, styles.markerDotB]}>
                <Text style={styles.markerLabel}>B</Text>
              </View>
              <View style={styles.markerCallout}>
                <Text style={styles.calloutText}>San Pedro Sula</Text>
              </View>
            </View>
          </View>

          <View style={styles.mapOverlayCenter}>
            <Ionicons name="map-outline" size={64} color="rgba(148, 163, 184, 0.3)" />
          </View>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.8}>
            <Ionicons name="remove" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.controlButtonActive]}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={24} color="#1F3CCF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View style={styles.bottomBarIcon}>
            <Ionicons name="flag" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.bottomBarInfo}>
            <Text style={styles.bottomBarLabel}>SIGUIENTE PARADA</Text>
            <View style={styles.bottomBarRow}>
              <Text style={styles.bottomBarStop}>Plaza Central</Text>
              <Text style={styles.bottomBarTime}>· 5 min</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bottomBarAction}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F0FE",
  },
  topBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1F3CCF",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
  },
  passengersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  passengersText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F3CCF",
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#D4E8D1",
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#D4E8D1",
    position: "relative",
  },
  routeSimulation: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  markerA: {
    alignItems: "center",
    marginBottom: 8,
  },
  markerB: {
    alignItems: "center",
    marginTop: 8,
  },
  markerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1F3CCF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerDotB: {
    backgroundColor: "#F5A400",
  },
  markerLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  markerCallout: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  calloutText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  routeDashes: {
    gap: 6,
    alignItems: "center",
  },
  dash: {
    width: 3,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#1F3CCF",
    opacity: 0.4,
  },
  busMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F3CCF",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  mapOverlayCenter: {
    position: "absolute",
    bottom: 20,
    right: 20,
    opacity: 0.4,
  },
  mapControls: {
    position: "absolute",
    right: 16,
    top: 16,
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  controlButtonActive: {
    borderWidth: 2,
    borderColor: "#1F3CCF",
  },
  bottomBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bottomBarIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#1F3CCF",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bottomBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bottomBarStop: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  bottomBarTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F3CCF",
  },
  bottomBarAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});
