# jupyter-flex: Easy interactive dashboards for Jupyter

[![PyPI version](https://badge.fury.io/py/mkdocs-jupyter.svg)](https://pypi.org/project/jupyter-flex/)
[![Docs](https://api.netlify.com/api/v1/badges/cba69018-b4a3-4015-9b9c-7f936304afa2/deploy-status)](https://jupyter-flex.netlify.com/)

Quickly create interactive dashboards using Jupyter Notebooks.

Dashboards can be completly dynamic and backed by a running Jupyter Kernel using [Voila](https://github.com/voila-dashboards/voila)
or static files using [nbconvert](https://nbconvert.readthedocs.io/en/latest/).

Inspired by [Flex Dashboards](https://rmarkdown.rstudio.com/flexdashboard/).

## Installation

```
pip install jupyter-flex
```

## Usage

Look at the `examples` directory.

## Voila

To start a Jupyter kernel that has computation.
This is specially useful with `ipywidgets`.

```
voila --template flex iris-clustering.ipynb
```

A browser window will open with your live dashboard.

### NBConvert

To create a single file with the dashboard use `nbconvert`:

```
nbconvert --template flex examples/nba-scoring.ipynb

# Add --execute if you want to execute the notebook before
jupyter-nbconvert --template=flex.tpl --execute nba-scoring.ipynb
```

Open `nba-scoring.html` in a browser.
