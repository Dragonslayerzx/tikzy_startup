import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useOperatorStore } from "@/src/store/useOperatorStore";

export default function ScannerScreen() {
  const router = useRouter();

  const {
    error,
    isValidatingTicket,
    validateScannedTicket,
    clearError,
  } = useOperatorStore();

  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (error) {
      Alert.alert("Escáner", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleManualSale = () => {
    router.push("/(operator)/manual-sale");
  };

  const handleValidate = async () => {
    if (!qrValue.trim()) {
      Alert.alert("Código QR", "Ingresa o pega el valor del QR.");
      return;
    }

    try {
      await validateScannedTicket(qrValue.trim());
      router.push("/(operator)/ticket-validation");
    } catch {
      // alert handled by store
    }
  };

  const handleDemoScan = async () => {
    const demoValue = "tikzy-booking-1";
    setQrValue(demoValue);

    try {
      await validateScannedTicket(demoValue);
      router.push("/(operator)/ticket-validation");
    } catch {
      // alert handled by store
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <View style={styles.overlay}>
            <Text style={styles.scanTitle}>Escanea el Código QR</Text>
            <Text style={styles.scanSubtitle}>
              Alinea el código QR del boleto dentro del recuadro
            </Text>
          </View>

          <View style={styles.scannerFrameContainer}>
            <TouchableOpacity
              style={styles.scannerFrame}
              onPress={handleDemoScan}
              activeOpacity={0.9}
              disabled={isValidatingTicket}
            >
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />

              <View style={styles.qrCenter}>
                {isValidatingTicket ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="qr-code-outline"
                    size={64}
                    color="rgba(255,255,255,0.3)"
                  />
                )}
                <Text style={styles.tapHint}>Toca para simular escaneo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.flashContainer}>
            <TouchableOpacity style={styles.flashButton} activeOpacity={0.8}>
              <Ionicons name="flashlight-outline" size={24} color="#FFFFFF" />
              <Text style={styles.flashText}>Linterna</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.inputLabel}>Valor del QR</Text>
          <TextInput
            style={styles.input}
            placeholder="tikzy-booking-1"
            placeholderTextColor="#94A3B8"
            value={qrValue}
            onChangeText={setQrValue}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.validateButton}
            onPress={handleValidate}
            activeOpacity={0.9}
            disabled={isValidatingTicket}
          >
            {isValidatingTicket ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
                <Text style={styles.validateButtonText}>Validar boleto</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualSale}
            activeOpacity={0.9}
          >
            <Ionicons name="create-outline" size={22} color="#1F3CCF" />
            <Text style={styles.manualButtonText}>Venta manual</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#2D2D44",
    justifyContent: "space-between",
  },
  overlay: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  scanTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 22,
  },
  scannerFrameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  scannerFrame: {
    width: 260,
    height: 260,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#1F3CCF",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  qrCenter: {
    alignItems: "center",
    gap: 12,
  },
  tapHint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  flashContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  flashButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  flashText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
    gap: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  validateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#1F3CCF",
    borderRadius: 18,
    height: 56,
  },
  validateButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1F3CCF",
    borderRadius: 20,
    height: 60,
    shadowColor: "#1F3CCF",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  manualButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F3CCF",
  },
});