.PHONY: lint
lint:
	poetry run flake8 jinjax_ui display

.PHONY: install
install:
	poetry install --with dev,test
	pip install -e ../claydocs/
	pip install -e ../jinjax/

.PHONY: docs
docs:
	cd docs && python docs.py
