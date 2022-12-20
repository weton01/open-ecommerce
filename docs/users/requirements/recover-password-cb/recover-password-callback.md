# Recover Password Callback Use Case

## Description

Ensure that the use case can change the password of the user
if the e-mail is exists and is a valid token

> ## Data

- email
- password

> ## Primary Flow

1. ✅ Encrypt the password
2. ✅ Validate e-mail in database
3. ✅ Change the user password in database
4. ✅ Retunrs ok

> ## Altenative flow 1.1: E-mail not found

1. ✅ Validate if e-mail not found in database
2. ✅ Returns not found status code

> ## Altenative flow 1.2: Invalid access_token

1. ✅ Throw Forbidden error
