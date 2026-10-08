# Abdillahi Portfolio

A responsive React portfolio with a small Express contact API.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

To run the API in a second terminal:

```bash
cd server
npm install
npm run dev
```

The API runs on `http://localhost:3001`. The frontend uses that URL by default. For a deployed API, set the frontend hosting environment variable `VITE_API_URL` to the full endpoint URL, for example `https://your-api.onrender.com/api/contact`.

### Configure contact-form email

The contact API sends submissions to `abdillahmohammed2001@gmail.com` using SMTP. Copy `server/.env.example` to `server/.env` for local development and fill in your SMTP account details. For Gmail, create a Google App Password and use it as `SMTP_PASS` (do not use your normal Gmail password). Keep these values on the server only; never add them to frontend environment variables or commit the `.env` file.

When deploying the API, set `CONTACT_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` in the hosting provider's server environment settings. Set `CLIENT_URL` to the deployed portfolio's origin and set `VITE_API_URL` in the frontend hosting settings to the deployed API's `/api/contact` URL, then rebuild and redeploy the frontend.

## Deploy frontend

1. Push this repository to GitHub.
2. Import the repository in your frontend hosting provider (for example, Netlify or Vercel).
3. Keep the framework preset as Vite.
4. Set the build command to `npm run build` and output directory to `dist`.
5. Add `VITE_API_URL` pointing to the deployed API endpoint.
6. Deploy.

## Deploy API to Render

Create a new Render Web Service from the same repository with:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `CLIENT_URL=https://your-vercel-site.vercel.app`

Render supplies `PORT` automatically. The health endpoint is `/api/health`.
