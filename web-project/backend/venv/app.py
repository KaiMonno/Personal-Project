from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from PIL import Image, ImageDraw
import io


app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
   return 'Welcome to the Flask backend!'


# route for processing images
@app.route('/process-image', methods=['POST'])
def process_image():
   print("Processing image...") #debugging!
   if 'image' not in request.files:
       print("No image provided.")
       return jsonify(error="No image provided."), 400


   image_file = request.files['image']
   if image_file:
       print("Image received:", image_file.filename)


       image = Image.open(image_file) #opens image
       # where im going to process the image
       processed_image = image.convert('L')  # just to check if shii is working
       # where im going to save the image that i processed
       img_byte_arr = io.BytesIO()
       processed_image.save(img_byte_arr, format='PNG')
       img_byte_arr.seek(0)


       return send_file(img_byte_arr, mimetype='image/png')


   return jsonify(error="Invalid image."), 400


if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0', port=5000)



