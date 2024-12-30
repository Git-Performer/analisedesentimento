// Sobrescreve o comando `cy.log` para adicionar suporte a logs no modo headless
Cypress.Commands.overwrite("log", (originalLog, ...args) => {
    if (Cypress.browser.isHeadless) {
      // Envia os logs para o terminal no modo headless
      return cy.task("log", args, { log: false }).then(() => {
        return originalLog(...args);
      });
    } else {
      // Exibe os logs diretamente no console do navegador no modo GUI
      console.log(...args);
      return originalLog(...args);
    }
  });
  