import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.COMPANIES_TABLE_NAME;

export const getCompanies = async () => {
	let companies = [];

	try {
		const result = await dynamodb
			.scan({
				TableName: tableName
			})
			.promise();
		companies = result.Items;
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return companies;
};

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

export const createCompany = async (company) => {
	try {
		await dynamodb
			.put({
				TableName: tableName,
				Item: company
			})
			.promise();
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return company;
};

export const updateCompany = async (id, company) => {
	await getCompany(id);

	try {
		await dynamodb
			.put({
				TableName: tableName,
				Item: company
			})
			.promise();
	} catch (error) {
		console.log(error);
		throw new createError.InternalServerError(error);
	}

	return company;
};

export const deleteCompany = async (id) => {
	const company = await getCompany(id);

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

	return company;
};
