import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      pk: 'calendar',
      sk: event.pathParameters.id
    }
  };

  await dynamoDb.delete(params);

  return { status: true };
});
