import os, glob, re

html_files = glob.glob('c:/Users/dines/OneDrive/Desktop/ngo/*.html')
count = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<div class="header-icons">' in content:
        continue
        
    # Find the nav-actions block and the hamburger button
    # It looks like:
    # <div class="nav-actions"> ... </div>
    # </div> <!-- end of nav-menu -->
    # <button class="hamburger" id="hamburger" aria-label="Toggle menu">
    
    nav_actions_match = re.search(r'(<div class="nav-actions">.*?</div>)\s*</div>\s*(<button class="hamburger")', content, re.DOTALL)
    
    if nav_actions_match:
        nav_actions_full = nav_actions_match.group(1)
        hamburger_start = nav_actions_match.group(2)
        
        # Extract theme toggle
        theme_btn_match = re.search(r'<button id="theme-toggle".*?</button>', nav_actions_full, re.DOTALL)
        
        # Extract user dropdown wrapper
        # The wrapper might have a nested div, so regex needs to be careful
        user_wrapper_match = re.search(r'<div class="user-dropdown-wrapper">.*?</div>\s*</div>\s*</div>', nav_actions_full, re.DOTALL)
        if not user_wrapper_match:
            user_wrapper_match = re.search(r'<div class="user-dropdown-wrapper">.*?</div>\s*</div>', nav_actions_full, re.DOTALL)
            
        if theme_btn_match and user_wrapper_match:
            theme_btn = theme_btn_match.group(0)
            user_wrapper = user_wrapper_match.group(0)
            
            # Remove them from nav-actions
            new_nav_actions = nav_actions_full.replace(theme_btn, '').replace(user_wrapper, '')
            # Clean up empty lines
            new_nav_actions = re.sub(r'\n\s*\n', '\n', new_nav_actions)
            
            header_icons = f'<div class="header-icons">\n                    {theme_btn}\n                    {user_wrapper}\n                    {hamburger_start}'
            
            replacement = f'{new_nav_actions}\n            </div>\n\n            {header_icons}'
            
            new_content = content[:nav_actions_match.start()] + replacement + content[nav_actions_match.end(2):]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f'Updated {os.path.basename(filepath)}')

print(f'Done. Updated {count} files.')
