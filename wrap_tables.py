import os
import re

html_dir = "c:/Users/dines/OneDrive/Desktop/ngo"

def wrap_tables_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match <table class="db-table"> ... </table> if NOT already inside a table-responsive div
    pattern = re.compile(
        r'(?<!<div class="table-responsive">)(\s*<table class="db-table">.*?</table>)', 
        re.DOTALL
    )
    
    new_content, count = pattern.subn(
        r'\n                    <div class="table-responsive">\1\n                    </div>', 
        content
    )
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Wrapped {count} tables in {os.path.basename(filepath)}")
        return count
    return 0

total_wrapped = 0
for filename in os.listdir(html_dir):
    if filename.endswith(".html"):
        total_wrapped += wrap_tables_in_file(os.path.join(html_dir, filename))

print(f"Finished wrapping {total_wrapped} tables across all pages!")
