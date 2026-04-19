import { Ionicons } from "@expo/vector-icons";
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

import { useOperatorLiveSync } from "@/src/hooks/useOperatorLiveSync";
import { useOperatorStore } from "@/src/store/useOperatorStore";
import RouteDashboardScreen from "./route-dashboard";

export default function PanelScreen() {
  const {
    isLoading,
    isStartingTrip,
    error,
    assignedTrips,
    selectedTrip,
    isTripActive,
    selectTrip,
    startTrip,
    clearError,
  } = useOperatorStore();

   useOperatorLiveSync({
    panel: true,
    currentTrip: true,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Operador", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  if (isTripActive) {
    return <RouteDashboardScreen />;
  }

  const handleStartTrip = async () => {
    try {
      await startTrip();
    } catch {
      // handled in store + alert
    }
  };

  const availableCount = assignedTrips.length;

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

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>¡Buen día,</Text>
          <Text style={styles.greetingSub}>
            Prepara tu equipo para iniciar ruta.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="bus-outline" size={22} color="#1F3CCF" />
              <Text style={styles.cardTitle}>Vehículo Asignado</Text>
            </View>
            <Text style={styles.availableBadge}>
              {availableCount} DISPONIBLES
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#1F3CCF" />
              <Text style={styles.loadingText}>Cargando unidades...</Text>
            </View>
          ) : assignedTrips.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No tienes viajes programados asignados.
              </Text>
            </View>
          ) : (
            assignedTrips.map((trip) => {
              const isSelected =
                selectedTrip?.scheduled_trip_id === trip.scheduled_trip_id;

              return (
                <TouchableOpacity
                  key={trip.scheduled_trip_id}
                  style={[
                    styles.vehicleItem,
                    isSelected && styles.vehicleItemSelected,
                  ]}
                  onPress={() => selectTrip(trip)}
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
                      {trip.vehicle_internal_code}
                    </Text>
                  </View>

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
                      {trip.vehicle_plate_number}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="git-compare-outline" size={22} color="#F5A400" />
            <Text style={styles.cardTitle}>Ruta Programada</Text>
          </View>

          {selectedTrip ? (
            <>
              <View style={styles.routeTimeline}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotOrigin} />
                  <View style={styles.routeTextContainer}>
                    <Text style={styles.routeLabel}>ORIGEN</Text>
                    <Text style={styles.routeCity}>{selectedTrip.origin_city}</Text>
                  </View>
                </View>

                <View style={styles.routeLine} />

                <View style={styles.routePoint}>
                  <View style={styles.routeDotDestination} />
                  <View style={styles.routeTextContainer}>
                    <Text style={styles.routeLabel}>DESTINO</Text>
                    <Text style={styles.routeCity}>
                      {selectedTrip.destination_city}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.departureCard}>
                <Ionicons name="time-outline" size={20} color="#B8860B" />
                <View style={styles.departureInfo}>
                  <Text style={styles.departureLabel}>Próxima Salida</Text>
                  <Text style={styles.departureTime}>
                    {selectedTrip.departure_time}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Selecciona un viaje para ver la ruta.</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedTrip || isStartingTrip) && styles.startButtonDisabled,
            ]}
            onPress={handleStartTrip}
            activeOpacity={0.9}
            disabled={!selectedTrip || isStartingTrip}
          >
            {isStartingTrip ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="play-circle" size={28} color="#FFFFFF" />
                <Text style={styles.startButtonText}>EMPEZAR VIAJE</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.gpsNote}>
            Al iniciar, tu posición GPS será compartida con la central y usuarios de Tikzy.
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
    fontSize: 42,
    fontWeight: "900",
    color: "#1F3CCF",
    lineHeight: 46,
  },
  greetingSub: {
    fontSize: 20,
    color: "#4B5563",
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
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  availableBadge: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1F3CCF",
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  vehicleItemSelected: {
    backgroundColor: "#1F3CCF",
    borderColor: "#1F3CCF",
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },
  vehicleLabelSelected: {
    color: "#DBEAFE",
  },
  vehicleName: {
    fontSize: 26,
    fontWeight: "900",
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
    fontWeight: "800",
    color: "#6B7280",
  },
  vehiclePlacaLabelSelected: {
    color: "#DBEAFE",
  },
  vehiclePlaca: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginTop: 2,
  },
  vehiclePlacaSelected: {
    color: "#FFFFFF",
  },
  routeTimeline: {
    marginTop: 18,
    marginBottom: 18,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  routeDotOrigin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#1F3CCF",
    marginTop: 4,
  },
  routeDotDestination: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#F5A400",
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 38,
    backgroundColor: "#CBD5E1",
    marginLeft: 6,
    marginVertical: 6,
  },
  routeTextContainer: {
    marginLeft: 14,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },
  routeCity: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginTop: 4,
  },
  departureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  departureInfo: {
    marginLeft: 10,
  },
  departureLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
  },
  departureTime: {
    fontSize: 18,
    fontWeight: "900",
    color: "#78350F",
    marginTop: 2,
  },
  startButton: {
    backgroundColor: "#1F3CCF",
    borderRadius: 20,
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  gpsNote: {
    textAlign: "center",
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
});