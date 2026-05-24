import API from './api';

export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const uploadVideo = (formData) => API.post('/upload/video', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
