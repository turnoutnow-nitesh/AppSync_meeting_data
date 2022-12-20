exports.readJSON = (filename) => JSON.parse(fs.readFileSync(filename, "utf8"));
exports.writeJSON = (filename, data) => fs.writeFileSync(filename, JSON.stringify(data));
const fs = require("fs");
const {
    DynamoDBClient,
    GetItemCommand,
    QueryCommand,
    PutItemCommand,
    UpdateItemCommand,
    BatchGetItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
let dynamoDbclient;

const initDynamoDBClient = () => {

    if (!dynamoDbclient) {
        dynamoDbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    }
};

exports.getMeetingInfo = async (meetingId) => {
    initDynamoDBClient();
    // Set the input parameters
    const input = {
        // TableName: process.env.DYNAMODB_TABLE_NAME,
        TableName: "onboarding",
        Key: marshall({
            "PK": `MEETING#${meetingId}`,
            "SK": `MEETING#${meetingId}`,
        })
    };
    // Retrieve the item from DynamoDB
    const result = await dynamoDbclient.send(new GetItemCommand(input));
    if (result && result.Item) {
        return unmarshall(result.Item);
    }
};

exports.getMeetingList = async (eventId) => {
    initDynamoDBClient();
    console.log("eventId", eventId)
    const input = {
        // TableName: process.env.DYNAMODB_TABLE_NAME,
        TableName: "onboarding",
        IndexName: "GSI1PK-GSI1SK-index",
        ScanIndexForward: true,
        KeyConditionExpression: "#GSI1PK = :GSI1PK",
        // KeyConditionExpression: "#GSI1PK = :GSI1PK AND begins_with(#GSI1SK, :GSI1SK)",
        ExpressionAttributeNames: {
            "#GSI1PK": "GSI1PK",
            // "#GSI1SK": "GSI1SK",
        },
        ExpressionAttributeValues: marshall({
            ":GSI1PK": `EVENT#${eventId}#MEETING`,
            // ":GSI1SK": "ACCEPTED#"
            // ":GSI1SK": "CANCELED#"
            // ":GSI1SK": "PENDING#"
        })
    };
    // Retrieve the items from DynamoDB
    const result = await dynamoDbclient.send(new QueryCommand(input));
    if (result && result.Items?.length > 0) {
        return result.Items.map(Item => unmarshall(Item));
    }
};
exports.getMeetingsDetail = async (eventId, ids) => {
    initDynamoDBClient();

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const allUsers = [];
        const batchSize = 100;
        do {
            const batch = ids.splice(0, batchSize);

            const input = {
                RequestItems: {
                    ["onboarding"]: {
                        Keys: batch.map(id => marshall({
                            "PK": `EVENT#${eventId}#USER#${id}`,
                            "SK": `EVENT#${eventId}#USER#${id}`
                        })),
                        ProjectionExpression: "id, firstName, email, lastName, jobTitle, company, profileImageUrl"
                    }
                }
            };
            // Retrieve the item from DynamoDB
            const result = await dynamoDbclient.send(new BatchGetItemCommand(input));
            const users = result?.Responses && result.Responses["onboarding"];
            if (users && users.length > 0) {
                // Add user from this batch to the list of all users
                allUsers.push(...users.map(user => unmarshall(user)));
            }
        }
        while (ids.length > 0);     // Loop through the list of original ids until none are left to fetch

        // Return the list of all users to the caller
        return allUsers;
    }
};

exports.createMeeting = async (meetingId, eventId, status) => {

    initDynamoDBClient();

    const input = {
        // TableName: process.env.DYNAMODB_TABLE_NAME,
        TableName: "onboarding",
        // Create meeting record
        Item: marshall({
            "PK": `MEETING#${meetingId}`,
            "SK": `MEETING#${meetingId}`,
            "type": "Meeting",
            "GSI1PK": `EVENT#${eventId}#MEETING`,
            "GSI1SK": `${status}#${meetingId}`,
            "meetingId": meetingId,
            "eventId": eventId,
            "title": "Test Meeting",
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()
        })
    };

    return await dynamoDbclient.send(new PutItemCommand(input));
};


exports.updateMeeting = async (meetingId, status, title, type) => {
    initDynamoDBClient();

    const input = {
        // TableName: process.env.DYNAMODB_TABLE_NAME,
        TableName: "onboarding",
        Key: marshall({
            "PK": `MEETING#${meetingId}`,
            "SK": `MEETING#${meetingId}`
        }),
        UpdateExpression: "SET #status = :status, #title = :title, #type = :type, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
            "#status": "status",
            "#title": "title",
            "#type": "type",
            "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: marshall({
            ":status": status,
            ":title": title,
            ":type": type,
            ":updatedAt": new Date().toISOString()
        })
    };

    return await dynamoDbclient.send(new UpdateItemCommand(input));
};

exports.updateMeetingCheckIns = async (meetingId, checkIns) => {
    initDynamoDBClient();

    const input = {
        // TableName: process.env.DYNAMODB_TABLE_NAME,
        TableName: "onboarding",
        Key: marshall({
            "PK": `MEETING#${meetingId}`,
            "SK": `MEETING#${meetingId}`
        }),
        UpdateExpression: "SET #checkIns = :checkIns, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
            "#checkIns": "checkIns",
            "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: marshall({
            ":checkIns": checkIns,
            ":updatedAt": new Date().toISOString()
        })
    };

    return await dynamoDbclient.send(new UpdateItemCommand(input));
};