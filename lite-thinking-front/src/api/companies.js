import {backentApi} from './backendApi';

const endpoint = '/companies';

export const getCompanies = async () => {
	const response = await backentApi.get(endpoint).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const getCompany = async (id) => {
	const response = await backentApi.get(`${endpoint}/${id}`).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const insertCompany = async (company) => {
	const response = await backentApi.post(endpoint, company).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const updateCompany = async (id, company) => {
	const response = await backentApi.put(`${endpoint}/${id}`, company).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const deleteCompany = async (id) => {
	const response = await backentApi.delete(`${endpoint}/${id}`).catch((error) => {
		console.log(error);
	});
	return response.data;
};
