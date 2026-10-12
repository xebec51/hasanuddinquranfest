import { useEffect } from "react";
import { startScrollReveal } from "../lib/scrollReveal";

// Content stays visible by default; observed elements animate on each viewport entry.
export function useScrollReveal() {
  useEffect(() => startScrollReveal(), []);
}
