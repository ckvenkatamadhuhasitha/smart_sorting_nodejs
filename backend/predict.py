
import sys
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

model = load_model('model/fruit_classifier.h5')

def predict(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    prediction = model.predict(img_array)
    return "Fresh" if prediction[0][0] < 0.5 else "Rotten"

if __name__ == "__main__":
    img_path = sys.argv[1]
    result = predict(img_path)
    print(result)
