import React, { useState } from 'react';
import uploadImage from './ImageService';

function QuestionInput() {
  const [inputValue, setInputValue] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [processedArtistImageUrl, setProcessedArtistImageUrl] = useState('');
  const [processedMovieImageUrl, setProcessedMovieImageUrl] = useState('');
  const [processedShowImageUrl, setProcessedShowImageUrl] = useState('');
  const imageFiles = ['image1.jpeg', 'image2.jpg', 'image3.jpg'];
  const [allImagesProcessed, setAllImagesProcessed] = useState(false);  // check if all done


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
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    if (currentStep >= 3) {
      setAllImagesProcessed(true);  // Set completion state
    } else {
      setCurrentStep(currentStep + 1);  // Move to the next step
    }
    console.log('handleConfirm called');  //little debugging print
    setIsConfirmed(true);
    const category = currentStep === 1 ? 'artist' : currentStep === 2 ? 'movie' : 'show';
    const userId = 'user123';  // user id replace later
  
    console.log(`Fetching image from: ${process.env.PUBLIC_URL}/images/${selectedImage}`);  //debugging
  
    fetch(`${process.env.PUBLIC_URL}/images/${selectedImage}`)
      .then(response => {
        console.log('Fetch response received:', response);  // debugging
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        console.log('Blob received:', blob);  // debugging
        const imageFile = new File([blob], selectedImage, { type: blob.type });
  
        console.log(`Uploading image as ${category} for user ${userId}`);  // debugging
  
        uploadImage(imageFile, category, userId).then(imageUrl => {
          console.log('Processed image URL:', imageUrl);  // debugging
          if (category === 'artist') {
            setProcessedArtistImageUrl(imageUrl);
          } else if (category === 'movie') {
            setProcessedMovieImageUrl(imageUrl);
          } else if (category === 'show') {
            setProcessedShowImageUrl(imageUrl);
          }
        }).catch(error => {
          console.error('Error in uploadImage:', error);  // log errors
        });
      })
      .catch(error => {
        console.error('Error in fetch:', error);  // log errors
      });
  
    setCurrentStep(currentStep + 1);  // log changing steps
    console.log(`Moving to step ${currentStep + 1}`);
  };
  

  const renderQuestion = () => {
    const questionType = currentStep === 1 ? 'artist' : currentStep === 2 ? 'movie' : 'show';
    return (
      <div>
        <p>Please enter your favorite {questionType}:</p>
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
                alt={questionType}
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

  return (
    <div>
      {!allImagesProcessed ? renderQuestion() : <p>All images processed. Thank you!</p>}

      {/* all of the processed images */}
      {allImagesProcessed && (
        <div>
          <p>Processed Artist Image:</p>
          <img src={processedArtistImageUrl} alt="Processed Artist" />
          <p>Processed Movie Image:</p>
          <img src={processedMovieImageUrl} alt="Processed Movie" />
          <p>Processed Show Image:</p>
          <img src={processedShowImageUrl} alt="Processed Show" />
        </div>
      )}
    </div>
  );
}

export default QuestionInput;