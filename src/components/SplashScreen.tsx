import { useEffect } from "react";
import { playSplash } from "../lib/splash";

// The branded shell is in index.html, so it is visible while the actual app boots.
// Run one short entrance and then exit; there is no extra hold after the animation.
export default function SplashScreen() {
  useEffect(() => {
    const splash = document.getElementById("hqf-intro");
    const root = document.documentElement;
    if (!splash || root.dataset.intro !== "pending") {
      root.dataset.intro = "done";
      splash?.remove();
      return;
    }
    return playSplash(splash, root);
  }, []);
  return null;
}
