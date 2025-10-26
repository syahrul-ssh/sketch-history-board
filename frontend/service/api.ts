import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Sketch {
  id: number;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export const sketchApi = {
  getAllSketches: async (): Promise<Sketch[]> => {
    const response = await api.get('/sketches');
    return response.data;
  },

  getSketch: async (id: number): Promise<Sketch> => {
    const response = await api.get(`/sketches/${id}`);
    return response.data;
  },

  createSketch: async (title: string, imageData: string, thumbnail: string): Promise<Sketch> => {
    const response = await api.post('/sketches', { title, imageData, thumbnail });
    return response.data;
  },

  deleteSketch: async (id: number): Promise<void> => {
    await api.delete(`/sketches/${id}`);
  },
};

export default api;