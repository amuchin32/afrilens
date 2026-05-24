import API from './api';

export const getArticles = (params) => API.get('/articles', { params });
export const getArticle = (slug) => API.get('/articles/' + slug);
export const getFeaturedArticles = () => API.get('/articles/featured');
export const getBreakingNews = () => API.get('/articles/breaking');
export const createArticle = (data) => API.post('/articles', data);
export const updateArticle = (id, data) => API.put('/articles/' + id, data);
export const deleteArticle = (id) => API.delete('/articles/' + id);
export const getCategories = () => API.get('/categories');
