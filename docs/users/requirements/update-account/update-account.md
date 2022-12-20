# Update Account Use Case

## Description

Ensure that the use case can update account settings

> ## Path Params

- userId

> ## Data

- name
- password

> ## Primary Flow

1. ✅ Validate UserId
2. ✅ Change user settings
3. ✅ Returns ok

> ## Altenative flow 1.1: userId not found

1. ✅ Validate if userId not exists in database
2. ✅ Returns not found status code


> ## Altenative flow 1.2: password sended

1. ✅ create a hash for password
2. ✅ replace account password
