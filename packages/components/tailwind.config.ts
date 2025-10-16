import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn78bp632rvzbm5y1dw8ewfbzd7sj714/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
