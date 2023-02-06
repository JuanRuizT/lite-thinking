import AWS from "aws-sdk";
import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.COMPANIES_TABLE_NAME;

const deleteCompany = async (event, context) => {
  const { id } = event.pathParameters;

  const company = await getCompanyById(id);

  try {
    await dynamodb
      .delete({
        TableName: tableName,
        Key: { id },
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(company),
  };
};

export const handler = commonMiddleware(deleteCompany);
