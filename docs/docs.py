#!/usr/bin/env python
import logging
import jinjax_ui

from claydocs import Docs, theme_path


logging.getLogger("jinjax").setLevel(logging.INFO)
logging.getLogger("jinjax").addHandler(logging.StreamHandler())

pages = [
    "index.mdx",
    "alert.mdx",
    "avatar.mdx",
    "button.mdx",
    "checkbox.mdx",
    "details.mdx",
    "select.mdx",
    "radio.mdx",
    "rel-date.mdx",
    "tabs.mdx",
    "input.mdx",
    "textarea.mdx",
    "tooltip.mdx",
    "table.mdx",
]


def get_docs() -> Docs:
    docs = Docs(
        pages,
        content_folder="./content",
        search=False,
        cache=False,
        domain="https://jinjax-ui.scaletti.dev",
        default="Page",
        default_social="SocialCard",
        metadata={
            "default_title": "JinjaX-UI Documentation",
            "repo": "https://github.com/jpsca/jinjax-ui",
            "logo": "/static/img/ui-logo.svg",
        },
    )

    # Custom component + theme overrides
    docs.add_folder("./components")
    docs.add_folder(jinjax_ui.components_path)
    # Default theme
    docs.add_folder(theme_path)
    return docs


if __name__ == "__main__":
    get_docs().run()
