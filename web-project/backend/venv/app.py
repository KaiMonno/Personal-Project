from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# making sure our directory exists
storage_dir = 'processed_images'
os.makedirs(storage_dir, exist_ok=True)

@app.route('/upload-image/<category>', methods=['POST'])
def upload_image(category):
    user_id = request.args.get('user_id', 'default_user')
    image_file = request.files['image']

    if image_file:
        # saving the image onto our system
        filename = f"{user_id}_{category}.png"
        filepath = os.path.join(storage_dir, filename)
        image_file.save(filepath)

        # checking if all of the images have been uploaded
        if all_images_uploaded(user_id):
            combined_image = combine_images(user_id)
            combined_image_path = os.path.join(storage_dir, f"{user_id}_combined.png")
            combined_image.save(combined_image_path)

            # returning image
            return send_file(combined_image_path, mimetype='image/png')

    return jsonify(error="Invalid image."), 400

def all_images_uploaded(user_id):
    # check if we have all 3 images
    required_categories = ['artist', 'movie', 'show']
    for category in required_categories:
        filepath = os.path.join(storage_dir, f"{user_id}_{category}.png")
        if not os.path.exists(filepath):
            return False
    return True

def combine_images(user_id):
    # combined image for this session
    images = []
    for category in ['artist', 'movie', 'show']:
        filepath = os.path.join(storage_dir, f"{user_id}_{category}.png")
        images.append(Image.open(filepath))

    # assuming they are all same size just for simplicity
    total_width = sum(image.width for image in images)
    max_height = max(image.height for image in images)
    combined_image = Image.new('RGB', (total_width, max_height))

    x_offset = 0
    for image in images:
        combined_image.paste(image, (x_offset, 0))
        x_offset += image.width

    return combined_image

@app.route('/') 
def index(): return 'Welcome to the Flask backend!'

if __name__ == '__main__':
    app.run(debug=True)