import React, { useState } from 'react';
import uploadImages from './ImageService';

function QuestionInput() {
   const [inputValue, setInputValue] = useState('');
   const [showImages, setShowImages] = useState(false);
   const [selectedImages, setSelectedImages] = useState({}); 
   const [isConfirmed, setIsConfirmed] = useState(false);
   const [currentStep, setCurrentStep] = useState(1);
   const [processedImageUrl, setProcessedImageUrl] = useState(''); 
   const imageFiles = ['image1.jpeg', 'image2.jpg', 'image3.jpg'];
 
   const handleChange = (event) => {
     setInputValue(event.target.value);
   };
 
   const handleKeyPress = (event) => {
     if (event.key === 'Enter') {
       setShowImages(true);
       event.preventDefault();
     }
   };
 
   const handleImageClick = (image, step) => {
     setSelectedImages(prev => ({ ...prev, [step]: image }));
   };

   const handleConfirm = () => {
    console.log(`Confirming step ${currentStep} with image: ${selectedImages}`);

    setIsConfirmed(true);
    setSelectedImages(prev => ({ ...prev, [currentStep]: selectedImages }));
  
    if (currentStep === 3) {
      console.log("All steps confirmed. Preparing to send images to backend...");
      console.log("Selected images:", selectedImages);
      // Ensure all images have been selected
      if (Object.keys(selectedImages).length === 3) {
        const formData = new FormData();
        Promise.all(

          Object.entries(selectedImages).map(([step, imageName]) =>
            fetch(`${process.env.PUBLIC_URL}/images/${imageName}`)
              .then(response => response.blob())
              .then(blob => {
                const imageFile = new File([blob], imageName, { type: blob.type });
                formData.append(`image${step}`, imageFile);
              })
          )
        ).then(() => {
          console.log("All images fetched and appended to FormData");

          uploadImages(formData).then(imageUrl => {
            console.log("Processed image URL:", imageUrl);

            setProcessedImageUrl(imageUrl);
          }).catch(error => {
            console.error('Error:', error);
            console.error('Error uploading images:', error);

          });
        });
      } else {
        console.error("Not all images have been selected.");
      }
    }
  
    if (currentStep < 3) {
      setCurrentStep(prevStep => prevStep + 1);
      setIsConfirmed(false);
    }
  };
  
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
                onClick={() => handleImageClick(file, '1')} // Pass '1' as the step number for artist selection
              />
            ))}
          </div>
        )}
  
        {selectedImages['1'] && !isConfirmed && ( // Check for selection in step 1
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImages['1']}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImages(prev => ({...prev, '1': null})); setIsConfirmed(false); }}>No</button> 
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
                onClick={() => handleImageClick(file, '2')} // Pass '1' as the step number for artist selection
              />
            ))}
          </div>
        )}
  
        {selectedImages['2'] && !isConfirmed && ( // Check for selection in step 1
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImages['2']}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImages(prev => ({...prev, '2': null})); setIsConfirmed(false); }}>No</button>
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
                onClick={() => handleImageClick(file, '3')} // Pass '1' as the step number for artist selection
              />
            ))}
          </div>
        )}
  
        {selectedImages['3'] && !isConfirmed && ( // Check for selection in step 1
          <div>
            <p>You selected:</p>
            <img src={`${process.env.PUBLIC_URL}/images/${selectedImages['3']}`} alt="Selected" style={{ width: '100px' }} />
            <div>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => { setSelectedImages(prev => ({...prev, '3': null})); setIsConfirmed(false); }}>No</button> 
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
      
      {processedImageUrl && (
        <div>
          <p>Processed Image:</p>
          <img src={processedImageUrl} alt="Processed" />
        </div>
      )}
    </div>
  );
  
}

export default QuestionInput;
