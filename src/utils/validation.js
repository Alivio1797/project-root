export const validateStoryInput = (input) => {
  const errors = {};
  
  if (!input.description || input.description.trim() === '') {
    errors.description = 'Description is required';
  } else if (input.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!input.photo) {
    errors.photo = 'Photo is required';
  }

  if (!input.lat || !input.lon) {
    errors.location = 'Location is required';
  } else if (isNaN(input.lat) || isNaN(input.lon)) {
    errors.location = 'Invalid location coordinates';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};