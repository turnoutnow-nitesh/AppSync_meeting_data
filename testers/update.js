const { handler } = require("../handlers/meeting/update");
const { readJSON, writeJSON } = require("../data/meeting");

(async () => {
    const eventData = readJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/samples/update.json");
    // const eventData = readJSON("./samples/update.json");
    const response = await handler(eventData);
    console.log(JSON.stringify(response));
    writeJSON("./z_responses/updatedMeetingStatus.json", response);
})();