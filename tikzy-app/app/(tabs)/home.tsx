import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useBookingStore } from "@/src/store/useBookingStore";

export default function HomeScreen() {
  const setSearchData = useBookingStore((state) => state.setSearchData);

  const [origin, setOrigin] = useState("Tegucigalpa");
  const [destination, setDestination] = useState("San Pedro Sula");
  const [date, setDate] = useState("2026-10-15");
  const [passengers, setPassengers] = useState("1");

  const handleSwapLocations = () => {
    const oldOrigin = origin;
    setOrigin(destination);
    setDestination(oldOrigin);
  };

  const handleSearch = () => {
    const parsedPassengers = Math.max(1, Number(passengers) || 1);

    if (!origin.trim() || !destination.trim() || !date.trim()) {
      Alert.alert("Campos requeridos", "Completa origen, destino y fecha.");
      return;
    }

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

          <TouchableOpacity style={styles.profileButton} activeOpacity={0.85}>
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
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.helperBox}>
            <Text style={styles.helperText}>
              Usa formato YYYY-MM-DD, por ejemplo 2026-10-15
            </Text>
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
            <Text style={styles.sectionTitle}>Ejemplos para probar</Text>
          </View>

          <View style={styles.popularCard}>
            <Text style={styles.popularRoute}>Tegucigalpa → San Pedro Sula</Text>
            <Text style={styles.popularMeta}>Fecha de prueba: 2026-10-15</Text>
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
    backgroundColor: "#F7F9FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fieldTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    paddingVertical: 0,
  },
  swapButton: {
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  helperBox: {
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
  },
  searchButton: {
    marginTop: 6,
    backgroundColor: "#2F49E3",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  popularCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  popularRoute: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  popularMeta: {
    fontSize: 14,
    color: "#6B7280",
  },
});