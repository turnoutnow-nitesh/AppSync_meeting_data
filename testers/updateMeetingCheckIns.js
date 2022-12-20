const { handler } = require("../handlers/meeting/getMeetingInfo");
const { handler2 } = require("../handlers/meeting/updateMeetingCheckIns");
const { readJSON, writeJSON } = require("../data/meeting");

(async () => {
    const meetingData = readJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/samples/getMeetingInfo.json");
    const checkInData = readJSON("d:/workarea/turnoutnow/github/Assignments/Appsync/samples/updateMeetingCheckIns.json");
    // const meetingData = readJSON("../samples/getMeetingInfo.json");
    // const checkInData = readJSON("../samples/updateMeetingCheckIns.json");
    const response = await handler(meetingData);
    let sampleValues = checkInData.arguments.checkIns;
    let checkIns = response.checkIns ? response.checkIns : [];
    let obj = {};
    let updatedCheckIns = [];

    for (let item of checkIns) {
        obj[item.userId] = item;
    }

    if (checkIns && checkIns.length > 0) {
        for (let item of sampleValues) {
            if (obj[item.userId]) {
                if (item.checkInStatus != obj[item.userId].checkInStatus) {
                    obj[item.userId].checkInStatus = item.checkInStatus;
                    obj[item.userId].checkInAt = item.checkInAt;
                }
            } else {
                obj[item.userId] = item;
            }

        };
        updatedCheckIns = Object.values(obj);
    } else {
        updatedCheckIns = sampleValues
    };

    checkInData.arguments.checkIns = updatedCheckIns;
    const result = await handler2(checkInData);
    console.log(JSON.stringify(result));
    writeJSON("./z_responses/updatedMeetingCheckInsStatus.json", result);
})();

