import AWS from 'aws-sdk';
import {getArticle} from '../../services/articleService';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

const deleteArticle = async (event, context) => {
	const {id} = event.pathParameters;

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

	return {
		statusCode: 200,
		body: JSON.stringify(article)
	};
};

export const handler = commonMiddleware(deleteArticle);
