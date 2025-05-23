
const Message = require("./models/message");

async function getAllMessages() {
    try {
        const messages = await Message.find({}); // An empty object {} as the query finds all documents
        // console.log('All messages:', messages);
        return messages;
    } catch (error) {
        console.error('Error fetching all messages:', error.message);
        throw error;
    }
}

module.exports = getAllMessages;