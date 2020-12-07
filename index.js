var admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
// const dotenv = require("dotenv")
// dotenv.config();

const { SessionsClient, IntentsClient } = require("dialogflow");
var serviceAccount = {
  type: "service_account",
  project_id: "dialogapi-297908",
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), 
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/admin-812%40dialogapi-297908.iam.gserviceaccount.com",
};
// console.log(serviceAccount)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dialogapi-297908.firebaseio.com",
});

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  return res.status(200).send();
});

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

app.post("/query", async (req, res) => {
  const { queryInput, sessionId } = req.body;
  const sessionClient = new SessionsClient({ credentials: serviceAccount });
  const session = sessionClient.sessionPath("dialogapi-297908", sessionId);
  const responses = await sessionClient.detectIntent({ session, queryInput });
  const result = responses[0].queryResult;
  res.send(result);
});

app.get("/getAllIntents", async (req, res) => {
  // const { queryInput, sessionId } = req.body;
  const intent = new IntentsClient({ credentials: serviceAccount });
  intent
    .getProjectId()
    .then((id) => {
      intent
        .listIntents({
          parent: `projects/${id}/agent`,
        })
        .then((listIntents) => {
          res.send(listIntents[0]);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

server = http.createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () =>
  console.log(`DialogFlow Server is running on port ${PORT}`)
);

// exports.app = functions.https.onRequest(app);
