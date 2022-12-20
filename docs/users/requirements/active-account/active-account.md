# Active Account Use Case

## Description

Ensure that the use case can active the user by ID if the activationCode is true and return the user, refresh_token and access_token.

> ## Path Params

- email

> ## Data

- activationCode

> ## Primary Flow

1. ✅ Change user active to true
2. ✅ Create access_token and refresh_token
3. ✅ Remove password from user
4. ✅ Validate if user already active
5. ✅ Call NotificationService to send welcome e-mail
6. ✅ Return the body and ok status code

> ## Altenative flow 1.1: User not found

1. ✅ Validate if user exists in database
2. ✅ Throw not found error

> ## Altenative flow 1.2: Incorrect validationCode

1. ✅ Validate if validationCode of founded user its equals of client
2. ✅ Throw bad request

> ## Altenative flow 1.3: Error on jwt adapter

1. ✅ Throw Internal Server Error
