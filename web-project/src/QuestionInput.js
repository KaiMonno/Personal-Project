import React, { useState } from 'react';

function QuestionInput() {
  const [inputValue, setInputValue] = useState('');
  const [images, setImages] = useState([]); 

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const imagesPath = '/public'; 
      const allImages = ['image1.jpg', 'image2.jpeg', 'image3.jpeg']; 
      setImages(allImages.map(name => `${imagesPath}/${name}`));
    }
  };

  return (
    <div>
      <p>Please enter your favorite artist:</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type here and press Enter..."
      />
      <div>
      {images.map((src, index) => (
            <img key={index} src={src} alt={`Placeholder ${index}`} style={{ maxWidth: '100px', margin: '10px' }} />
        ))}

      </div>
    </div>
  );
}

export default QuestionInput;
