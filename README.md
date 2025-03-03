# Simple WebAuthn with Node.js and Express

This project implements WebAuthn authentication using Node.js and Express. It allows users to register and authenticate using passkeys.

## Features
- User registration with username and password
- WebAuthn-based passkey registration and authentication
- Frontend with basic signup and login pages
- Uses `@simplewebauthn/server` for WebAuthn operations

## Prerequisites
- Node.js installed

## Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/to-abhinav/webauth-passkey.git
cd /webauth-passkey
npm install
```

## Running the Server
Start the Express server:

```sh
node index.js
```
The server will run on `http://localhost:3000`.

## Usage
### 1. Register a User
- Open `http://localhost:3000/signup.html`
- Enter a username and password, then submit the form

### 2. Register a Passkey
- After signing up, you will be redirected to `profile.html`
- Click the "Register a Passkey" button to generate a WebAuthn credential

### 3. Login with Passkey
- Open `http://localhost:3000/login.html`
- Enter the user ID and click "Login"
- Authenticate using the registered passkey

## API Endpoints
- `POST /register`: Registers a new user
- `POST /register-challenge`: Generates WebAuthn challenge for registration
- `POST /register-verify`: Verifies passkey registration
- `POST /login-challenge`: Generates WebAuthn challenge for login
- `POST /login-verify`: Verifies user authentication

## Dependencies
- `express`
- `@simplewebauthn/server`

## License
This project is licensed under the MIT License.

