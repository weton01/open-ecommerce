# Auth Account  Use Case

## Description

Ensure that the user can authenticate and recieve
the refresh_token, access_token and Account info

> ## Data

- email
- password

> ## Primary Flow

1. ❌ Get user on database
2. ❌ Compare the password with Compare
3. ❌ Create accessToken and refreshToken

> ## Altenative flow 1.1: Account not found

1. ❌ Throw Account error

> ## Altenative flow 1.2: Invalid Password

1. ❌ Throw Account Error

> ## Altenative flow 1.2: Account not actived

1. ❌ Throw Account Error
