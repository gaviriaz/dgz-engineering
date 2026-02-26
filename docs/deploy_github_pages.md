# Deploy to GitHub Pages (zero cost) — DGZ Engineering

This guide prepares the repository to be published on GitHub Pages and includes a fallback for Turf.js issues in locked browsers.

1) Branch and commit (local)

```bash
git checkout -b feature/gh-pages-ready
git add .
git commit -m "chore: prepare site for GitHub Pages (client-side validator, docs)"
git push origin feature/gh-pages-ready
```

2) GitHub Pages setup
- In GitHub, go to Settings → Pages.
- Choose `feature/gh-pages-ready` (or `main`) as the source and folder `/ (root)`.
- Save. Wait a few minutes for the site to be published.
- Open `https://<your-username>.github.io/<repo>/lab/validator.html` and test.

3) Turf.js TLS / Tracking Prevention issues
- Some browsers (Edge with Tracking Prevention, strict privacy extensions) may block storage or reject certain CDNs.
- We use `https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js` which is generally reliable.
- If you still see errors (ERR_CERT_AUTHORITY_INVALID or storage blocked), two options:
  - A) Vendor Turf locally: download `turf.min.js` and place under `assets/vendor/turf.min.js`, then update `lab/validator.html` to reference `/assets/vendor/turf.min.js`.
  - B) Ask users to allow site storage or use a different browser.

4) Optional: Add `assets/vendor/turf.min.js` to repo
- If you want zero-dependency hosting guaranteed, download turf.min.js and add the file to `assets/vendor/`.

5) Verify zero-cost flow
- With no `API_BASE` configured the validator runs client-side and requires no backend — perfect for GitHub Pages.

If you want, I can:
- create `assets/vendor/turf.min.js` in the repo (I can add the file if you provide it, or I can add instructions so you add it locally), and
- create the branch `feature/gh-pages-ready` commit message and show the exact commands to push.
