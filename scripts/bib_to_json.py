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
    with open(bib_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all entries: @type{key, ... }
    entry_pattern = r'@(\w+)\{([^,]+),([^@]*)\}'
    entries = re.findall(entry_pattern, content, re.DOTALL)
    
    publications = []
    
    for entry_type, key, fields_text in entries:
        # Skip comments
        if entry_type.lower() == 'comment':
            continue
            
        pub = {
            'id': key.strip(),
            'type': 'journal' if entry_type.lower() == 'article' else 'conference',
        }
        
        # Parse fields
        field_pattern = r'(\w+)\s*=\s*\{([^}]*)\}'
        fields = re.findall(field_pattern, fields_text)
        
        for field_name, field_value in fields:
            field_name = field_name.lower().strip()
            field_value = field_value.strip()
            
            # Clean up LaTeX formatting
            field_value = re.sub(r'\{([^}]*)\}', r'\1', field_value)
            field_value = field_value.replace("\\&", "&")
            field_value = field_value.replace("\\'a", "á")
            field_value = field_value.replace("\\'e", "é")
            field_value = field_value.replace("\\'i", "í")
            field_value = field_value.replace("\\'o", "ó")
            field_value = field_value.replace("\\'u", "ú")
            field_value = field_value.replace("\\~n", "ñ")
            
            if field_name == 'author':
                # Parse authors: "Last, First and Last, First"
                authors = [a.strip() for a in field_value.split(' and ')]
                pub['authors'] = authors
            elif field_name == 'title':
                pub['title'] = field_value
            elif field_name == 'year':
                try:
                    pub['year'] = int(field_value)
                except ValueError:
                    pub['year'] = field_value
            elif field_name == 'journal':
                pub['venue'] = field_value
            elif field_name == 'booktitle':
                if 'venue' not in pub:  # Only set if venue not already set
                    pub['venue'] = field_value
            elif field_name == 'venue':
                pub['venue'] = field_value  # Explicit venue field overrides booktitle
            elif field_name == 'doi':
                pub['doi'] = field_value
            elif field_name == 'url':
                pub['url'] = field_value
            elif field_name == 'arxiv':
                pub['arxiv'] = field_value
            elif field_name == 'category':
                pub['type'] = field_value
            elif field_name == 'ranking':
                pub['ranking'] = field_value
            elif field_name == 'featured':
                pub['featured'] = field_value.lower() == 'true'
        
        publications.append(pub)
    
    # Sort by year (descending), then by whether first author is Torrijos
    def sort_key(p):
        year = p.get('year', 0)
        # Prioritize Torrijos as first author
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
