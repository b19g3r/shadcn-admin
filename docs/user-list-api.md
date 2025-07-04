# User List API Documentation

This document provides the API documentation for the User List page.

## Get User List

- **Endpoint:** `/api/users`
- **Method:** `GET`
- **Description:** Retrieves a list of all users in the system.

### Success Response (200 OK)

- **Content-Type:** `application/json`
- **Body:**

An array of user objects, where each object has the following structure:

```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "phoneNumber": "string",
    "status": "string",
    "role": "string",
    "createdAt": "string (date-time)",
    "updatedAt": "string (date-time)"
  }
]
```

#### Field Descriptions

| Field         | Type                               | Description                                         |
| ------------- | ---------------------------------- | --------------------------------------------------- |
| `id`          | string                             | The unique identifier for the user.                 |
| `firstName`   | string                             | The user's first name.                               |
| `lastName`    | string                             | The user's last name.                                |
| `username`    | string                             | The user's username.                               |
| `email`       | string                             | The user's email address.                            |
| `phoneNumber` | string                             | The user's phone number.                             |
| `status`      | string                             | The user's status. Can be one of: `active`, `inactive`, `invited`, `suspended`. |
| `role`        | string                             | The user's role. Can be one of: `superadmin`, `admin`, `cashier`, `manager`. |
| `createdAt`   | string (date-time)                 | The date and time when the user was created.        |
| `updatedAt`   | string (date-time)                 | The date and time when the user was last updated.   |

### Error Responses

- **404 Not Found**

  ```json
  {
    "error": "No users found."
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "An unexpected error occurred."
  }
  ```
