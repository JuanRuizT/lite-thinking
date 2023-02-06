import axios from 'axios';

export const backentApi = axios.create({
	baseURL: 'https://nrgkildf03.execute-api.us-east-2.amazonaws.com/dev'
});
