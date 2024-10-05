import axios from 'axios';

export default function createRequest(BASE_URL: string) {
  return {
    async post<T>(endpoint: string, data?: any): Promise<T> {
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/${endpoint}`,
        data,
      });
      return response.data;
    },

    async get<T>(endpoint: string, queryParams?: any): Promise<T> {
      const response = await axios({
        method: 'get',
        url: `${BASE_URL}/${endpoint}`,
        params: queryParams,
      });
      return response.data;
    },
  };
}
