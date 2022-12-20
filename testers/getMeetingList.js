const { handler } = require("../handlers/meeting/getMeetingList");
const { readJSON, writeJSON } = require("../data/meeting");

(async () => {
    const eventData = readJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/samples/getMeetingList.json");
    // const eventData = readJSON("./samples/getMeetingList.json");
    const response = await handler(eventData);
    console.log(JSON.stringify(response));
    writeJSON("./z_responses/meetingList.json", response);
})();