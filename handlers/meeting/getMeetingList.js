const { getMeetingList } = require("../../data/meeting");

exports.handler = async (event, context) => {
    try {
        const { eventId } = event.arguments;
    
        return await getMeetingList(eventId);
    } catch (error) {
        console.error(error);
        throw error;
    }
};