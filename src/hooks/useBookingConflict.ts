import { useState, useEffect, useCallback } from "react";

export type ConflictType = "full" | "partial" | "unavailable" | null;

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType: ConflictType;
  message?: string;
  availableSlots?: Array<{ start: string; end: string }>;
}

/**
 * Hook to detect booking conflicts before payment confirmation
 * Simulates real-time availability checking
 */
export function useBookingConflict(
  spaceId: string,
  date: string,
  startTime: string,
  duration: number,
  enabled: boolean = true
) {
  const [conflict, setConflict] = useState<ConflictCheckResult>({
    hasConflict: false,
    conflictType: null,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConflict = useCallback(async () => {
    if (!enabled || !date || !startTime || !duration) {
      setConflict({ hasConflict: false, conflictType: null });
      setIsChecking(false);
      return;
    }

    setIsChecking(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate conflict scenarios
    // In production, this would be an actual API call to check availability
    
    // Scenario 1: Full conflict - another user booked the exact same time
    const fullConflictDates = ["2024-12-25", "2024-12-26"];
    if (fullConflictDates.includes(date) && startTime === "10:00") {
      setConflict({
        hasConflict: true,
        conflictType: "full",
        message: "This space was just booked for your selected time.",
        availableSlots: [
          { start: "09:00", end: "11:00" },
          { start: "11:00", end: "13:00" },
          { start: "14:00", end: "16:00" },
          { start: "16:00", end: "18:00" },
        ],
      });
      setIsChecking(false);
      return;
    }

    // Scenario 2: Partial conflict - part of the time slot is booked
    const partialConflictDates = ["2024-12-27", "2024-12-28"];
    if (partialConflictDates.includes(date) && startTime === "09:00" && duration >= 3) {
      setConflict({
        hasConflict: true,
        conflictType: "partial",
        message: "This space was just booked for part of your selected time.",
        availableSlots: [
          { start: "09:00", end: "11:00" },
          { start: "13:00", end: "15:00" },
          { start: "15:00", end: "17:00" },
        ],
      });
      setIsChecking(false);
      return;
    }

    // Scenario 3: Time slot becomes unavailable
    const unavailableDates = ["2024-12-29"];
    if (unavailableDates.includes(date) && startTime === "14:00") {
      setConflict({
        hasConflict: true,
        conflictType: "unavailable",
        message: "This time slot is no longer available.",
        availableSlots: [
          { start: "09:00", end: "11:00" },
          { start: "11:00", end: "13:00" },
          { start: "16:00", end: "18:00" },
        ],
      });
      setIsChecking(false);
      return;
    }

    // No conflict
    setConflict({ hasConflict: false, conflictType: null });
    setIsChecking(false);
  }, [spaceId, date, startTime, duration, enabled]);

  // Check for conflicts when relevant values change
  useEffect(() => {
    checkConflict();
  }, [checkConflict]);

  // Periodic re-checking (simulates real-time updates)
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      checkConflict();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [enabled, checkConflict]);

  return {
    conflict,
    isChecking,
    refetch: checkConflict,
  };
}
