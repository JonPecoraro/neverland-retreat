import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      pk: 'booking',
      sk:  uuid.v1(),
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      bookingPrice: data.bookingPrice,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestComments: data.guestComments,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});
