# API

The Express REST server (HTTPS, port 9103). For the endpoint list and setup, see the [main README](../README.md).

```sh
npm install
npm run devStart   # or ./build_deploy.sh
```

- `server.js`: sets up the app and HTTPS server
- `routes/`: `admin`, `auth`, `settlements` and functional (pass/charge) endpoints
- `utilities/`: JWT authentication middleware and date formatting
- `postman/`: Postman collection for exploring the API
- `SSL/`: self-signed certificate for local development only
