const { updateMeeting } = require("../../data/meeting");

exports.handler = async (meeting, context) => {
    try {
        // Fetch user properties that are available in meeting object
        const {meetingId,status, title, type} = meeting.arguments;

        // Attempt user update
        return await updateMeeting(meetingId,status, title, type);
    } catch (error) {
        console.error(error);
        throw error;
    }
};