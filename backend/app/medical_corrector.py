import json
import re
from rapidfuzz import process, fuzz

# Load curated mapping
with open(r"C:\Users\ESHWAR\OneDrive\Desktop\Programs\siddhi\correction_dictionary_final (1).json", "r", encoding="utf-8") as f:
    RAW_MAP = json.load(f)

def normalize(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())

# Normalized → Canonical
MED_MAP = {normalize(k): v for k, v in RAW_MAP.items()}

def medical_text_correct(text: str) -> str:
    words = text.split()
    corrected = []

    for w in words:
        key = normalize(w)

        # Exact match first
        if key in MED_MAP:
            corrected.append(MED_MAP[key])
            continue

        # Fuzzy match (safe threshold)
        match = process.extractOne(
            key, MED_MAP.keys(), scorer=fuzz.ratio
        )

        if match and match[1] >= 90:
            corrected.append(MED_MAP[match[0]])
        else:
            corrected.append(w)  # IGNORE unknown words

    return " ".join(corrected)
