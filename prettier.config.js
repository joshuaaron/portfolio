/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        tabWidth: 4,
        printWidth: 140,
        useTabs: false,
        parser: "astro",
      },
    },
  ],
};
