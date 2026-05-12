import nextPlugin from "@next/eslint-plugin-next";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "build/**"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules
    }
  }
];

export default config;
