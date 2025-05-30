export function handleApiError(error) {
  console.error(error);
  alert(error.message || 'Terjadi kesalahan');

  // Default message
  let message = 'An unexpected error occurred';

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    message = 'Network error: Please check your internet connection';
  } else if (error.message) {
    message = error.message;
  }

  alert(message);
  return message;
};