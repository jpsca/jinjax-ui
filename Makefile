.PHONY: install
install:
	uv sync --group docs
	uv pip install -e ../jinjax/
	uv pip install -e ../claydocs/

.PHONY: docs
docs:
	cd docs && python docs.py
