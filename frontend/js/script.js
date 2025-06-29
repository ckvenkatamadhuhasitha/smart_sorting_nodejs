
async function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    document.getElementById('result').innerText = 'Prediction: ' + data.prediction;
}
