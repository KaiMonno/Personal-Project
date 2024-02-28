from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Ensure the directory for storing processed images exists
storage_dir = 'processed_images'
os.makedirs(storage_dir, exist_ok=True)

@app.route('/') 
def index(): return 'Welcome to the Flask backend!'

@app.route('/upload-image/<category>', methods=['POST'])
def upload_image(category):
    user_id = request.args.get('user_id', 'default_user')

    if 'image' not in request.files:
        return jsonify(error="No image provided."), 400

    image_file = request.files['image']
    if image_file:
        # Process the image as needed, for example, convert to grayscale
        image = Image.open(image_file.stream)
        processed_image = image.convert('L')

        # Construct a file path to save the processed image
        save_path = os.path.join(storage_dir, f'{user_id}_{category}.png')
        processed_image.save(save_path)

        # To return the processed image, open the saved file and send it as a response
        return send_file(save_path, mimetype='image/png')

    return jsonify(error="Invalid image."), 400

if __name__ == '__main__':
    app.run(debug=True)
