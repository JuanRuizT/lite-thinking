import AWS from "aws-sdk";
import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";
import { getArticleById } from "../../lib/getArticleById";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

const updateArticle = async (event, context) => {
  const { companyId, code, name, amount } = event.body;
  await getCompanyById(companyId);
  const { id } = event.pathParameters;
  await getArticleById(id);

  const article = {
    id,
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

export const handler = commonMiddleware(updateArticle);
