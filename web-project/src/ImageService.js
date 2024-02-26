const uploadImage = (imageFile, category, userId = 'default_user') => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return fetch(`http://localhost:5000/upload-image/${category}?user_id=${userId}`, {
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

export default uploadImage;