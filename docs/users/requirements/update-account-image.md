# Update Account Image Use Case

## Description

Ensure that the use case can update user image using a File
Storage adapter and remove the image if the client not send a image, updating the image to default profile image.

> ## Path Params

- userId

> ## Data

- image

> ## Primary Flow

1. ❌ Save the image in FileStorage
2. ❌ Send a unique key to file storage
3. ❌ Update the user image in database

> ## Altenative flow 1.1: User remove the image

1. ❌ If the system not recieve a image ignore the steps one and two
2. ❌ Update image to default

> ## Altenative flow 1.3: Error on S3

1. ❌ Throw Internal Server Error
