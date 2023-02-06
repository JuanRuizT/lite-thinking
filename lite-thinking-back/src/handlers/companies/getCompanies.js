import AWS from "aws-sdk";
import commonMiddleware from '../../lib/commonMiddleware';
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.COMPANIES_TABLE_NAME;

const getCompanies = async (event, context) => {
  let companies = [];

  try {
    const result = await dynamodb
      .scan({
        TableName: tableName,
      })
      .promise();
    companies = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(companies),
  };
};

export const handler = commonMiddleware(getCompanies);
