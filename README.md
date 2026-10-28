# NEXORA Recruiting – Website

Statische Website von NEXORA Recruiting (KI-basiertes Recruiting für Industrie & IT). Kein Framework, kein Build-Schritt nötig: HTML, eine CSS-Datei, ein Skript.

## Aufbau

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Startseite (Recruiting-Intelligenz, Phasenmodell, Stellen-Check, FAQ) |
| `industrie-recruiting.html`, `it-recruiting.html` | Branchenseiten |
| `landingpages-karriereseiten.html` | Leistungsseite Landingpages & Karriereseiten |
| `kontakt.html` | Kontaktformular (Versand über Formspree, übernimmt Angaben aus dem Stellen-Check) |
| `impressum.html`, `datenschutz.html` | Rechtstexte |
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

- [ ] Bei Netlify und Formspree jeweils den Auftragsverarbeitungsvertrag (Data Processing Addendum) abschließen.
- [ ] Formspree: Formular einmal live testen und die erste Einsendung bestätigen (Formspree verlangt das bei neuen Formularen).
- [ ] Datenschutzerklärung rechtlich prüfen lassen.
- [ ] Domain prüfen: Canonical-URLs, `og:image`, `sitemap.xml` und `robots.txt` verweisen auf `https://recruiting.nexora.de/`.
