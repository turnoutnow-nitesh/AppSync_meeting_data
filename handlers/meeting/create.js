const { createMeeting } = require("../../data/meeting");
const ULID = require("ulid");

exports.handler = async (event, context) => {
    try {
        // Fetch user properties that are available in event object
        const { eventId, type, meetingId, title, lastActionAt, lastActionById, lastActionType, optionalParticipantIds, organizerId, requiredParticipant, status, startTime, endTime } = event.arguments;

        // Attempt user creation
        return await createMeeting(eventId, type, meetingId, title, lastActionAt, lastActionById, lastActionType, optionalParticipantIds, organizerId, requiredParticipant, status, startTime, endTime);
    } catch (error) {
        console.error(error);
        throw error;
    }
};