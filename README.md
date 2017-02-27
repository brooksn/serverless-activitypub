[![Build Status](https://travis-ci.org/brooksn/serverless-activitypub.svg?branch=master)](https://travis-ci.org/brooksn/serverless-activitypub)

# serverless-activitypub
An implementation of an [ActivityPub](https://www.w3.org/TR/activitypub) conformant Server.

## Progress

- [x] Social API protocol
- [ ] Notification filtering and delivery
- [ ] Uploading media
- [ ] Federated Server conformance
- [ ] Actor trust (possibly with [Vouch](https://indieweb.org/Vouch))
- [ ] Server-to-server authentication
- [ ] Validation against Federation Protocol test suite
- [ ] Account administration through a web client
- [ ] Express.js server support for deployment on more platforms

## Deploy

```bash
$ npm install serverless -g
$ npm install
$ JWT_SECRET="some_secret" API_BASE="https://example.com/ap" serverless deploy 
```
