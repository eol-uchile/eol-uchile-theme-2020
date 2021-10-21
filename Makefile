.DEFAULT_GOAL := help
.PHONY: requirements

# include *.mk

# Generates a help message. Borrowed from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## Display this help message
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[\.a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'


lang_targets = en es_419 es
create_translations_catalogs: ## Create the initial configuration of .mo files for translation
	pybabel extract -F conf/locale/babel.cfg -o  conf/locale/django.pot --msgid-bugs-address=eol-ayuda@uchile.cl --copyright-holder=EOL *
	for lang in $(lang_targets) ; do \
        pybabel init -i conf/locale/django.pot -D django -d conf/locale/ -l $$lang ; \
    done
	pybabel extract -F conf/locale/babeljs.cfg -o  conf/locale/djangojs.pot --msgid-bugs-address=eol-ayuda@uchile.cl --copyright-holder=EOL *
	for lang in $(lang_targets) ; do \
        pybabel init -i conf/locale/djangojs.pot -D djangojs -d conf/locale/ -l $$lang ; \
    done
	pybabel extract -F conf/locale/babelmako.cfg -o  conf/locale/mako.pot --msgid-bugs-address=eol-ayuda@uchile.cl --copyright-holder=EOL *
	for lang in $(lang_targets) ; do \
        pybabel init -i conf/locale/mako.pot -D mako -d conf/locale/ -l $$lang ; \
    done


update_translations: ## update strings to be translated
	pybabel extract -F conf/locale/babel.cfg -o conf/locale/django.pot *
	pybabel update -N -D django -i conf/locale/django.pot -d conf/locale/
	rm conf/locale/django.pot
	pybabel extract -F conf/locale/babeljs.cfg -o conf/locale/djangojs.pot *
	pybabel update -N -D djangojs -i conf/locale/djangojs.pot -d conf/locale/
	rm conf/locale/djangojs.pot
	pybabel extract -F conf/locale/babelmako.cfg -o conf/locale/mako.pot *
	pybabel update -N -D mako -i conf/locale/mako.pot -d conf/locale/
	rm conf/locale/mako.pot


compile_translations: ## compile .mo files into .po files
	pybabel compile -f -D django -d conf/locale/; \
	pybabel compile -f -D mako -d conf/locale/; \
	pybabel compile -f -D djangojs -d conf/locale/
