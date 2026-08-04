import textwrap
from typing import List

def clean_response(text: str) -> str:
    """
    Cleans leading/trailing whitespace and common indentation from multi-line text strings.
    """
    return textwrap.dedent(text).strip()


def has_keyword(text: str, keywords: List[str]) -> bool:
    """
    Checks if any keyword in the provided list exists within the text string.
    """
    return any(keyword in text for keyword in keywords)
