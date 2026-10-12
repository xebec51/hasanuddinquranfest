import { useEffect } from "react";
import { startScrollReveal } from "../lib/scrollReveal";

// Content stays visible by default. Only animate once an observed element enters.
export function useScrollReveal() {
  useEffect(() => startScrollReveal(), []);
}
