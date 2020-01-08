import os
import time
import pytest


@pytest.fixture
def selenium2(selenium):
    selenium.set_window_size(1440, 900)
    return selenium


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", ["iris-clustering", "movie-explorer", "nba-scoring", "wealth-of-nations"])
def test_example_nb(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(6)

    # Take an element screen diff
    needle.assert_screenshot(f'{nb_name}')


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", [
    "classes-colors",
])
def test_customize(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/customize/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(2)

    # Take an element screen diff
    needle.assert_screenshot(f'customize/{nb_name}')


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", [
    "one-card-full",
    "one-plot",
    "two-columns",
    "two-plots",
    "two-rows",
])
def test_getting_started(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/getting-started/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(2)

    # Take an element screen diff
    needle.assert_screenshot(f'getting-started/{nb_name}')


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", [
    "card-sections",
    "focal-chart-top-chart-size",
    "focal-chart-top",
    "grid-2x2",
    "grid-2x3",
    "orientation-columns-columns",
    "orientation-columns",
    "orientation-rows-rows",
    "orientation-rows",
    "pages",
    "sidebar-global",
    "tabs-section-columns",
    "tabs-section-rows",
])
def test_layouts(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/layouts/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(2)

    # Take an element screen diff
    needle.assert_screenshot(f'layouts/{nb_name}')


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", [
    "altair",
    "bokeh",
    "bqplot",
    "plotly",
])
def test_plots(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/plots/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'plots/{nb_name}')


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", [
    "ipywidgets",
    "mpl-histogram",
    "qgrid",
])
def test_widgets(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/widgets/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'widgets/{nb_name}')
