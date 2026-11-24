# Hustle

A two-minute critical game about hustle culture. The score always goes up; your energy and worth quietly go down.

**Play:** type the highlighted letter (A, S, D, F). On a phone or tablet, use the four keys under the game.

## Files

```
index.html        page (open this)
css/style.css     all styles, including the responsive layout
js/core.js        game rules (no screen code)
js/ui.js          screens and per-frame drawing
js/main.js        input, scaling, game loop
favicon.svg       tab icon
.nojekyll         tells GitHub Pages to serve files as-is
```

All paths are relative, so the folder works from any URL or straight from disk.

## Publish on GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder to it, keeping `index.html` at the top level.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, and save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

Fonts load from Google Fonts; without a connection the game falls back to system fonts.
