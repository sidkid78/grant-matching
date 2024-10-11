import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Notification {
  id: number;
  grant_id: number;
  message: string;
  created_at: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await axios.post(`${API_URL}/notifications/${notificationId}/read`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};