# EOL UCHILE Theme

Eol Uchile Theme for [eol.uchile.cl](eol.uchile.cl). This theme must be used as *eol-uchile-2020* in OpenedX.

### Creating translation catalogues:

Create this folder structure in your theme folder: your-theme-folder/conf/locale.

Inside the locale folder, create a new file called: babel.cfg and copy the contents of eol-uchile-2020/conf/locale/babel.cfg to this file. You can edit this file according to the requirements of your theme.

Then go to the Makefile in the root path of the project and find lang_targets variable, this is a list of the languages you want to enable in your theme; These languages must be in ISO code: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

Finally run: *make create_translations_catalogs*, this command will extract all the strings from your templates and create the django.po and djangojs.po files that contain the strings to translated.

### Configuring edx-platform:

For edx-platform to know the translation catalogue in your theme, you need to configure COMPREHENSIVE_THEME_LOCALE_PATHS, this is a list containing the path of the translation catalogues in your theme e.g. /openedx/themes/eol-uchile-2020/conf/locale. This path must be the container or server path.

### Translating catalogues and compiling files:

Depending on the languages you have enabled you can add the custom translations directly to the django.po and djangojs.po files. When all the strings are manually translated, run: *make compile_translations* to create the django.mo and djangojs.mo files. These are the compiled files used in edx-platform.

### Commands

**Install**

    docker run -it --rm -w /code -v $(pwd):/code python:3.8 bash
    pip install -r requirements.txt
    make create_translations_catalogs
    add your translation in .po files

**Compile**

    docker run -it --rm -w /code -v $(pwd):/code python:3.8 bash
    pip install -r requirements.txt
    make compile_translations