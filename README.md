# Audiobookshelf Socket Client Demo

This is just an example of establishing an authenticated socket connection for audiobookshelf.

On the server a user can have many socket clients. This means you can login as the same user in multiple browser windows and they will all receive events for that user.

The demo works like this:

1. Initialize the socket client
2. Login to the server using the audiobookshelf API
3. Emit a socket event 'auth' with the users API token

Once that is done the user will be linked to that socket connection and all events emitted from the server intended for that user will be received by the client.

**Note: if the socket gets disconnected and re-connects it will have a new socket id and needs to emit the 'auth' event again.**

## Installation

Node v16 or higher is required.

```bash
git clone advplyr/abs-socket-client-demo
cd abs-socket-client-demo
npm install
```

## Usage

First update the `config.json` with your server info.

For example if your server is running `https://abs.example.com` then your config would look like:
```json
{
  "protocol": "https",
  "hostname": "abs.example.com",
  "port": 443,
  "username": "root",
  "password": ""
}
```
Replace username/password with yours.

To run the demo make sure you are in the `abs-socket-client-demo` folder then..

```bash
npm run start
```
