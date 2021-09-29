# Jupyter-flex: Dashboards for Jupyter

Build dashboard using Jupyter Notebooks.

- Use markdown headers and Jupyter Notebook cell tags to define the dashboard components
- Flexible way to specify row and column based layouts
- Use [nbconvert](https://nbconvert.readthedocs.io/en/latest/) to create static reports
- Use [Voila](https://github.com/voila-dashboards/voila) to have a live kernel backing dashboard computations
- Support for [Jupyter widgets](https://ipywidgets.readthedocs.io/en/latest/)

## Installation

<p class="code-header">Terminal</p>
```shell
$ pip install jupyter-flex
```

## Learning

The [Getting started](/getting-started) page goes through the basic steps of
taking a Jupyter Notebook and creating your first Jupyter-flex dashboard,
explains base concepts such as layouts, document orientation and
explains how to use [`nbconvert`](https://nbconvert.readthedocs.io/en/latest/)
to generate a static `.html` dashboards.

The [Layouts](/layouts) page goes in depth about all the options to control the
content of Jupyter-flex dashboards.

The [Plotting](/plotting) page goes through some considerations around different
plotting libraries in Jupyter-flex dashboards.

The [Voila and Jupyter widgets](/voila-widgets/) page describes how to create
dashboards that use a Jupyter kernel for dashboards that require
realtime computation and how to use [Jupyter widgets](https://ipywidgets.readthedocs.io/).

## Examples

<div class="image-grid">
  <a class="image-card" href="/examples/altair.html">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/plots_altair-reference.png" alt="Jupyter-flex: altair">
      <figcaption>Altair plots</figcaption>
    </figure>
  </a>

  <a class="image-card" href="/examples/plotly.html">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/plots_plotly-reference.png" alt="Jupyter-flex: Plotly Plots">
      <figcaption>Plotly plots</figcaption>
    </figure>
  </a>

  <a class="image-card" href="/examples/bokeh.html">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/plots_bokeh-reference.png" alt="Jupyter-flex: Bokeh Plots">
      <figcaption>Bokeh plots</figcaption>
    </figure>
  </a>

  <a class="image-card" href="/examples/data-types.html">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/apps_data-types-reference.png" alt="All data types">
      <figcaption>All data types</figcaption>
    </figure>
  </a>

  <a class="image-card" href="/examples/nba-scoring.html">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/apps_nba-scoring-reference.png" alt="Jupyter-flex: NBA Scoring">
      <figcaption>NBA Scoring</figcaption>
    </figure>
  </a>

  <a class="image-card" href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.8.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwidgets%2Fwidgets-gallery.ipynb">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/widgets_widgets-gallery-reference.png">
      <figcaption>jupyter-widgets-gallery (runs in mybinder.org)</figcaption>
    </figure>
  </a>

  <a class="image-card" href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.8.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fplots%2Fbqplot.ipynb">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/plots_bqplot-reference.png" alt="Jupyter-flex: bqplot">
      <figcaption>bqplot plots (runs in mybinder.org)</figcaption>
    </figure>
  </a>

  <a class="image-card" href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.8.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fmovie-explorer.ipynb">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/apps_movie-explorer-reference.png" alt="Jupyter-flex: Movie Explorer">
      <figcaption>Movie Explorer (runs in mybinder.org)</figcaption>
    </figure>
  </a>

  <a class="image-card" href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.8.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwealth-of-nations.ipynb">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/apps_wealth-of-nations-reference.png" alt="Jupyter-flex: Wealth of Nations">
      <figcaption>Wealth of Nations (runs in mybinder.org)</figcaption>
    </figure>
  </a>

  <a class="image-card" href="https://mybinder.org/v2/gh/danielfrg/jupyter-flex/0.8.0?urlpath=%2Fvoila%2Frender%2Fexamples%2Fwealth-of-nations.ipynb">
    <figure>
      <img src="/assets/img/screenshots/jupyter_flex.tests.test_examples/apps_iris-clustering-reference.png" alt="Jupyter-flex: Iris Clustering">
      <figcaption>Iris clustering (runs in mybinder.org)</figcaption>
    </figure>
  </a>
</div>

!!! info
    Source for all examples can be found [on Github](https://github.com/danielfrg/jupyter-flex/tree/master/examples).

## Some apps developed using Jupyter-flex

-  Investment Flow Type Classification: [App](https://flow-classification.herokuapp.com/) - [Source](https://github.com/unkletam/Investment_Flow_Type_Classification)
- John Hunter - Excellence in Plotting Context: [App](https://mybinder.org/v2/gh/sbonaretti/Hunter_viz_2020/master?urlpath=%2Fvoila%2Frender%2Fopen_literature_flex.ipynb) - [Source](https://github.com/sbonaretti/Hunter_viz_2020)
