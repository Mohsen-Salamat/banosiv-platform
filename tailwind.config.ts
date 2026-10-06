import type {Config} from "tailwindcss";
const config:Config={darkMode:["class"],content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],theme:{extend:{colors:{background:"#090909",foreground:"#F8F6EF",muted:"#B9B6AE",panel:"#121212",line:"#262626",accent:"#E6D9B8"},borderRadius:{xl:"12px"},fontFamily:{sans:["Inter","Vazirmatn","sans-serif"]}}},plugins:[require("@tailwindcss/forms")]};
export default config;
