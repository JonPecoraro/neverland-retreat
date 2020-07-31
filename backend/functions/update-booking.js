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
    UpdateExpression: "SET checkinDate = :checkinDate, checkoutDate = :checkoutDate, bookingPrice = :bookingPrice, guestName = :guestName, guestEmail = :guestEmail, guestComments = :guestComments, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":checkinDate": data.checkinDate || null,
      ":checkoutDate": data.checkoutDate || null,
      ":bookingPrice": data.bookingPrice || null,
      ":guestName": data.guestName || null,
      ":guestEmail": data.guestEmail || null,
      ":guestComments": data.guestComments || null,
      ":updatedAt": Date.now()
    },
    // Return all attributes of the item after an update
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});
