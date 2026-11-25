# Backend

The data-access layer shared by the API, written on top of the `mariadb` driver.

```sh
npm install
npm test              # Mocha tests (needs the database and api/.env)
npm run settlements   # recompute monthly settlements
```

- `dp_pool.js`: MariaDB connection pool
- `db_functions.js`, `db_settlements.js`, `db_auth.js`, `db_admin.js`: queries used by the API routers
- `fill_settlements.js`: computes the net monthly debt between each pair of operators, stores it as a `Settlement`, and links the passes to it. The dump already includes the computed settlements, so you only need to run this after changing pass data.
