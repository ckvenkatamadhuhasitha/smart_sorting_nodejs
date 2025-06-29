from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os

app = Flask(__name__)
model = load_model("model/fruit_classifier.h5")

def preprocess(image_path):
    img = Image.open(image_path).resize((224, 224))
    img = np.array(img) / 255.0
    img = img.reshape((1, 224, 224, 3))
    return img

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    path = os.path.join("temp", image.filename)
    os.makedirs("temp", exist_ok=True)
    image.save(path)

    img = preprocess(path)
    prediction = model.predict(img)[0][0]
    os.remove(path)

    result = "Fresh" if prediction < 0.5 else "Rotten"
    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
