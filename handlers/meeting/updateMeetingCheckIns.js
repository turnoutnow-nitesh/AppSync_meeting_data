const { updateMeetingCheckIns } = require("../../data/meeting");

exports.handler2 = async (meeting, context) => {
    try {
        // Fetch user properties that are available in meeting object
        const { meetingId, checkIns } = meeting.arguments;

        // Attempt user update
        return await updateMeetingCheckIns(meetingId, checkIns);
    } catch (error) {
        console.error(error);
        throw error;
    }
};