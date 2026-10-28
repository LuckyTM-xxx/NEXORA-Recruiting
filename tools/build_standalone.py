#!/usr/bin/env python3
"""Erzeugt eigenständige Einzeldatei-Versionen aller Seiten in dist/.

CSS, JavaScript, Logos und Schriften werden direkt in jede HTML-Datei
eingebettet – praktisch zum Verschicken oder für eine Vorschau ohne Server.

Aufruf (im Projektordner):  python3 tools/build_standalone.py
"""
import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
MIME = {".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png"}


def data_uri(rel: str) -> str:
    path = ROOT / rel
    mime = MIME.get(path.suffix) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def inline_assets(text: str) -> str:
    return re.sub(r'(?<=")assets/[^"]+', lambda m: data_uri(m.group(0)), text)


def main() -> None:
    DIST.mkdir(exist_ok=True)
    css = inline_assets((ROOT / "styles.css").read_text(encoding="utf-8"))
    js = (ROOT / "main.js").read_text(encoding="utf-8")
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        html = re.sub(r'<link rel="preload"[^>]*>\n', "", html)
        html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}</style>")
        html = html.replace('<script src="main.js"></script>', f"<script>\n{js}</script>")
        html = inline_assets(html)
        (DIST / page.name).write_text(html, encoding="utf-8")
        print(f"dist/{page.name}")


if __name__ == "__main__":
    main()
