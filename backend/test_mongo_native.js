const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://mrmohit1540_db_user:rambhajan1540@cluster0.ezh4zrn.mongodb.net/?appName=Cluster0';
const client = new MongoClient(url);

async function main() {
    // Use connect method to connect to the server
    console.log('Attempting to connect to MongoDB...');
    try {
        await client.connect();
        console.log('Connected successfully to server!');
        const db = client.db('test');
        console.log('Database reference obtained.');
        await client.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

main();
