# Jupyter-flex: Easy interactive dashboards for Jupyter

Use Jupyter Notebooks to quickly create interactive dashboards.

- Use Markdown headers and Jupyter Notebook cell tags to define the dashboard components
- Flexible and easy way to specify row and column based layouts
- Use [nbconvert](https://nbconvert.readthedocs.io/en/latest/) to create static reports
- Use [Voila](https://github.com/voila-dashboards/voila) to start a live Jupyter Kernel for fully dynamic applications
- Support for [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/)

Inspired by [Flex Dashboards](https://rmarkdown.rstudio.com/flexdashboard/).

## Installation

<p class="code-header">Terminal</p>
```
$ pip install jupyter-flex
```

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
    <a href="/examples/plotly-plots.html">
        <img src="/assets/img/plotly-plots.png" alt="Jupyter-flex: Plotly Plots">
    </a>
    <figcaption>Plotly plots</figcaption>
  </figure>
  <figure class="image-card">
    <a href="/examples/iris-plots.html">
        <img src="/assets/img/iris-plots-bokeh.png" alt="Jupyter-flex: Iris Plots Bokeh">
    </a>
    <figcaption>Iris plots (Bokeh) </figcaption>
  </figure>
</div>

<div class="image-grid-row">
  <figure class="image-card">
    <!-- <a href="/examples/time-series.html"> -->
        <img src="/assets/img/movie-explorer.png" alt="Jupyter-flex: Movie Explorer">
    <!-- </a> -->
    <figcaption>Movie Explorer (requires voila)</figcaption>
  </figure>

  <figure class="image-card">
    <!-- <a href="/examples/time-series.html"> -->
        <img src="/assets/img/iris-clustering.png" alt="Jupyter-flex: Iris Clustering">
    <!-- </a> -->
    <figcaption>Iris clustering (requires voila)</figcaption>
  </figure>
</div>

Source for all examples can be found [on Github](https://github.com/danielfrg/jupyter-flex/tree/master/examples).

## Learning More

The [Getting started](/getting-started) page works throught creating your first Jupyter-flex dashboard based on a simple notebook,
explains simple Jupyter-flex concepts such basic layouts, document orientation
and explains how to use `nbconvert` to generate a static `.html` file with a dashboard.

The [Layout](/layout) page goes in depth about all the options to control the content of the dashboards in Jupyter-flex.

The [Voila](/voila-ipywidgets) page describes how to create dashboards that enable viewers to change underlying parameters and see the results immediately,
using Voila and IPython Widgets.
