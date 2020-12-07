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
  // private_key_id: "65a36d6ff45a70f7cb501e1a29bdc9cce9725356",
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  // private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChLg/n4dj2Svds\nDb+LjK/xMsIa9nRVn2tgkN1vwjnJwr4ZEykKP0oO61y3iXta4aPBPQlCMRCoUsQ5\nZbF5ZMoArV30XVypFJk79Ldt4czJqO/qmQB45XLWZ3+3zHcpXr685v7s6EQ3eRIG\n6hs3v8qdeRr6ZXap0ujfIrzRNJrKC2TcPiY9ouE+/WZo3NuDP3eTdNEClhiq/sJS\nA6kaWxb6rFg4NWPwrCK0ngDt6gc98O78AMVuDcZEUy4gJ8fpu85GW81vucvlYwI6\n97oK2yiprZAF5L82Doqkm1FxEmu7rnYtqPldEXTUsoI40V41/XNk21W4CP75AQQB\nMf9JGZ2hAgMBAAECggEABmsLeRlWMWCE1QmrHJx1ORk4qigxiQ34ZveodFXQmpx6\n7gwERgMv025DL+Uf7gYu0M1kZqgGLh21m0TVugFtxcnMLvnfbGAvReLrFvYMgzng\nln/nM+k3Fxs3S74EP2J6x+eO3nzVPTxAn9kx95ishx7BGJgdDzV1zm+CA0v2n0r1\nTTYkc3AA3d8PGJpQShDfC7yCgvtXvW6PoNWNByCndJvJGN+0DNW+lIR6B/1ylETu\noILsFA9JSISH8moGZPwqF5Sxz3/v/9DFlQWqcfgCzGUGWRvFyXuIK3Cd1w6T/0DB\nxDawTAzW5Y1r0KBQVeCfMsrS32crqN3GMm2UhsHq0QKBgQDa5GngG3y0vSLqjbK2\nysgoIXYIN7y93mAzTzT8cnOqf6EZTF3hzmY8kNvcQhcesBj5MgwV09mbih8s5TAo\nBLZnpPCfkEqKMbTo2KodO470K6g9S9xfgHIHnZ0CSNisz3qTYToaKXMBzkkKbBH2\n6DE775F3U8SgXN3vJJp0h8nuDQKBgQC8gQXpT0MEZd7WAfAlZxhoNEVCST6mjVmf\nlVBOe1V2wUpRdldmvqjWhD9TjGLLFmB9BVk+I4lIAxt3vJaw5acnrWhLxfRCemn7\nH/+DqtvoMtSggR/tZs7vXJZlr5+hYSAiRSVIKHznyYcwHnt92O+W5f/nZPMS6IML\n8p7F39dc5QKBgD/HvnHmkHe5hKsDjsdkXt4SoenTE9PfL/jDY5ULZFiRx8cvUUuy\ncGfFbcrIFySB+0ThKFRT3lxL6rmSLm36sYuRq+tSh+WshiIyv5608/qBngv+RsAt\nFQzTCCTaRQhVjEnVUrC80x37lZzL0JA5J99m9uPmLKztYl2ENN0vk88hAoGBAJ98\nKhwzS2g1KEu4aA29JBFF6DMk9TTE8sbp9X/xKWXIM7Coh1oOhZq5WTq+0/cvf4NH\nOzIvrr6Wom6zyGryYnJXbJ5vZTG5kGE/uVcU/+l82BjUJscc7Ifntfdil5RaMG3O\nQrTCTKtu/kngAGuBV3Q8ND76Ug31WqqJI3wW3odhAoGAIReUy4QIGyM00LuUe+wi\nsKW/xBJuAdtMQiekM6JEnNjSMpgX+c0y9rFzJo+O0lSzXvYQEmnCvWeZQLx6Eh92\ncI2djqxLld8AQaIrmgA8d2YerBw1xerVA+17x5JgpXoPkCkCDe3nWsDV8Q1z5+Do\njJ+HlYQbnGcyFs778+7e0Qg=\n-----END PRIVATE KEY-----\n",
  client_email: process.env.CLIENT_EMAIL,
  // client_email: "admin-812@dialogapi-297908.iam.gserviceaccount.com",
  client_id: process.env.CLIENT_ID,
  // client_id: "106196209671001091101",
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
          res.send(listIntents);
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
