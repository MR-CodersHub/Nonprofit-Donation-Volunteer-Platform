"""
fix_nav.py  —  Updates the <ul class="nav-list"> in every NGO HTML page
to the required order and injects the correct active class based on filename.
Also updates footer quick-links where present.
"""
import os, glob, re

BASE = r'c:/Users/dines/OneDrive/Desktop/ngo'

# Map filename → which nav item should be active
ACTIVE_MAP = {
    'index.html':       'index.html',
    'home2.html':       'home2.html',
    'about.html':       'about.html',
    'events.html':      'events.html',
    'campaigns.html':   'campaigns.html',
    'volunteer.html':   'volunteer.html',
    'blog.html':        'blog.html',
    'contact.html':     'contact.html',
    # Sub-pages inherit blog active
    'blog-fundraising.html':    'blog.html',
    'blog-education.html':      'blog.html',
    'blog-healthcare.html':     'blog.html',
    'blog-sustainability.html': 'blog.html',
    'blog-disaster-relief.html':'blog.html',
    'blog-volunteer.html':      'blog.html',
    # Feature pages
    'impact-metrics.html':      '',
    'recurring-gifts.html':     '',
    'tax-receipts.html':        '',
    'volunteer-registration.html': 'volunteer.html',
}

def build_nav_list(active_file):
    """Return the <ul class="nav-list"> block with correct active class."""
    items = [
        ('index.html',      'Home'),
        ('home2.html',      'Home 2'),
        ('about.html',      'About'),
        ('events.html',     'Events'),
        ('campaigns.html',  'Campaigns'),
        ('volunteer.html',  'Volunteer'),
        ('blog.html',       'Blog'),
        ('contact.html',    'Contact'),
    ]
    lis = []
    for href, label in items:
        active_cls = ' active' if href == active_file else ''
        lis.append(f'                    <li><a href="{href}" class="nav-link{active_cls}">{label}</a></li>')
    return '<ul class="nav-list">\n' + '\n'.join(lis) + '\n                </ul>'


def build_footer_links():
    """Return footer quick-links <ul> in the same order."""
    items = [
        ('index.html',     'Home'),
        ('home2.html',     'Home 2 (Premium)'),
        ('about.html',     'About Us'),
        ('events.html',    'Upcoming Events'),
        ('campaigns.html', 'Ecosystem Campaigns'),
        ('volunteer.html', 'Volunteer Programs'),
        ('blog.html',      'Blog Insights'),
        ('contact.html',   'Get In Touch'),
    ]
    lis = [f'                            <li><a href="{h}">{l}</a></li>' for h, l in items]
    return '<ul>\n' + '\n'.join(lis) + '\n                        </ul>'


html_files = glob.glob(BASE + '/*.html')
updated = 0

for filepath in html_files:
    fname = os.path.basename(filepath)
    if fname not in ACTIVE_MAP:
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip dashboard / auth pages (they have no public nav)
    if 'db-sidebar' in content or 'auth-wrapper' in content:
        print(f'  SKIP (dashboard/auth): {fname}')
        continue

    original = content
    active_target = ACTIVE_MAP[fname]

    # ── 1. Replace <ul class="nav-list"> block ────────────────────────────────
    new_ul = build_nav_list(active_target)
    # Match from <ul class="nav-list"> to the matching </ul>
    content = re.sub(
        r'<ul class="nav-list">.*?</ul>',
        new_ul,
        content,
        flags=re.DOTALL
    )

    # ── 2. Fix footer "Ecosystem Navigation" quick-links widget ──────────────
    # Replace the <ul> inside .links-widget that has navigation links
    def replace_footer_ul(m):
        inner = m.group(0)
        # Only replace if it contains known nav hrefs
        if 'index.html' in inner or 'home2.html' in inner or 'about.html' in inner:
            return build_footer_links()
        return inner

    content = re.sub(
        r'<ul>(?:\s*<li><a href="[^"]*\.html">[^<]+</a></li>\s*)+</ul>',
        replace_footer_ul,
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated += 1
        print(f'  UPDATED: {fname}')
    else:
        print(f'  NO CHANGE: {fname}')

print(f'\nDone. {updated} file(s) updated.')
