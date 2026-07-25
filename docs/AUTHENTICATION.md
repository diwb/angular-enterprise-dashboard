# Authentication

Demo authentication accepts only fictitious accounts:

- `admin@example.com`
- `manager@example.com`
- `analyst@example.com`

The session is represented by a typed object with an expiring demo token. It is stored in local storage only for this public demonstration mode. Real API integration should replace token storage with the backend-approved browser strategy and refresh-token behavior.
