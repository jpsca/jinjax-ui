#!/usr/bin/env python
import logging
from pathlib import Path

import jinjax_ui
from claydocs import Docs


logging.getLogger("jinjax").setLevel(logging.INFO)
logging.getLogger("jinjax").addHandler(logging.StreamHandler())

here = Path(__file__).parent

pages = [
    "index.mdx",
    [
        "Headless", [
            "Headless/Tabs.mdx",
            "Headless/Accordion.mdx",
        ],
    ],
]

def get_docs() -> Docs:
    root_path = here / "content"
    docs = Docs(pages, content_folder=root_path, add_ons=[jinjax_ui])
    docs.add_folder(here / "components")
    docs.add_folder(here / "theme")
    return docs


if __name__ == "__main__":
    get_docs().run()
