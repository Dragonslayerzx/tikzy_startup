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
import { useOperatorStore } from "@/src/store/useOperatorStore";
import RouteDashboardScreen from "./route-dashboard";

export default function PanelScreen() {
  const {
    isTripActive,
    vehicles,
    selectedVehicle,
    selectVehicle,
    routeOrigin,
    routeDestination,
    nextDeparture,
    startTrip,
  } = useOperatorStore();

  // When trip is active, show the route dashboard instead
  if (isTripActive) {
    return <RouteDashboardScreen />;
  }

  const handleStartTrip = () => {
    startTrip();
  };

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

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>¡Buen día,</Text>
          <Text style={styles.greetingSub}>
            Prepara tu equipo para iniciar ruta.
          </Text>
        </View>

        {/* Vehicle Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="bus-outline" size={22} color="#1F3CCF" />
              <Text style={styles.cardTitle}>Vehículo Asignado</Text>
            </View>
            <Text style={styles.availableBadge}>
              {vehicles.length} DISPONIBLES
            </Text>
          </View>

          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;
            return (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleItem,
                  isSelected && styles.vehicleItemSelected,
                ]}
                onPress={() => selectVehicle(vehicle)}
                activeOpacity={0.8}
              >
                <View style={styles.vehicleIconContainer}>
                  <Ionicons
                    name="bus"
                    size={24}
                    color={isSelected ? "#FFFFFF" : "#94A3B8"}
                  />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text
                    style={[
                      styles.vehicleLabel,
                      isSelected && styles.vehicleLabelSelected,
                    ]}
                  >
                    INTERNO
                  </Text>
                  <Text
                    style={[
                      styles.vehicleName,
                      isSelected && styles.vehicleNameSelected,
                    ]}
                  >
                    {vehicle.interno}
                  </Text>
                </View>
                {vehicle.placa ? (
                  <View style={styles.vehiclePlacaContainer}>
                    <Text
                      style={[
                        styles.vehiclePlacaLabel,
                        isSelected && styles.vehiclePlacaLabelSelected,
                      ]}
                    >
                      PLACA
                    </Text>
                    <Text
                      style={[
                        styles.vehiclePlaca,
                        isSelected && styles.vehiclePlacaSelected,
                      ]}
                    >
                      {vehicle.placa}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Programmed Route */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="git-compare-outline" size={22} color="#F5A400" />
            <Text style={styles.cardTitle}>Ruta Programada</Text>
          </View>

          <View style={styles.routeTimeline}>
            <View style={styles.routePoint}>
              <View style={styles.routeDotOrigin} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>ORIGEN</Text>
                <Text style={styles.routeCity}>{routeOrigin}</Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View style={styles.routeDotDestination} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>DESTINO</Text>
                <Text style={styles.routeCity}>{routeDestination}</Text>
              </View>
            </View>
          </View>

          <View style={styles.departureCard}>
            <Ionicons name="time-outline" size={20} color="#B8860B" />
            <View style={styles.departureInfo}>
              <Text style={styles.departureLabel}>Próxima Salida</Text>
              <Text style={styles.departureTime}>
                {nextDeparture} (En 12 min)
              </Text>
            </View>
          </View>
        </View>

        {/* Start Trip */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartTrip}
            activeOpacity={0.9}
          >
            <Ionicons name="play-circle" size={28} color="#FFFFFF" />
            <Text style={styles.startButtonText}>EMPEZAR VIAJE</Text>
          </TouchableOpacity>

          <Text style={styles.gpsNote}>
            Al iniciar, tu posición GPS será compartida con la central y
            usuarios de Tikzy.
          </Text>
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
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F3CCF",
  },
  greetingSub: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  availableBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F3CCF",
    letterSpacing: 0.5,
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
  },
  vehicleItemSelected: {
    backgroundColor: "#1F3CCF",
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  vehicleLabelSelected: {
    color: "rgba(255,255,255,0.7)",
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  vehicleNameSelected: {
    color: "#FFFFFF",
  },
  vehiclePlacaContainer: {
    alignItems: "flex-end",
  },
  vehiclePlacaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  vehiclePlacaLabelSelected: {
    color: "rgba(255,255,255,0.7)",
  },
  vehiclePlaca: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  vehiclePlacaSelected: {
    color: "#FFFFFF",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#FFFFFF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  routeTimeline: {
    paddingLeft: 8,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  routeDotOrigin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#1F3CCF",
    backgroundColor: "#FFFFFF",
  },
  routeDotDestination: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#F5A400",
    backgroundColor: "#FFFFFF",
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: "#D1D5DB",
    marginLeft: 6,
    borderStyle: "dashed" as any,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  routeCity: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  departureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9E7",
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    gap: 12,
  },
  departureInfo: {
    flex: 1,
  },
  departureLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B8860B",
  },
  departureTime: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#1F3CCF",
    borderRadius: 20,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  gpsNote: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 14,
    lineHeight: 18,
  },
});
