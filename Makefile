.PHONY: install
install:
	uv sync
	uv pip install -e .
	uv pip install -e ../jinjax/

.PHONY: docs
docs:
	cd docs && python docs.py
