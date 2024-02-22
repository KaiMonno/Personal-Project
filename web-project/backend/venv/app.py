from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from PIL import Image, ImageDraw
import io


app = Flask(__name__) 
CORS(app)


@app.route('/')
def index():
   return 'Welcome to the Flask backend!'

@app.route('/process-image', methods=['POST'])
def process_image():
   print("Received a request to process an image...")
   print("Files received:", request.files)
   print("Received a request to process an image...")
   if not all(key in request.files for key in ['image1', 'image2', 'image3']):
       print("Not all images were provided.")  # print for debugging
       return jsonify(error="Not all images were provided."), 400


   image_files = {
       'image1': request.files['image1'],
       'image2': request.files['image2'],
       'image3': request.files['image3']
   }


   #opens images
   images = {key: Image.open(image_file) for key, image_file in image_files.items()}


   # resizing images
   min_width = min(images['image2'].width, images['image3'].width)
   min_height = min(images['image2'].height, images['image3'].height)
   images['image2'] = images['image2'].resize((min_width, min_height))
   images['image3'] = images['image3'].resize((min_width, min_height))


   # creating a new image that splits them diagonally
   final_image = Image.new('RGB', (min_width, min_height))
   mask = Image.new('L', (min_width, min_height), 0)
   draw = ImageDraw.Draw(mask)
   draw.polygon([(0, 0), (min_width, 0), (0, min_height)], fill=255)
   final_image.paste(images['image3'], (0, 0))
   final_image.paste(images['image2'], (0, 0), mask=mask)


   # creating a circular mask for image
   circle_mask = Image.new('L', (min_width, min_height), 0)
   draw = ImageDraw.Draw(circle_mask)
   draw.ellipse([(0, 0), (min_width, min_height)], fill=255)
   images['image1'] = images['image1'].resize((min_width, min_height))
   final_image.paste(images['image1'], (0, 0), circle_mask)


   # saving final images
   final_buffer = io.BytesIO()
   final_image.save(final_buffer, format='PNG')
   final_buffer.seek(0)

   print("Processing complete, sending image back...")  # print statement for debugging

   return send_file(final_buffer, mimetype='image/png')


if __name__ == '__main__':
   app.run(debug=True)





