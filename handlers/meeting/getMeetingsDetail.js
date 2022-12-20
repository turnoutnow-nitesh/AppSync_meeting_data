const { getMeetingsDetail } = require("../../data/meeting");

exports.handler2 = async (event, context) => {
    try {
        const { eventId, ids } = event.arguments;

        return await getMeetingsDetail(eventId, ids);
    } catch (error) {
        console.error(error);
        throw error;
    }
};