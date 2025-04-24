#!/usr/bin/env python
import logging

from claydocs import Docs, theme_path


logging.getLogger("jinjax").setLevel(logging.INFO)
logging.getLogger("jinjax").addHandler(logging.StreamHandler())

pages = [
    "index.mdx",
    "intro.mdx",
    "colors.mdx",
    [
        "Components",
        [
            "components/alert.mdx",
            "components/avatar.mdx",
            "components/badge.mdx",
            "components/button.mdx",
            "components/details.mdx",
            "components/icon.mdx",
            "components/rel-date.mdx",
            "components/tabs.mdx",
            "components/tooltip.mdx",
            "components/table.mdx",
        ],
    ],
    [
        "Form components",
        [
            "forms/input.mdx",
            "forms/textarea.mdx",
            "forms/checkbox.mdx",
            "forms/radio.mdx",
            "forms/select.mdx",
        ],
    ]
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
    # Default theme
    docs.add_folder(theme_path)
    return docs


if __name__ == "__main__":
    get_docs().run()
