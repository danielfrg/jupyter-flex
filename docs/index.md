# Jupyter-flex: Easy interactive dashboards for Jupyter

Use Jupyter Notebooks to quickly create interactive dashboards.

-   Use Markdown headers and Jupyter Notebook cell tags to define the dashboard components
-   Flexible and easy way to specify row and column based layouts
-   Use [nbconvert](https://nbconvert.readthedocs.io/en/latest/) to create static reports
-   Use [Voila](https://github.com/voila-dashboards/voila) to start a live
    Jupyter Kernel for fully dynamic applications
-   Support for [Jupyter widgets](https://ipywidgets.readthedocs.io/en/latest/)

Inspired by [Flex Dashboards](https://rmarkdown.rstudio.com/flexdashboard/).

## Installation

<p class="code-header">Terminal</p>
```
$ pip install jupyter-flex
```

## Learning

The [Getting started](/getting-started) page goes through the basic steps of
taking a Jupyter Notebook and creating your first Jupyter-flex dashboard,
explains simple Jupyter-flex concepts such as layouts, document orientation and
explains how to use [`nbconvert`](https://nbconvert.readthedocs.io/en/latest/)
to generate a static `.html` dashboard.

The [Layouts](/layouts) page goes in depth about all the options to control the
content of Jupyter-flex dashboards.

The [Plotting](/plotting) page goes through some considerations around different
plotting libraries in Jupyter-flex dashboards.

The [Voila and Jupyter widgets](/voila-widgets/) page describes how to leverage
Voila to create dashboards that use a live Jupyter kernel that enable viewers to
change underlying parameters and see the results immediately using
[Jupyter widgets](https://ipywidgets.readthedocs.io/).

## Examples

<div class="image-grid-row">
  <figure class="image-card">
    <a href="/examples/altair.html">
        <img src="/assets/img/screenshots/plots/altair.png" alt="Jupyter-flex: altair">
    </a>
    <figcaption>Altair plots</figcaption>
  </figure>
  <figure class="image-card">
    <a href="/examples/plotly.html">
        <img src="/assets/img/screenshots/plots/plotly.png" alt="Jupyter-flex: Plotly Plots">
    </a>
    <figcaption>Plotly plots</figcaption>
  </figure>
  <figure class="image-card">
    <a href="/examples/bokeh.html">
        <img src="/assets/img/screenshots/plots/bokeh.png" alt="Jupyter-flex: Bokeh Plots">
    </a>
    <figcaption>Bokeh plots</figcaption>
  </figure>
</div>

<div class="image-grid-row">
  <figure class="image-card">
    <a href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/master?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwidgets%2Fjupyter-widgtets-gallery.ipynb">
        <img src="/assets/img/screenshots/widgets/widgets-gallery.png">
    </a>
    <figcaption>jupyter-widgets-gallery (runs in binder.org)</figcaption>
  </figure>
  <figure class="image-card">
    <a href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.6.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fplots%2Fbqplot.ipynb">
        <img src="/assets/img/screenshots/plots/bqplot.png" alt="Jupyter-flex: bqplot">
    </a>
    <figcaption>bqplot plots (runs in mybinder.org)</figcaption>
  </figure>
  <figure class="image-card">
    <a href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.6.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fmovie-explorer.ipynb">
        <img src="/assets/img/screenshots/movie-explorer.png" alt="Jupyter-flex: Movie Explorer">
    </a>
    <figcaption>Movie Explorer (runs in mybinder.org)</figcaption>
  </figure>
</div>

<div class="image-grid-row">
  <figure class="image-card">
    <a href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.6.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwealth-of-nations.ipynb">
        <img src="/assets/img/screenshots/wealth-of-nations.png" alt="Jupyter-flex: Wealth of Nations">
    </a>
    <figcaption>Wealth of Nations (runs in mybinder.org)</figcaption>
  </figure>
  <figure class="image-card">
    <a href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.6.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwealth-of-nations.ipynb">
        <img src="/assets/img/screenshots/iris-clustering.png" alt="Jupyter-flex: Iris Clustering">
    </a>
    <figcaption>Iris clustering (runs in mybinder.org)</figcaption>
  </figure>
  <figure class="image-card">
    <a href="/examples/nba-scoring.html">
        <img src="/assets/img/screenshots/nba-scoring.png" alt="Jupyter-flex: NBA Scoring">
    </a>
    <figcaption>NBA Scoring</figcaption>
  </figure>
</div>

!!! info
    Source for all examples can be found [on Github](https://github.com/danielfrg/jupyter-flex/tree/master/examples).

## Some apps developed using Jupyter-flex

-  Investment Flow Type Classification: [App](https://flow-classification.herokuapp.com/) - [Source](https://github.com/unkletam/Investment_Flow_Type_Classification)
- John Hunter - Excellence in Plotting Context: [App](https://mybinder.org/v2/gh/sbonaretti/Hunter_viz_2020/master?urlpath=%2Fvoila%2Frender%2Fopen_literature_flex.ipynb) - [Source](https://github.com/sbonaretti/Hunter_viz_2020)
