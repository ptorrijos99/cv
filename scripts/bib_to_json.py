#!/usr/bin/env python3
"""
Convert publications.bib to publications.json for the website.
Run: python scripts/bib_to_json.py
"""

import json
import re
from pathlib import Path


def parse_bib_file(bib_path: str) -> list[dict]:
    """Parse a BibTeX file and extract publication entries manually."""
    with open(bib_path, 'r', encoding='utf-8') as f:
        content = f.read()

    publications = []
    
    # Simple state machine parser
    i = 0
    n = len(content)
    
    while i < n:
        if content[i] == '@':
            # Start of entry
            i += 1
            type_start = i
            while i < n and content[i].isalpha():
                i += 1
            entry_type = content[type_start:i].lower()
            
            if entry_type == 'comment':
                while i < n and content[i] != '@': i += 1
                continue
                
            # Skip spaces to {
            while i < n and content[i] != '{': i += 1
            if i >= n: break
            i += 1 # Skip {
            
            # Read Key
            key_start = i
            while i < n and content[i] != ',': i += 1
            key = content[key_start:i].strip()
            i += 1 # Skip ,
            
            # Read Fields
            fields = {}
            brace_balance = 1 # We are inside the entry brace
            
            while i < n and brace_balance > 0:
                # Skip whitespace
                while i < n and content[i].isspace(): i += 1
                
                # Check for end of entry
                if content[i] == '}':
                    brace_balance -= 1
                    i += 1
                    continue
                
                # Read Field Name
                name_start = i
                while i < n and (content[i].isalnum() or content[i] in '-_'): i += 1
                field_name = content[name_start:i].lower().strip()
                
                # Skip to =
                while i < n and content[i] != '=': i += 1
                i += 1 # Skip =
                
                # Skip whitespace
                while i < n and content[i].isspace(): i += 1
                
                # Read Field Value
                val_start = i
                val_end = i
                
                if content[i] == '{':
                    # Braced string
                    val_brace_balance = 0
                    start_brace = i
                    while i < n:
                        if content[i] == '{': val_brace_balance += 1
                        elif content[i] == '}': val_brace_balance -= 1
                        i += 1
                        if val_brace_balance == 0:
                            val_end = i
                            # Strip outer braces locally for clean value
                            fields[field_name] = content[start_brace+1:i-1]
                            break
                elif content[i] == '"':
                    # Quoted string
                    i += 1
                    while i < n:
                        if content[i] == '"' and content[i-1] != '\\':
                             i += 1
                             val_end = i
                             fields[field_name] = content[val_start+1:i-1]
                             break
                        i += 1
                else:
                    # Number or unquoted string
                    while i < n and content[i] not in ',}': i += 1
                    val_end = i
                    fields[field_name] = content[val_start:val_end].strip()

                # Skip comma if present
                while i < n and content[i].isspace(): i += 1
                if i < n and content[i] == ',': i += 1
            
            # Process Entry
            pub = {
                'id': key,
                'type': 'journal' if entry_type == 'article' else 'conference'
            }
            
            for f_name, f_val in fields.items():
                # Clean value - Remove ALL braces
                cleaned = re.sub(r'[{}]', '', f_val)
                
                # Latex replacements
                cleaned = cleaned.replace("\\&", "&")
                cleaned = cleaned.replace("\\'a", "á").replace("\\'e", "é").replace("\\'i", "í").replace("\\'o", "ó").replace("\\'u", "ú").replace("\\~n", "ñ")
                cleaned = cleaned.replace("\\'A", "Á").replace("\\'E", "É").replace("\\'I", "Í").replace("\\'O", "Ó").replace("\\'U", "Ú").replace("\\~N", "Ñ")
                cleaned = ' '.join(cleaned.split()) # Normalize spaces
                
                if f_name == 'title': pub['title'] = cleaned
                elif f_name == 'journal': pub['venue'] = cleaned
                elif f_name == 'venue': pub['venue'] = cleaned
                elif f_name == 'booktitle': 
                    if 'venue' not in pub: pub['venue'] = cleaned
                elif f_name == 'year': pub['year'] = int(cleaned) if cleaned.isdigit() else cleaned
                elif f_name == 'category': pub['type'] = cleaned
                elif f_name == 'ranking': pub['ranking'] = cleaned
                elif f_name == 'doi': pub['doi'] = cleaned
                elif f_name == 'arxiv': pub['arxiv'] = cleaned
                elif f_name == 'url': pub['url'] = cleaned
                elif f_name == 'featured': pub['featured'] = (cleaned.lower() == 'true')
                elif f_name == 'author': 
                    pub['authors'] = [a.strip() for a in cleaned.split(' and ')]

            publications.append(pub)
            
        else:
            i += 1
            
    # Sort
    def sort_key(p):
        try:
            year = int(p.get('year', 0))
        except:
            year = 0
        first_author = p.get('authors', [''])[0] if p.get('authors') else ''
        is_first = 0 if 'Torrijos' in first_author else 1
        return (-year, is_first, p.get('title', ''))
    
    publications.sort(key=sort_key)
    
    return publications


def calculate_stats(publications: list[dict]) -> dict:
    """Calculate publication statistics."""
    stats = {
        'journals': 0,
        'conferences': 0,
        'national': 0,
        'workshops': 0
    }
    
    for pub in publications:
        pub_type = pub.get('type', 'conference')
        if pub_type == 'journal':
            stats['journals'] += 1
        elif pub_type == 'national':
            stats['national'] += 1
        elif pub_type == 'workshop':
             stats['workshops'] += 1
        else:
            stats['conferences'] += 1
    
    return stats


def main():
    # Paths
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    bib_path = root_dir / 'publications.bib'
    json_path = root_dir / 'publications.json'
    
    print(f"Reading {bib_path}...")
    publications = parse_bib_file(str(bib_path))
    
    stats = calculate_stats(publications)
    
    output = {
        'stats': stats,
        'publications': publications,
        'highlightAuthor': 'Torrijos, Pablo'
    }
    
    print(f"Found {len(publications)} publications:")
    print(f"  - Journals: {stats['journals']}")
    print(f"  - Conferences: {stats['conferences']}")
    print(f"  - National: {stats['national']}")
    
    # Write JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"Written to {json_path}")


if __name__ == '__main__':
    main()
