# Create Account Use Case

## Description

Ensure that the use case can create a new Customer in the database, send dynamics notifications to the user following the application configurations and returns created status code.

> ## Data

- name
- email
- password

> ## Primary Flow

1. ✅ Encrypt the password of user
2. ✅ Send user activationCode to NotificationService
3. ✅ Transform email to lower case
4. ✅ Create a new user in database
5. ✅ Put a false image in image field
6. ✅ Returns created status code to the user

> ## Altenative flow 1.1: E-mail conflict

1. ✅ Validate if e-mail already exists in database
2. ✅ Returns conflict status code

> ## Altenative flow 1.2: Error on notification service

1. ✅ Throw Internal Server Error
