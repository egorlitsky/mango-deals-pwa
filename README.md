# Mango Deals

Express + React + TypeScript + Canvas web-application to display and manage mango deals.

Consists of 2 parts:
1) `api` - backend, Express web-server and API
2) `client` - front-end, React web app

API server must be started before the client and be accessible from the client-side location.
API and client may be placed on different hosts, but this requires CORS support in `api/index.ts` and updating paths and options in the `client/src/services/DealsService.ts`.
