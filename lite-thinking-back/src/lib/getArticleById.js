import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE_NAME;

const getArticleByIdentifier = async (id) => {
  let article;

  try {
    const result = await dynamodb
      .get({
        TableName: tableName,
        Key: { id },
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

export const getArticleById = getArticleByIdentifier;
