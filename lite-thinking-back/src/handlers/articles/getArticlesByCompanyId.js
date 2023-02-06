import AWS from "aws-sdk";
import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

const getArticlesByCompanyId = async (event, context) => {
  const { companyId } = event.queryStringParameters;
  await getCompanyById(companyId);

  let articles = [];

  try {
    const result = await dynamodb
      .query({
        TableName: tableName,
        IndexName: "companyId",
        KeyConditionExpression: "#companyId = :userIdValue",
        ExpressionAttributeValues: { ":userIdValue": companyId },
        ExpressionAttributeNames: { "#companyId": "companyId" },
      })
      .promise();
    articles = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(articles),
  };
};

export const handler = commonMiddleware(getArticlesByCompanyId);
