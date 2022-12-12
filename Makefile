.PHONY: install
install:
	poetry install --with test
	pip install -e ../jinjax/

.PHONY: docs
docs:
	cd docs && python docs.py
