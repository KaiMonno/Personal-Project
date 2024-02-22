const uploadImages = (imageFiles) => { // Assuming imageFiles is an object with keys 'image1', 'image2', 'image3'
  const formData = new FormData();
  Object.keys(imageFiles).forEach(key => {
    formData.append(key, imageFiles[key]);
  });

  return fetch('http://localhost:5000/process-image', {
    method: 'POST',
    body: formData
  }).then(response => {
    console.log('Response received from server:', response.status);  // debugging to see if response received

    if (response.ok) {
      return response.blob();
    }
    
    throw new Error('Network response was not ok.');
  }).then(blob => {
    console.log('Blob received from server');  // debugging to see blob received

    // converting blob into url
    return URL.createObjectURL(blob);
  }).catch(error => {
    console.error('Error in uploadImage:', error);  // errors
  });
};

export default uploadImages;
