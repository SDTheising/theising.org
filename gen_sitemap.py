#!/usr/bin/env python3
import os
from datetime import datetime

# ===== CONFIG =====
BASE_URL = "https://theising.org"
ROOT = "./public_html"
BLOG_POSTS = os.path.join(ROOT, "blog", "posts")
OUTPUT = os.path.join(ROOT, "sitemap.xml")
# ==================

urls = {}

# 1) Add every directory with index.html
for dirpath, dirnames, filenames in os.walk(ROOT):
    if "index.html" in filenames:
        rel = os.path.relpath(dirpath, ROOT)
        # skip technical/internal folders
        if any(part.startswith(".") or part in {"lib", "templates", "posts", "images"} for part in rel.split(os.sep)):
            continue
        loc = f"{BASE_URL}/" if rel == "." else f"{BASE_URL}/{rel.strip('/')}/"
        lastmod = datetime.fromtimestamp(os.path.getmtime(os.path.join(dirpath, "index.html"))).strftime("%Y-%m-%d")

        urls[loc] = lastmod

# 2) Add every blog post .md slug
for f in os.listdir(BLOG_POSTS):
    if f.endswith(".md"):
        slug = os.path.splitext(f)[0]
        loc = f"{BASE_URL}/blog/post.php?slug={slug}"
        lastmod = datetime.fromtimestamp(os.path.getmtime(os.path.join(BLOG_POSTS, f))).strftime("%Y-%m-%d")
        urls[loc] = lastmod

# 3) Write sitemap.xml
with open(OUTPUT, "w", encoding="utf-8") as out:
    out.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    out.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for loc, lastmod in sorted(urls.items()):
        out.write(f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{lastmod}</lastmod>\n  </url>\n")
    out.write('</urlset>\n')

print(f"✅ Generated {len(urls)} URLs → {OUTPUT}")
