from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# declaration of image storage
images_store = {}

@app.route('/') 
def index(): return 'Welcome to the Flask backend!'

@app.route('/upload-image/<category>', methods=['POST'])
def upload_image(category):
    user_id = request.args.get('user_id', 'default_user')
    
    if 'image' not in request.files:
        return jsonify(error="No image provided."), 400

    image_file = request.files['image']
    if image_file:
        # initializes image stores
        if user_id not in images_store:
            images_store[user_id] = {}
        
        # processes the image (we are doing graysdcale as like a example)
        image = Image.open(image_file.stream)
        processed_image = image.convert('L')
        
        # save processed image
        img_byte_arr = io.BytesIO()
        processed_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # store the processed image in temporary storage
        images_store[user_id][category] = img_byte_arr
        
        # debugging print
        print(f"Image for {category} processed and saved.")

        # return the processed image!
        return send_file(img_byte_arr, mimetype='image/png')

    return jsonify(error="Invalid image."), 400

if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0', port=5000)


