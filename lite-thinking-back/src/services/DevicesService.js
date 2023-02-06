const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const DEVICES_TABLE = "IoTDevices-dev";

export const getRecordsByUserId = async (userId) => {
  const params = {
    TableName: DEVICES_TABLE,
    IndexName: "userId",
    KeyConditionExpression: "#userId = :userIdValue",
    ExpressionAttributeValues: { ":userIdValue": userId },
    ExpressionAttributeNames: { "#userId": "userId" },
  };
  try {
    let data = await dynamo.query(params).promise();
    data.Items.forEach((record) => {
      delete record.states;
      delete record.userId;
    });
    return data.Items;
  } catch (err) {
    console.log(JSON.stringify(err));
    return err;
  }
};

export const getRecordById = async (id) => {
  const params = {
    TableName: DEVICES_TABLE,
    Key: {
      id,
    },
  };
  try {
    const data = await dynamo.get(params).promise();
    return data;
  } catch (err) {
    console.log(JSON.stringify(err));
    return err;
  }
};

export const updateRecordStateById = async (id, states) => {
  let params = {
    TableName: DEVICES_TABLE,
    Key: {
      id,
    },
    UpdateExpression: "set states = :states",
    ExpressionAttributeValues: {
      ":states": states,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    const data = await dynamo.update(params).promise();
    return data;
  } catch (err) {
    console.log(JSON.stringify(err));
    return err;
  }
};
