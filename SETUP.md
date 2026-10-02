# Venom Discord sign-in and email approval

This is the protected Vercel replacement for the earlier static ZIP. Your existing ChatGPT-hosted site and any old Vercel deployment are not changed by downloading this file.

## What happens

1. A visitor selects **Continue with Discord** and grants the `identify` scope.
2. The server verifies their Discord account and creates a pending request keyed by their immutable Discord user ID.
3. You receive an email with their display name, username and Discord ID.
4. Open **Review request** and press **Approve** or **Reject**. Opening the email link alone never approves anyone.
5. Approved users can refresh their access page and enter. Pending, rejected and revoked users cannot retrieve the ad creator, its scripts or its catalogue.

Requests are emailed at most once per user per day. Approval links expire after 72 hours and can be decided once. Users can resend a pending request after the daily interval. Rejected users remain blocked; only an owner can override them. Approvals persist in Redis across deployments. Sessions expire after seven days. Approved users must still sign in through Discord; approval is not a shareable login.

## 1. Import the replacement app into Vercel

Extract the ZIP. Import the **Venom_LifeInvader_Discord** folder through Vercel Drop (https://vercel.com/drop), or commit the folder to a private GitHub repository and import that repository in Vercel.

- Use the project root containing `package.json` and `index.mjs`.
- Allow Vercel to detect **Express**. Choose Express if the dashboard asks.
- Remove any old static Output Directory / `dist` / `.` override from your earlier project. Do not deploy only the `protected` directory.
- Use Node.js 22 or newer. Dependencies install from the included lockfile.
- No custom build command is required for this Express project.
- Deploy once to obtain your production domain; the page will remain closed until environment variables are configured.

Protected assets are read by the server and bundled into its function. They are deliberately NOT in a public CDN directory. Do not move them into `public/` or export a static copy.

## 2. Create the Discord application

Open https://discord.com/developers/applications and create an application, e.g. Venom LifeInvader.

On its OAuth2 page, add this exact redirect URL (replace the domain):

`https://your-project.vercel.app/auth/discord/callback`

Use your custom domain instead if that is the stable URL you will share. Copy the OAuth2 **Client ID** and **Client Secret** into the corresponding Vercel environment variables below. No bot, server permissions or Discord messages are needed. The app requests only `identify`, not email, guild membership or message access.

Never put the client secret in a frontend file or share it in chat.

## 3. Create durable approval storage

Create an Upstash Redis database at https://console.upstash.com (or through the Vercel marketplace).

Copy its HTTPS REST URL and full read/write REST token into:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Keep these server-side in Vercel. Use a dedicated database or one whose `venom:` keys do not overlap another deployment. The app stores user IDs, account names, access status, sessions and pending request details. It does not store Discord passwords or retain Discord access/refresh tokens.

## 4. Configure approval emails

Create a Resend account at https://resend.com and generate an API key permitted to send emails.

Verify a sender domain in Resend and use an address on that domain for `MAIL_FROM`, e.g. `Venom <access@your-domain.com>`.

For an initial test, Resend's onboarding sender can send to the email associated with your Resend account, subject to its account restrictions. If you use it, the approval address must be that allowed recipient. For ongoing use, configure a verified sending domain.

Set `APPROVAL_EMAIL` to **your mailbox**. This is the recipient of all access requests, not each visitor's email.

Approval links are private authorization links: anyone you forward one to can decide that particular request. The email link opens a review page; Approve/Reject require a separate form submission to avoid mail-scanner auto-approvals.

## 5. Add Vercel environment variables

In the Vercel project, open **Settings → Environment Variables**. Copy the names from `.env.example` and provide real values. Use Production for the production site.

| Name | Value |
| --- | --- |
| `APP_URL` | Stable HTTPS production origin, e.g. `https://your-project.vercel.app`; no subpath |
| `DISCORD_CLIENT_ID` | Discord OAuth2 application Client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 Client Secret |
| `SESSION_SECRET` | A random secret at least 64 characters long; command below generates 96 hexadecimal characters |
| `UPSTASH_REDIS_REST_URL` | Upstash database REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash read/write REST token |
| `RESEND_API_KEY` | Resend sending API key |
| `MAIL_FROM` | Verified sender name/address |
| `APPROVAL_EMAIL` | Your approval mailbox address |
| `ADMIN_DISCORD_IDS` | Optional: your Discord user ID; multiple owners separated by commas |

Generate the session-signing secret on your own computer:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

To find your Discord ID: enable Discord Developer Mode, then use **Copy User ID** on your own profile. Owners listed in `ADMIN_DISCORD_IDS` are explicitly pre-authorized and can open `/admin` to approve or revoke people. This is the only pre-authorization exception. With the variable empty, every person (including you) needs an email approval, and the administrator page is inaccessible.

Redeploy after saving the environment variables. Do not retain the old static deployment as another accessible route to the same app. Remove it or restrict access separately in its hosting account.

## 6. Test your live configuration

1. Open the site in a private window: the sign-in screen should appear.
2. Sign in with a non-owner Discord account. The pending page should appear, not the ad creator.
3. Confirm you receive the correct Discord account and ID in your mailbox.
4. Open the email link. Confirm that opening it alone still leaves the user pending.
5. Press Approve. Refresh the visitor's access page. The app should now open.
6. If you configured your owner Discord ID, sign in with it and visit `/admin`. Revoke the test user. Their next protected request must be denied.
7. While signed out, try `/catalog.json` and `/js/app.mjs`. They must return sign-in-required errors, not app data.

Vercel preview domains are not automatically valid Discord redirect origins. Test on the configured production domain, or use a separately configured test app, redirect origin and isolated database for previews.

## Troubleshooting

- **Access setup is incomplete:** a required variable is missing, a placeholder remains, the secret is too short or the app URL is invalid. Fill the example variables and redeploy.
- **Discord invalid redirect:** the Discord redirect URL must exactly match `APP_URL` plus `/auth/discord/callback`.
- **Approval email could not be sent:** check the Resend sending key, verified sender domain and allowed recipient. The user stays blocked; the failed-send throttle is released so they can retry.
- **Approval link expired:** the pending user can request another email after the daily interval; an owner can use `/admin` immediately.
- **Database unavailable:** access fails closed. Check the REST URL/token and service health.

## Local development

Requires Node.js 22+:

```sh
npm ci
```

Copy `.env.example` to `.env`, fill values, set `APP_URL=http://localhost:3000`, and register `http://localhost:3000/auth/discord/callback` on a separate test Discord app. Run `npm start`. Localhost development uses a development cookie; production HTTPS uses Secure, HttpOnly, SameSite=Lax, host-only cookies.

Run the automated checks with `npm test`. They use mock providers and do not send real mail or contact Discord/Redis.

## References

- https://vercel.com/docs/frameworks/backend/express
- https://vercel.com/docs/project-configuration/vercel-json
- https://docs.discord.com/developers/topics/oauth2
- https://upstash.com/docs/redis/features/restapi
- https://resend.com/docs/api-reference/emails/send-email
