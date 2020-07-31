import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      pk: 'calendar',
      sk: event.pathParameters.id
    },
    UpdateExpression: "SET calendarName = :calendarName, calendarUrl = :calendarUrl, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":calendarName": data.calendarName || null,
      ":calendarUrl": data.calendarUrl || null,
      ":updatedAt": Date.now()
    },
    // Return all attributes of the item after an update
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});
