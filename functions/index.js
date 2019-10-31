const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
const uuidv5 = require('uuid/v5');

const app = express();
app.use(cors());

//Import and initialize firebase realtime database
const admin = require('firebase-admin');
admin.initializeApp();

app.post('/', async (req, res) => {
    const entry = req.body

    await admin.database().ref('/entries/').push(entry)
        .then(() => {
            return res.status(200).json({
                status: true,
                data: entry,
                message: 'Data saved successfully'
            })
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: 'Error' + error
            })
        })
})

exports.entries = functions.https.onRequest(app)


exports.onMessageCsreate = functions.database
    .ref('/entries/{entryId}')
    .onCreate((snapshot, context) => {
        // const entryId = context.params.pushId
        // console.log(entryId);

        const messageData = snapshot.val()
        messageData.uid = uuidv5('hello.example.com', uuidv5.DNS);
        return snapshot.ref.update(messageData)
    })
