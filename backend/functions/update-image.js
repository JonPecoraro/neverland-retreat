import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      pk: 'image',
      sk: event.pathParameters.id
    },
    UpdateExpression: "SET imageName = :imageName, imageUrl = :imageUrl, thumbnailUrl = :thumbnailUrl, description = :description, sortOrder = :sortOrder, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":imageName": data.imageName || null,
      ":imageUrl": data.imageUrl || null,
      ":thumbnailUrl": data.thumbnailUrl || null,
      ":description": data.description || null,
      ":sortOrder": data.sortOrder || 0,
      ":updatedAt": Date.now()
    },
    // Return all attributes of the item after an update
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});
