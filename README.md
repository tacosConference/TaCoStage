# TaCoStage

The website to submit entries for talks and workshops at TaCoS 2026. 

This page is, of course, built with SvelteKit.

<img alt="TaCoStage screenshot 1" src="/screenshots/tacostage1.png" width="60%"/>
<img alt="TaCoStage screenshot 2" src="/screenshots/tacostage2.png" width="60%"/>
<img alt="TaCoStage screenshot 3" src="/screenshots/tacostage3.png" width="60%"/>

## Running locally

To install dependencies and run the app locally:

```sh
pnpm install
pnpm run dev
# or start the server and open the app in a new browser tab
pnpm run dev --open
```

## Building

To run this app in production mode, you need to build it first:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## Database
This project uses a PostgreSQL database. As always, use a strong password.

Generate one using `openssl rand -base64 32`.

## Admin login

```sh
pnpm run db:admin <email>
```

This creates an admin user and generates a password. Login at /login to accept or reject a contribution.
