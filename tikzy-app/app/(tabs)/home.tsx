import React, { useState } from "react";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookingStore } from "@/src/store/useBookingStore";

export default function HomeScreen() {
  const setSearchData = useBookingStore((state) => state.setSearchData);

  const [origin, setOrigin] = useState("Tegucigalpa");
  const [destination, setDestination] = useState("San Pedro Sula");
  const [date, setDate] = useState("15 Oct 2026");
  const [passengers, setPassengers] = useState("1");

  const handleSwapLocations = () => {
    const oldOrigin = origin;
    setOrigin(destination);
    setDestination(oldOrigin);
  };

  const handleSearch = () => {
    const parsedPassengers = Number(passengers) || 1;

    setSearchData({
      origin: origin.trim(),
      destination: destination.trim(),
      date: date.trim(),
      passengers: parsedPassengers,
    });

    router.push("/booking/results");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, viajero 👋</Text>
            <Text style={styles.subtitle}>Encuentra tu próximo destino</Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-outline" size={22} color="#2F49E3" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Buscar viaje</Text>

          <View style={styles.field}>
            <Ionicons name="location-outline" size={20} color="#5A67D8" />
            <View style={styles.fieldTextContainer}>
              <Text style={styles.label}>Origen</Text>
              <TextInput
                value={origin}
                onChangeText={setOrigin}
                placeholder="Ciudad de origen"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleSwapLocations}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical" size={20} color="#5A67D8" />
          </TouchableOpacity>

          <View style={styles.field}>
            <Ionicons name="paper-plane-outline" size={20} color="#5A67D8" />
            <View style={styles.fieldTextContainer}>
              <Text style={styles.label}>Destino</Text>
              <TextInput
                value={destination}
                onChangeText={setDestination}
                placeholder="Ciudad de destino"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Ionicons name="calendar-outline" size={20} color="#5A67D8" />
            <View style={styles.fieldTextContainer}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="Ej. 15 Oct 2026"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Ionicons name="people-outline" size={20} color="#5A67D8" />
            <View style={styles.fieldTextContainer}>
              <Text style={styles.label}>Pasajeros</Text>
              <TextInput
                value={passengers}
                onChangeText={setPassengers}
                placeholder="1"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.9}
          >
            <Text style={styles.searchButtonText}>Buscar rutas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rutas populares</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.popularCard}>
            <Text style={styles.popularRoute}>Tegucigalpa → San Pedro Sula</Text>
            <Text style={styles.popularMeta}>Viajes diarios desde L. 150</Text>
          </View>

          <View style={styles.popularCard}>
            <Text style={styles.popularRoute}>Tegucigalpa → La Ceiba</Text>
            <Text style={styles.popularMeta}>Salidas matutinas y nocturnas</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF1FF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 34,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#6B7280",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FAFBFF",
    marginBottom: 14,
  },
  fieldTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  input: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingVertical: 0,
  },
  swapButton: {
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  searchButton: {
    marginTop: 4,
    backgroundColor: "#2F49E3",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#2F49E3",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  sectionLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F49E3",
  },
  popularCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  popularRoute: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  popularMeta: {
    fontSize: 14,
    color: "#6B7280",
  },
});