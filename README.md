# CampusFind — Static Lost & Found Portal

A responsive static website concept for campus lost-and-found reporting.

## Files
- `index.html` — page structure and report form
- `style.css` — responsive styling
- `script.js` — search, category/status filters, sample listings, and local report storage

## Run locally
Open `index.html` in a modern browser. No build step or backend is required.

## Deploy free with Netlify Drop
1. Extract `campusfind.zip`.
2. Visit https://app.netlify.com/drop
3. Drag the extracted `campusfind` folder (or its contents) onto the drop area.
4. Netlify will publish a public URL for the site.

Alternative: GitHub Pages
1. Create a GitHub repository and upload the three website files.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

## Important demo limitations
- Reports are stored in the browser's `localStorage` on the device that created them.
- Reports are **not shared across students or devices**. This prototype is static-only and has no shared database, login, moderation, image uploads, or admin tools.
- The six preloaded reports are illustrative sample data.
- Contact details entered in a real report can be visible to anyone using that browser. Use a dedicated campus contact method and avoid sensitive personal details.

## To make it a real campus-wide portal
Connect a backend such as Supabase or Firebase for shared listings, authentication, image uploads, report moderation, and secure contact flows. Configure access rules before collecting real student data.
