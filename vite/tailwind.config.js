/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../contents/templates/**/*.html",
    "../contents/*.py",
    "../*.py",
  ],
  theme: {
    fontFamily: {
      jetbrains: ["JetBrains Mono", "monospace"],
    }
  }
};
