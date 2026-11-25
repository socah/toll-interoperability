# Frontend

React single-page app for toll operators (port 3000, HTTPS).

```sh
npm install
npm start   # or ./build_deploy.sh
```

Pages:
- **Login**: sign in with an operator account (see the demo accounts in the [main README](../README.md#demo-accounts))
- **Options**: choose what to view
- **Passes**: passes between two operators over a date range
- **Settlements**: amounts owed to and by the operator, with payment confirmation
- **Settlement passes**: the passes behind a settlement

The app expects the API at `https://localhost:9103`.
