import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      pk: 'amenity',
      sk: event.pathParameters.id
    },
    UpdateExpression: "SET amenityName = :amenityName, description = :description, icon = :icon, sortOrder = :sortOrder, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":amenityName": data.amenityName || null,
      ":description": data.description || null,
      ":icon": data.icon || null,
      ":sortOrder": data.sortOrder || null,
      ":updatedAt": Date.now()
    },
    // Return all attributes of the item after an update
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});
