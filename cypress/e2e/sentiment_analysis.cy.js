describe('Sentiment Analysis Tests', () => {
    
    it('Should return a prediction for valid text', () => {
        const text = "I am feeling great!";

        cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5000/predict',  
            body: { text },
        }).then((response) => {
            expect(response.body.prediction).to.be.oneOf(['POSITIVE', 'NEGATIVE', 'NEUTRAL']);
            expect(response.body.confidence).to.be.a('number');
            expect(response.body.confidence).to.be.greaterThan(0);
        });
    });

    it('Should return a prediction for valid text in Portuguese', () => {
        const text = "Hoje foi um dia incrível!";

        cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5000/predict',
            body: { text },
        }).then((response) => {
            expect(response.body.prediction).to.be.oneOf(['POSITIVE', 'NEGATIVE', 'NEUTRAL']);
            expect(response.body.confidence).to.be.a('number');
            expect(response.body.confidence).to.be.greaterThan(0);
        });
    });

    it('Should handle empty text', () => {
        const text = "";
    
        cy.request({
            method: 'POST',
            url: '/predict',  
            body: { text },
            failOnStatusCode: false  
        }).then((response) => {
            expect(response.body.error).to.equal('Texto inválido ou vazio.');
        });
    });
    
    it('Should handle numeric-only input', () => {
        const text = "123456";
    
        cy.request({
            method: 'POST',
            url: '/predict',
            body: { text },
            failOnStatusCode: false  
        }).then((response) => {
            expect(response.body.error).to.equal('Texto inválido: insira um texto com palavras.');
        });
    });

    it('Should handle text with special characters', () => {
        const text = "Olá! Como você está? #feliz :)";

        cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5000/predict',
            body: { text },
        }).then((response) => {
            expect(response.body.prediction).to.be.oneOf(['POSITIVE', 'NEGATIVE', 'NEUTRAL']);
            expect(response.body.confidence).to.be.a('number');
            expect(response.body.confidence).to.be.greaterThan(0);
        });
    });

    it('Should clear the text input and result when the clear button is clicked', () => {
        cy.visit('http://127.0.0.1:5500/index.html');
        cy.get('#text-input').type('Teste de limpeza');
        cy.get('button').contains('Limpar').click();
        cy.get('#text-input').should('have.value', '');
        cy.get('#result').should('have.text', '');
    });
    
});

describe('Performance Benchmark', () => {
    const MAX_RESPONSE_TIME = 200; // Limite em milissegundos

    it('Should respond within acceptable time', () => {
        const text = "I am feeling great!";

        const start = Date.now();
        cy.request({
            method: 'POST',
            url: '/predict',
            body: { text },
        }).then((response) => {
            const end = Date.now();
            const responseTime = end - start;

            expect(responseTime).to.be.lessThan(MAX_RESPONSE_TIME);
            cy.log(`Tempo de resposta: ${responseTime} ms`);
        });
    });
});
