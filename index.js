const express = require("express");
const crypto = require("node:crypto");
const { generateRegistrationOptions } = require("@simplewebauthn/server");
const { verifyRegistrationResponse } = require("@simplewebauthn/server");
const { generateAuthenticationOptions } = require("@simplewebauthn/server");
const { verifyAuthenticationResponse } = require("@simplewebauthn/server");

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}
const PORT = 3000;
const app = express();

app.use(express.static("./public"));

app.use(express.json());

// these are states to store user
const userStore = {};
const challengeStore = {};

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

app.post("/register-challenge", async (req, res) => {
  const { userId } = req.body;
  if (!userStore[userId]) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = userStore[userId];

  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "My Localhost Machine",
    attestationType: "none",
    userName: user.username,
    timeout: 30_000,
  });

  challengeStore[userId] = challengePayload.challenge;
  return res.json({ options: challengePayload });
});

app.post("/register-verify", async (req, res) => {
  const { userId, cred } = req.body;

  if (!userStore[userId])
    return res.status(404).json({ error: "user not found!" });

  const user = userStore[userId];
  const challenge = challengeStore[userId];

  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: cred,
  });

  console.log("verificationResult", verificationResult);

  if (!verificationResult.verified)
    return res.json({ error: "could not verify" });
  
  userStore[userId].passkey = verificationResult.registrationInfo;
  return res.json({ verified: true });
});

app.post("/login-challenge", async (req, res) => {
  const { userId } = req.body;
  if (!userStore[userId]) {
    return res.status(404).json({ message: "User not found" });
  }

  const opts = await generateAuthenticationOptions({
    rpID: 'localhost',
})

  challengeStore[userId] = opts.challenge;
  console.log("oprions in login challenge", opts);
  return res.json({ options: opts  });
});

app.post("/login-verify", async (req, res) => {
  const { userId, cred } = req.body;

  if (!userStore[userId])
    return res.status(404).json({ error: "user not found!" });

  const user = userStore[userId];
  const challenge = challengeStore[userId];

  const passkey = user.passkey;

  console.log("cred", cred);
  console.log("user", user);
  console.log("userId", userId);

  console.log("passkey", passkey);

  
    const result = await verifyAuthenticationResponse({
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      response: cred,
      authenticator: passkey.credentials,
      counter: 0,
      requireUserVerification: true
    });
   



  if (!result.verified) return res.json({ error: "something went wrong" });

  // // Login the user: Session, Cookies, JWT
  return res.json({ success: true, userId });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
