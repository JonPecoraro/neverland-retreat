import handler from "../libs/handler-lib";
import httpGet from "../libs/http-lib";

export const main = handler(async (event, context) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    throw new Error("Calendar URL not present in the \"url\" parameter.");
  }

  const calendarData = await httpGet(url);
  return calendarData;
});
