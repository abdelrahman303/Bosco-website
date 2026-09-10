/**
 * One-time Microsoft login to obtain a refresh token for Graph Mail.Send.
 *
 * Setup:
 * 1. Azure Portal → App registrations → New registration
 *    - Name: Bosco Mail
 *    - Supported accounts: Personal Microsoft accounts only (or Any org + personal)
 *    - Redirect URI (Mobile and desktop / public): http://localhost
 * 2. API permissions → Microsoft Graph → Delegated:
 *    Mail.Send, offline_access, User.Read → Grant consent if prompted
 * 3. Authentication → Advanced → Allow public client flows = Yes
 * 4. Copy Application (client) ID into .env as MICROSOFT_CLIENT_ID
 * 5. Run: npm run mail:auth
 * 6. Paste MICROSOFT_REFRESH_TOKEN into .env and restart the API
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SCOPE = 'https://graph.microsoft.com/Mail.Send offline_access User.Read';

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

loadEnvFile();

const clientId = String(process.env.MICROSOFT_CLIENT_ID || '').trim();
const tenant = String(process.env.MICROSOFT_TENANT_ID || 'consumers').trim();

if (!clientId) {
  console.error('Missing MICROSOFT_CLIENT_ID in .env');
  process.exit(1);
}

const deviceRes = await fetch(
  `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/devicecode`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, scope: SCOPE }),
  }
);
const device = await deviceRes.json();
if (!deviceRes.ok) {
  console.error('Device code request failed:', device);
  process.exit(1);
}

console.log('\n=== Microsoft login required ===\n');
console.log(device.message);
console.log('\nSign in as bosco.intertrade@outlook.com\n');

const intervalMs = Math.max(5, Number(device.interval) || 5) * 1000;
const deadline = Date.now() + Number(device.expires_in || 900) * 1000;
let token = null;

while (Date.now() < deadline) {
  await sleep(intervalMs);
  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: clientId,
        device_code: device.device_code,
      }),
    }
  );
  const data = await tokenRes.json();
  if (tokenRes.ok && data.access_token) {
    token = data;
    break;
  }
  if (data.error === 'authorization_pending' || data.error === 'slow_down') {
    if (data.error === 'slow_down') await sleep(intervalMs);
    continue;
  }
  console.error('Auth failed:', data);
  process.exit(1);
}

if (!token?.refresh_token) {
  console.error('No refresh_token returned. Ensure offline_access is granted.');
  process.exit(1);
}

console.log('\n=== Success ===\n');
console.log('Add / update these lines in .env:\n');
console.log(`MICROSOFT_CLIENT_ID=${clientId}`);
console.log(`MICROSOFT_TENANT_ID=${tenant}`);
console.log(`MICROSOFT_REFRESH_TOKEN=${token.refresh_token}`);
console.log('\nThen restart: npm run server\n');
