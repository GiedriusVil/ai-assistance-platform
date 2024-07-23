
# ACA Middleware - Outgoing - DelayWare

Delays messages to a client by DELAY so that they arrive in order.
Meant to be used as outgoingWare.

## Configuration variables

- `RESPONSE_FIRST_DELAY` - used by `DelayWare` for the min wait time in milliseconds between the server timestamp of an incoming update and sending the first outgoing update. Defaults to 6000 milliseconds.
- `RESPONSE_SUBSEQUENT_DELAY` - used by `DelayWare` for the wait time in milliseconds between cascaded messages. Defaults to 1000 milliseconds.
