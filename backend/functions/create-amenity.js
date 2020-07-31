import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      pk: 'amenity',
      sk:  uuid.v1(),
      amenityName: data.amenityName,
      description: data.description,
      icon: data.icon,
      type: data.type, // valid values: [condo, community]
      sortOrder: data.sortOrder,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});
