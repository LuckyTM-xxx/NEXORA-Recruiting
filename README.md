# NEXORA Recruiting – Website

Statische Website von NEXORA Recruiting (KI-basiertes Recruiting für Industrie & IT). Kein Framework, kein Build-Schritt nötig: HTML, eine CSS-Datei, ein Skript.

## Aufbau

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Startseite (Recruiting-Intelligenz, Phasenmodell, Stellen-Check, FAQ) |
| `industrie-recruiting.html`, `it-recruiting.html` | Branchenseiten |
| `landingpages-karriereseiten.html` | Leistungsseite Landingpages & Karriereseiten |
| `impressum.html`, `datenschutz.html` | Rechtstexte (**Platzhalter ausfüllen**, siehe unten) |
| `styles.css`, `main.js` | Gestaltung und Interaktionen aller Seiten |
| `assets/logo/` | Logos (SVG für das Web, PNG für Druck/Office) |
| `assets/fonts/` | Schriften Manrope, Sora, Norican – lokal eingebunden (SIL OFL) |
| `assets/og-image.png` | Vorschaubild für LinkedIn, WhatsApp & Co. |
| `robots.txt`, `sitemap.xml` | Für Suchmaschinen |
| `netlify.toml` | Hosting-Einstellungen für Netlify (Sicherheits-Header, Caching) |
| `tools/build_standalone.py` | Erzeugt Einzeldatei-Versionen der Seiten |

## Lokal ansehen

`index.html` einfach im Browser öffnen – oder mit lokalem Server:

```bash
python3 -m http.server 8000
```

## Einzeldatei-Versionen

Für den Versand per Mail o. Ä. bettet das Skript CSS, JavaScript, Logos und Schriften direkt in jede Seite ein:

```bash
python3 tools/build_standalone.py
```

Die Dateien landen in `dist/` (nicht im Repository).

## Vor dem Livegang

- [ ] Im Netlify-Konto das Data Processing Addendum (Auftragsverarbeitungsvertrag) abschließen.
- [ ] Datenschutzerklärung rechtlich prüfen lassen.
- [ ] Domain prüfen: Canonical-URLs, `og:image`, `sitemap.xml` und `robots.txt` verweisen auf `https://recruiting.nexora.de/`.
