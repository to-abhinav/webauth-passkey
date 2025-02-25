const express = require("express");
const crypto = require("node:crypto");
const { generateRegistrationOptions } = require("@simplewebauthn/server");
const { verifyRegistrationResponse } = require("@simplewebauthn/server");


if(!globalThis.crypto) {
  globalThis.crypto = crypto;
}
const PORT = 3000;
const app = express();

app.use(express.static("./public"));

app.use(express.json());

// these are states to store user
const userStore = {};
const challangeStore = {};

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const id = `user_${Date.now()}`;

  const user = {
    id,
    username,
    password,
  };

  userStore[id] = user;
  console.log("Registered User Successfully", userStore[id]);
  return res.json({ id });
});

app.post("/register-challange", async (req, res) => {
  const { userId } = req.body;
  if (!userStore[userId]) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = userStore[userId];

  const challagePayLoad = await generateRegistrationOptions({
    rpId: "localhost",
    rpName: "My LoacalHost Machine || webauth",
    userName: user.username,
  });

  challangeStore[userId] = challagePayLoad.challenge;
  return res.json({ options: challagePayLoad });
});


app.post("/verify-registration", (req,res)=>{
  const {userId ,cred} =req.body;
})
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
