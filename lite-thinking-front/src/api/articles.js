import {backentApi} from './backendApi';

const endpoint = '/articles';

export const getArticlesByCompanyId = async (companyId) => {
	const response = await backentApi
		.get(endpoint, {
			params: {
				companyId
			}
		})
		.catch((error) => {
			console.log(error);
		});
	return response.data;
};

export const insertArticle = async (article) => {
	const response = await backentApi.post(endpoint, article).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const updateArticle = async (id, article) => {
	const response = await backentApi.put(`${endpoint}/${id}`, article).catch((error) => {
		console.log(error);
	});
	return response.data;
};

export const deleteArticle = async (id) => {
	const response = await backentApi.delete(`${endpoint}/${id}`).catch((error) => {
		console.log(error);
	});
	return response.data;
};
