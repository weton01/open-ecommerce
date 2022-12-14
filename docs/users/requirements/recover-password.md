# Recover Password Use Case

## Description

Ensure that the use case can send dynamic notifications that have
the access_token and client url to refactor the password

> ## Data

- email

> ## Primary Flow

1. ❌ Create a new JWToken
2. ❌ Send the token and client_url to dynamic notifications
3. ❌ Returns ok

> ## Altenative flow 1.1: E-mail not found

1. ❌ Validate if e-mail not found in database
2. ❌ Returns not found status code

> ## Altenative flow 1.2: Error on notification service

1. ❌ Throw Internal Server Error

> ## Altenative flow 1.3: Error on Jwt Adapter

1. ❌ Throw Internal Server Error
