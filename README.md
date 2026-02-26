# Bouncing Logo Screensaver

## Using as macOS screensaver (WebViewScreenSaver)

WebViewScreenSaver **fetches the URL you enter and expects JSON** (a list of URLs to show). If you enter your page URL directly, it gets HTML and fails with: *"The data couldn't be read because it isn't in the correct format."*

### Option 1: Use `urls.json` (for deployed URL)

1. **Edit `urls.json`**  
   Replace `REPLACE_WITH_YOUR_DEPLOYED_BASE_URL` with your real base URL (no trailing path), e.g.:
   ```json
   [{ "url": "https://your-site.netlify.app/", "duration": -1 }]
   ```

2. **Deploy**  
   Deploy this folder so both `index.html` and `urls.json` are at the same origin (e.g. `https://your-site.netlify.app/` and `https://your-site.netlify.app/urls.json`).

3. **In WebViewScreenSaver settings**  
   In the address list, enter the **urls.json** URL, not the main page:
   - ✅ `https://your-site.netlify.app/urls.json`
   - ❌ `https://your-site.netlify.app/` (returns HTML → parse error)

4. Set duration to **-1** (or leave as in JSON) for a single indefinite page.

The screensaver will fetch `urls.json`, parse the list, then load your page from the `url` in that JSON.

### Option 2: Use a local path (no deploy)

In WebViewScreenSaver, add a **local file** URL instead of a web URL:

- `file:///Users/charliebc/screensaver/index.html`

So long as the path is not under Desktop, Documents, or Downloads (Catalina+), the screensaver can load it and `logo.png` will load from the same folder.
