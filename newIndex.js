const express = require("express");
const crypto = require("node:crypto");
const { generateRegistrationOptions } = require("@simplewebauthn/server");
const { verifyRegistrationResponse } = require("@simplewebauthn/server");

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

  const options = await generateRegistrationOptions({
    rpName: "My Localhost Machine",
    rpID: "localhost",
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    // Prevent users from re-registering existing authenticators
    // excludeCredentials: userPasskeys.map(passkey => ({
    //   id: passkey.id,
    //   // Optional
    //   transports: passkey.transports,
    // })),
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      // Defaults
      residentKey: "preferred",
      userVerification: "preferred",
      // Optional
      authenticatorAttachment: "platform",
    },
  });
});
