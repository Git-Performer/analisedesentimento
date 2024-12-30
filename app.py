from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import re  # Import para regex

# Função para mapear estrelas para rótulos
def map_sentiment(label):
    if label in ['1 star', '2 stars']:
        return 'NEGATIVE'
    elif label == '3 stars':
        return 'NEUTRAL'
    elif label in ['4 stars', '5 stars']:
        return 'POSITIVE'
    else:
        return 'UNKNOWN'

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.json.get('text', '').strip()

        # Verifica se o texto é vazio
        if not text:
            return jsonify({"error": "Texto inválido ou vazio."}), 400
        
        # Verifica se o texto é somente numérico
        if text.isdigit():
            return jsonify({"error": "Texto inválido: insira um texto com palavras."}), 400

        # Verifica se o texto contém apenas caracteres especiais
        if not re.search(r'\w', text):  # '\w' verifica se há pelo menos um caractere alfanumérico
            return jsonify({"error": "Texto inválido: insira um texto válido."}), 400

        # Faz a previsão usando o modelo
        prediction = model(text)
        sentiment = map_sentiment(prediction[0]['label'])
        confidence = prediction[0]['score']

        return jsonify({"prediction": sentiment, "confidence": confidence})

    except Exception as e:
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

if __name__ == '__main__':
    # Inicialize o pipeline aqui
    model = pipeline('sentiment-analysis', model='nlptown/bert-base-multilingual-uncased-sentiment')
    app.run(debug=True, host='0.0.0.0', port=5000)
