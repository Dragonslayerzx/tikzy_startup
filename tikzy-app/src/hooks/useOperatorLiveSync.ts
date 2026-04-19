import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect } from "react";

import { useOperatorStore } from "@/src/store/useOperatorStore";

type LiveSyncOptions = {
  panel?: boolean;
  currentTrip?: boolean;
  manifest?: boolean;
  seatMap?: boolean;
  intervalMs?: number;
};

export function useOperatorLiveSync({
  panel = false,
  currentTrip = false,
  manifest = false,
  seatMap = false,
  intervalMs = 15000,
}: LiveSyncOptions) {
  const isFocused = useIsFocused();

  const isTripActive = useOperatorStore((state) => state.isTripActive);
  const loadPanel = useOperatorStore((state) => state.loadPanel);
  const loadCurrentTrip = useOperatorStore((state) => state.loadCurrentTrip);
  const loadPassengerManifest = useOperatorStore(
    (state) => state.loadPassengerManifest
  );
  const loadSeatMap = useOperatorStore((state) => state.loadSeatMap);

  const runSync = useCallback(async () => {
    const tasks: Promise<void>[] = [];

    if (panel) {
      tasks.push(loadPanel());
    }

    if (currentTrip) {
      tasks.push(loadCurrentTrip());
    }

    if (manifest && isTripActive) {
      tasks.push(loadPassengerManifest());
    }

    if (seatMap && isTripActive) {
      tasks.push(loadSeatMap());
    }

    if (tasks.length > 0) {
      await Promise.allSettled(tasks);
    }
  }, [
    panel,
    currentTrip,
    manifest,
    seatMap,
    isTripActive,
    loadPanel,
    loadCurrentTrip,
    loadPassengerManifest,
    loadSeatMap,
  ]);

  useEffect(() => {
    if (!isFocused) return;

    runSync();

    const intervalId = setInterval(() => {
      runSync();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [isFocused, runSync, intervalMs]);
}