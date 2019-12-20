# Jupyter-flex: Easy interactive dashboards for Jupyter

Use Jupyter Notebooks to quickly create interactive dashboards.

- Use [Voila](https://github.com/voila-dashboards/voila) to start a live Jupyter Kernel for fully dynamic applications
- Support for [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/)
- Flexible and easy to specify row and column-based layouts
- Use Markdown headers and Jupyter Notebook cell tags to define the dashboard
- Use [nbconvert](https://nbconvert.readthedocs.io/en/latest/) to create static reports with the same layout

Inspired by [Flex Dashboards](https://rmarkdown.rstudio.com/flexdashboard/).

## Examples

<div class="image-grid-row">
  <figure class="image-card">
    <a href="/examples/nba-scoring.html">
        <img src="/assets/img/nba-scoring.png" alt="Jupyter-flex: NBA Scoring">
    </a>
    <figcaption>NBA Scoring</figcaption>
  </figure>
  <figure class="image-card">
    <a href="/examples/time-series.html">
        <img src="/assets/img/time-series.png" alt="Jupyter-flex: Time Series">
    </a>
    <figcaption>Time Series</figcaption>
  </figure>
</div>

<div class="image-grid-row">
  <figure class="image-card">
    <a href="/examples/iris-plots.html">
        <img src="/assets/img/iris-plots.png" alt="Jupyter-flex: Iris Plots">
    </a>
    <figcaption>NBA Scoring</figcaption>
  </figure>
  <figure class="image-card">
    <!-- <a href="/examples/time-series.html"> -->
        <img src="/assets/img/iris-clustering.png" alt="Jupyter-flex: Iris Clustering">
    <!-- </a> -->
    <figcaption>Iris clustering (runs in binder)</figcaption>
  </figure>
</div>

## Installation

<p class="code-header">Terminal</p>
```
$ pip install jupyter-flex
```

## Learning More

The [Getting started](/getting-started) page works throught creating your first Jupyter-flex dashboard based on a simple notebook,
explains simple Jupyter-flex concepts such badsic layours as document orientation
and explains how to use `nbconvert` to generate a static `.html` file with a dashboard.

The [Voila](/voila-ipywidgets) page describes how to create dashboards that enable viewers to change underlying parameters and see the results immediately,
using Voila and IPython Widgets.
