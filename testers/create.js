const { handler } = require("../handlers/meeting/create");
const { readJSON, writeJSON } = require("../data/meeting");

(async () => {
    const eventData = {
        arguments: {
            eventId: "olVYX2q4SOBUScjFVCGhx",
            type: "Meeting",
            meetingId: "23niteshlszCuxhMXU7UbhP",
            title: "Test Meeting",
            lastActionAt: "2022-07-27T14:48:21.905Z",
            lastActionById: 8140810,
            lastActionType: "ACCEPT",
            optionalParticipantIds: [8140758],
            organizerId: 8140810,
            requiredParticipant: { id: 12884602, itemType: "USER" },
            status: "ACCEPTED",
            startTime: "2022-12-11T07:15:00.000Z",
            endTime: "2022-12-11T07:30:10.000Z",
        }
    };
    const response = await handler(eventData);
    console.log(JSON.stringify(response));
    writeJSON("./z_responses/newUserStatus.json", response);
})();


