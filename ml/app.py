from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_crop_disease

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "success": True,
        "service": "KrishiDrishti ML Disease Prediction API",
        "port": 8000
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({
            "success": False,
            "message": "No image file provided in request."
        }), 400

    image_file = request.files['image']
    crop_name = request.form.get('crop', 'tomato')

    try:
        result = predict_crop_disease(image_file, crop_name)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"ML prediction error: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("====================================================")
    print("KRISHIDRISHTI PYTHON ML SERVICE STARTED")
    print("Listening on http://localhost:8000")
    print("Endpoint: POST http://localhost:8000/predict")
    print("====================================================")
    app.run(host='0.0.0.0', port=8000, debug=False)
