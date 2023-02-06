import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

const createArticle = async (event, context) => {
  const { companyId, code, name, amount } = event.body;

  await getCompanyById(companyId);

  const article = {
    id: uuid(),
    companyId,
    code,
    name,
    amount,
  };

  try {
    await dynamodb
      .put({
        TableName: tableName,
        Item: article,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(article),
  };
};

export const handler = commonMiddleware(createArticle);
