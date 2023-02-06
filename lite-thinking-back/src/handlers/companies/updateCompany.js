import AWS from "aws-sdk";
import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.COMPANIES_TABLE_NAME;

const updateCompany = async (event, context) => {
  const { nit, name, address, phone } = event.body;

  const { id } = event.pathParameters;
  await getCompanyById(id);

  const company = {
    id,
    nit,
    name,
    address,
    phone,
  };

  try {
    await dynamodb
      .put({
        TableName: tableName,
        Item: company,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(company),
  };
};

export const handler = commonMiddleware(updateCompany);
