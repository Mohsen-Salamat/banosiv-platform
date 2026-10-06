import nextVitalsModule from "eslint-config-next/core-web-vitals.js";

const nextVitals = Array.isArray(nextVitalsModule)
  ? nextVitalsModule
  : nextVitalsModule.default;

if (!Array.isArray(nextVitals)) {
  throw new Error(
    "Unable to load eslint-config-next/core-web-vitals as a flat config array.",
  );
}

export default [...nextVitals];
