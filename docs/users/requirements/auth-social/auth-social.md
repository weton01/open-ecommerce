# Auth FacebookAccount  Use Case

## Description

Ensure that the user can authenticate using the
facebook social login and returns to client
the refresh_token, access_token and Account info

> ## Data

- accessToken

> ## Primary Flow

1. ❌ Verify if is google or facebook
2. ❌ Create a User on database if not exists
3. ❌ Create accessToken and refreshToken

> ## Altenative flow 1.1: Invalid accessToken

1. ❌ Throw AccountError
