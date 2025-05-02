.PHONY: install
install:
	uv sync --group docs
	uv pip install -e .

.PHONY: docs
docs:
	cd docs && uv run python docs.py

.PHONY: docs-build
docs-build:
	cd docs && uv run python docs.py build

.PHONY: docs-deploy
docs-deploy:
	cd docs && uv run sh deploy.sh
