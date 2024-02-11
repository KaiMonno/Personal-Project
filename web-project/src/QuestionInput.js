import React, { useState } from 'react';
import uploadImage from './ImageService';

function QuestionInput() {
  const [inputValue, setInputValue] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setShowImages(true);
      event.preventDefault();
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsConfirmed(false); // reset confirmation state when a new image is selected
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  
    // fetching image
    fetch(`${process.env.PUBLIC_URL}/images/${selectedImage}`)
      .then(response => response.blob())
      .then(blob => {
        // using blob to create new file
        const imageFile = new File([blob], selectedImage, { type: blob.type });
  
        // Uuploading file
        uploadImage(imageFile).then(imageUrl => {
          // logging image url
          console.log(imageUrl);
          // update image status
          setProcessedImageUrl(imageUrl);
          
        }).catch(error => {
          console.error('Error:', error);
        });
        
      });
  
    setCurrentStep(currentStep + 1); // move to the next step after confirming
  };
  

  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const imageFiles = ['image1.jpeg', 'image2.jpg', 'image3.jpg'];

  const renderArtistQuestion = () => {
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
  
        {showImages && (
          <div>
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={`${process.env.PUBLIC_URL}/images/${file}`}
                alt="Art"
                style={{ width: '100px', margin: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(file)}
              />
            ))}
          </div>
        )}
  
        {selectedImage && !isConfirmed && (
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImage}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImage(null); setIsConfirmed(false); }}>No</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMovieQuestion = () => {
    return (
      <div>
        <p>Please enter your favorite movie:</p>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type here and press Enter..."
        />
  
        {showImages && (
          <div>
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={`${process.env.PUBLIC_URL}/images/${file}`}
                alt="Art"
                style={{ width: '100px', margin: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(file)}
              />
            ))}
          </div>
        )}
  
        {selectedImage && !isConfirmed && (
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImage}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImage(null); setIsConfirmed(false); }}>No</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderShowQuestion = () => {
    return (
      <div>
        <p>Please enter your favorite show:</p>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type here and press Enter..."
        />
  
        {showImages && (
          <div>
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={`${process.env.PUBLIC_URL}/images/${file}`}
                alt="Art"
                style={{ width: '100px', margin: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(file)}
              />
            ))}
          </div>
        )}
  
        {selectedImage && !isConfirmed && (
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImage}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImage(null); setIsConfirmed(false); }}>No</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderArtistQuestion();
      case 2:
        return renderMovieQuestion();
      case 3:
        return renderShowQuestion();
      default:
        return <p>Thank you for your selections!</p>; // final step or confirmation message
    }
  };


  

  return (
    <div>
      {renderStepContent()}
    </div>
  );
}

export default QuestionInput;
