import AWS from 'aws-sdk';
import createError from 'http-errors';
import {getCompany} from './companyService';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

export const getArticle = async (id) => {
	let article;

	try {
		const result = await dynamodb
			.get({
				TableName: tableName,
				Key: {id}
			})
			.promise();

		article = result.Item;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}

	if (!article) {
		throw new createError.NotFound(`Article with ID "${id}" not found!`);
	}

	return article;
};

export const getArticlesByCompanyId = async (companyId) => {
	await getCompany(companyId);

	let articles = [];

	try {
		const result = await dynamodb
			.query({
				TableName: tableName,
				IndexName: 'companyId',
				KeyConditionExpression: '#companyId = :userIdValue',
				ExpressionAttributeValues: {':userIdValue': companyId},
				ExpressionAttributeNames: {'#companyId': 'companyId'}
			})
			.promise();
		articles = result.Items;
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return articles;
};

export const createArticle = async (article) => {
	await getCompany(article.companyId);

	try {
		await dynamodb
			.put({
				TableName: tableName,
				Item: article
			})
			.promise();
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return article;
};

export const updateArticle = async (id, article) => {
	await getArticle(id);
	await getCompany(article.companyId);

	try {
		await dynamodb
			.put({
				TableName: tableName,
				Item: article
			})
			.promise();
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return article;
};

export const deleteArticle = async (id) => {
	const article = await getArticle(id);

	try {
		await dynamodb
			.delete({
				TableName: tableName,
				Key: {id}
			})
			.promise();
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}

	return article;
};