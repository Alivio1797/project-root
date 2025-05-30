// src/models/storyModel.js
import { addItem, getAllItems, deleteItem } from '../utils/idb.js';

export default class StoryModel {
  constructor() {
    this.apiBase = 'https://story-api.dicoding.dev/v1';
    this.dbName = 'story-db';
    this.storeName = 'stories';
  }

  async getAllStories() {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${this.apiBase}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch stories');
    }

    const data = await response.json();
    return data.listStory.map(story => ({
      id: story.id,
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      lat: story.lat,
      lon: story.lon,
    }));
  }

  async addStory({ description, photoFile, lat, lon }) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    // Save local copy
    await addItem(this.dbName, this.storeName, { description, photoFile, lat, lon });

    // Also send to remote API
    const formData = new FormData();
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);
    formData.append('photo', photoFile);

    const response = await fetch(`${this.apiBase}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add story');
    }

    return await response.json();
  }

  async getStories() {
    return await getAllItems(this.dbName, this.storeName);
  }

  async deleteStory(id) {
    await deleteItem(this.dbName, this.storeName, id);
  }

  async saveStory({ description, photoFile, lat, lon }) {
    const story = {
      id: Date.now(),
      description,
      photoFile,
      lat,
      lon,
      created: new Date().toISOString(),
    };

    await addItem(this.dbName, this.storeName, story);
  }
}