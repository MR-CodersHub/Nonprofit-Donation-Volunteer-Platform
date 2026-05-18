import os, glob, re

html_files = glob.glob('c:/Users/dines/OneDrive/Desktop/ngo/*.html')
count = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Inject mobile.css link (before </head>)
    if 'mobile.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/mobile.css">\n</head>')
        changed = True

    # 2. Add nav-overlay div after <body> or after preloader
    if 'nav-overlay' not in content:
        # Insert right after the opening <body> tag or after preloader closing div
        # Try to place after the preloader block
        preloader_pattern = re.search(r'(<div id="preloader">.*?</div>\s*)', content, re.DOTALL)
        if preloader_pattern:
            insert_pos = preloader_pattern.end()
            content = content[:insert_pos] + '\n    <!-- Nav Overlay (mobile) -->\n    <div class="nav-overlay" id="nav-overlay"></div>\n\n    ' + content[insert_pos:]
        else:
            # fallback: after <body>
            content = re.sub(r'(<body[^>]*>)', r'\1\n    <div class="nav-overlay" id="nav-overlay"></div>', content)
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f'Updated {os.path.basename(filepath)}')

print(f'Done. Updated {count} files.')
