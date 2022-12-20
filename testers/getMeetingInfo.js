const { handler } = require("../handlers/meeting/getMeetingInfo");
const { handler2 } = require("../handlers/meeting/getMeetingsDetail");
const { readJSON, writeJSON } = require("../data/meeting");
let args = "";

(async () => {
    const meetingData = readJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/samples/getMeetingInfo.json");
    // const meetingData = readJSON("./samples/getMeetingInfo.json");
    const response = await handler(meetingData);
    let items = [];
    if (response) {
        items.push({ "itemType": "USER", "id": response.organizerId });
        items.push({ "itemType": "USER", "id": response.requiredParticipant.id });
        if (response.optionalParticipantIds && response.optionalParticipantIds.length) {
            for (const partId of response.optionalParticipantIds) {
                items.push({ "itemType": "USER", "id": partId });
            }
        }
        let notes = [];
        if (response.notes) {
            for (let note of Object.values(response.notes)) {
                notes.push(note);
            };
        };
        response["notes"] = notes;
    };
    let ids = [];
    if (items && items.length > 0) {
        for (let item of items) {
            ids.push(item.id);
        }
    };
    args = {
        arguments: {
            eventId: response.eventId,
            ids: ids,
        },
    };
    const result = await handler2(args);
    response["organizer"] = result[0];
    response["requiredParticipant"] = result[1];
    response["optionalParticipantIds"] = result.slice(2, result.length);

    console.log(JSON.stringify(response));
    writeJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/z_responses/meetingInfoFullDetailupdated.json", response);
    // writeJSON("./z_responses/meetingInfoFullDetailupdated.json", response);
})();

