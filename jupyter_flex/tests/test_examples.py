import os
import time
import pytest


@pytest.fixture
def selenium2(selenium):
    selenium.set_window_size(1440, 900)
    return selenium


markers = [pytest.mark.nondestructive]
if os.environ.get("CIRCLECI", None):
    markers.append(pytest.mark.xfail)
pytestmark = markers


@pytest.mark.parametrize("nb_name", ["iris-clustering", "movie-explorer", "nba-scoring", "wealth-of-nations"])
def test_example_nb(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'{nb_name}')


@pytest.mark.parametrize("nb_name", [
    "classes-colors",
    "custom-css",
])
def test_customize(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/customize/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'customize/{nb_name}')


@pytest.mark.parametrize("nb_name", [
    "one-plot",
    "two-columns",
    "two-plots",
    "two-rows",
])
def test_getting_started(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/getting-started/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'getting-started/{nb_name}')


@pytest.mark.parametrize("nb_name", [
    "card",
    "focal-chart-top-card-size",
    "focal-chart-top",
    "grid-2x2",
    "grid-2x3",
    "pages",
    "pages-sidebar",
    "section-columns-columns",
    "section-columns",
    "section-rows-rows",
    "section-rows",
    "section-tabs-columns",
    "section-tabs-rows",
])
def test_layouts(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/layouts/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'layouts/{nb_name}')


@pytest.mark.parametrize("nb_name", [
    "altair-simple",
    "altair",
    "altair-scroll",
    "bokeh-simple",
    "bokeh",
    "bqplot-simple",
    "bqplot",
    "plotly-simple",
    "plotly",
])
def test_plots(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/plots/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'plots/{nb_name}')


@pytest.mark.parametrize("nb_name", [
    "ipyleaflet",
    "ipywidgets-gallery",
    "ipywidgets-sidebar",
    "mpl-histogram",
    "qgrid",
])
def test_widgets(voila_server, needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/widgets/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'widgets/{nb_name}')
