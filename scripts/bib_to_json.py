#!/usr/bin/env python3
"""
Convert publications.bib to publications.json for the website.
Run: python scripts/bib_to_json.py
"""

import json
import re
from pathlib import Path


def parse_bib_file(bib_path: str) -> list[dict]:
    """Parse a BibTeX file and extract publication entries."""
    # Simple custom parser to handle nested braces content correctly
    with open(bib_path, 'r', encoding='utf-8') as f:
        content = f.read()

    publications = []
    
    # 1. Split into entries by @
    # This is a basic split, assumes "@" marks start of entry
    raw_entries = re.split(r'@(\w+)\s*\{', content)
    
    # raw_entries[0] is pre-content, then we have pairs: type, content
    for i in range(1, len(raw_entries), 2):
        entry_type = raw_entries[i].lower()
        entry_body = raw_entries[i+1]
        
        if entry_type == 'comment':
            continue
            
        # Extract key: up to first comma
        key_match = re.match(r'([^,]+),', entry_body)
        if not key_match:
            continue
        key = key_match.group(1).strip()
        
        # Parse fields
        fields = {}
        # Cursor position after key
        cursor = key_match.end()
        
        while cursor < len(entry_body):
            # Find field name
            name_match = re.search(r'(\w+)\s*=', entry_body[cursor:])
            if not name_match:
                break
            
            field_name = name_match.group(1).lower()
            start_val = cursor + name_match.end()
            
            # Find value (handling nested braces)
            # Find first opening brace or quote
            val_start_match = re.search(r'[\{"]', entry_body[start_val:])
            if not val_start_match:
                break
                
            token_start = start_val + val_start_match.start()
            delimiter = entry_body[token_start]
            
            val_end = -1
            if delimiter == '{':
                brace_count = 1
                for j in range(token_start + 1, len(entry_body)):
                    if entry_body[j] == '{':
                        brace_count += 1
                    elif entry_body[j] == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            val_end = j
                            break
            else: # quote
                 # This simple parser doesn't handle escaped quotes inside quotes perfectly but works for standard bib
                 quote_end = entry_body.find('"', token_start + 1)
                 if quote_end != -1:
                     val_end = quote_end
            
            if val_end != -1:
                fields[field_name] = entry_body[token_start+1:val_end]
                cursor = val_end + 1
            else:
                break
        
        # Build publication object
        pub = {
            'id': key,
            'type': 'journal' if entry_type == 'article' else 'conference',
        }
        
        # Normalize fields
        for field_name, field_value in fields.items():
            # Clean LaTeX formatting
            # Replace {{Text}} with Text, {Text} with Text
            cleaned = field_value
            while '{' in cleaned and '}' in cleaned:
                cleaned = re.sub(r'\{([^{}]*)\}', r'\1', cleaned)
            
            cleaned = cleaned.replace("\\&", "&")
            cleaned = cleaned.replace("\\'a", "á").replace("\\'e", "é").replace("\\'i", "í").replace("\\'o", "ó").replace("\\'u", "ú").replace("\\~n", "ñ")
            cleaned = cleaned.replace("\\'A", "Á").replace("\\'E", "É").replace("\\'I", "Í").replace("\\'O", "Ó").replace("\\'U", "Ú").replace("\\~N", "Ñ")
            # Remove double spaces
            cleaned = ' '.join(cleaned.split())
            
            if field_name == 'author':
                pub['authors'] = [a.strip() for a in cleaned.split(' and ')]
            elif field_name == 'title':
                pub['title'] = cleaned
            elif field_name == 'year':
                try:
                    pub['year'] = int(cleaned)
                except ValueError:
                    pub['year'] = cleaned
            elif field_name == 'journal':
                pub['venue'] = cleaned
            elif field_name == 'booktitle':
                if 'venue' not in pub:
                    pub['venue'] = cleaned
            elif field_name == 'venue':
                pub['venue'] = cleaned
            elif field_name == 'doi':
                pub['doi'] = cleaned
            elif field_name == 'url':
                pub['url'] = cleaned
            elif field_name == 'arxiv':
                pub['arxiv'] = cleaned
            elif field_name == 'category':
                pub['type'] = cleaned
            elif field_name == 'ranking':
                pub['ranking'] = cleaned
            elif field_name == 'featured':
                pub['featured'] = cleaned.lower() == 'true'

        publications.append(pub)
    
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
        'national': 0
    }
    
    for pub in publications:
        pub_type = pub.get('type', 'conference')
        if pub_type == 'journal':
            stats['journals'] += 1
        elif pub_type == 'national':
            stats['national'] += 1
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
