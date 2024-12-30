const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '6cyytc',
    e2e: {
        baseUrl: "http://127.0.0.1:5000", // URL base do servidor backend
    },
});

