import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.COMPANIES_TABLE_NAME;

export const getCompany = async (id) => {
	let company;

	try {
		const result = await dynamodb
			.get({
				TableName: tableName,
				Key: {id}
			})
			.promise();

		company = result.Item;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}

	if (!company) {
		throw new createError.NotFound(`Company with ID "${id}" not found!`);
	}

	return company;
};
