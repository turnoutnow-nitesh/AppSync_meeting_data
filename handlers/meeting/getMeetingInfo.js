const { getMeetingInfo } = require("../../data/meeting");

exports.handler = async (meeting, context) => {
    try {
        const { meetingId } = meeting.arguments;

        return await getMeetingInfo(meetingId);
    } catch (error) {
        console.error(error);
        throw error;
    }
};