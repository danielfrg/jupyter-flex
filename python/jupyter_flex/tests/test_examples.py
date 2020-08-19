import time

import pytest


pytestmark = [pytest.mark.nondestructive, pytest.mark.selenium]


@pytest.fixture
def myselenium(selenium):
    selenium.set_window_size(1440, 900)
    return selenium


def test_example_site(needle, myselenium):
    target_url = "http://example.com/"
    needle.driver.get(target_url)

    # Take an element screen diff
    needle.assert_screenshot("example_site", threshold=300000)


@pytest.mark.parametrize("name,path", [("tree", ""), ("404", "/intentional-404")])
def test_voila(needle, myselenium, base_url, name, path):
    target_url = "{0}/{1}".format(base_url, path)
    needle.driver.get(target_url)

    # Wait for page components to render
    time.sleep(2)

    # Take an element screen diff
    needle.assert_screenshot(f"voila-{name}", threshold=300000)


@pytest.mark.parametrize(
    "nb_name", ["iris-clustering", "movie-explorer", "nba-scoring", "wealth-of-nations"]
)
def test_apps(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f"{nb_name}", threshold=800000)


@pytest.mark.parametrize("nb_name", ["classes-colors", "custom-css"])
def test_customize(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/customize/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f"customize/{nb_name}", threshold=800000)


@pytest.mark.parametrize(
    "nb_name", ["one-plot", "two-columns", "two-plots", "two-rows"]
)
def test_getting_started(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/getting-started/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f"getting-started/{nb_name}", threshold=800000)


@pytest.mark.parametrize(
    "nb_name",
    [
        "card-complete",
        "focal-chart-top-card-size",
        "focal-chart-top",
        "grid-2x2",
        "grid-2x3",
        "pages",
        "section-columns-columns",
        "section-columns",
        "section-rows-rows",
        "section-rows",
        "section-tabs-columns",
        "section-tabs-rows",
        "sidebar-global",
        "sidebar-pages",
    ],
)
def test_layouts(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/layouts/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f"layouts/{nb_name}", threshold=800000)


@pytest.mark.parametrize(
    "nb_name",
    [
        "altair-single",
        "altair",
        "altair-scroll",
        "bokeh-single",
        "bokeh",
        "bqplot-single",
        "bqplot",
        "plotly-single",
        "plotly",
    ],
)
def test_plots(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/plots/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f"plots/{nb_name}", threshold=800000)


@pytest.mark.parametrize(
    "nb_name",
    [
        "ipyleaflet",
        "ipywidgets-gallery",
        "ipywidgets-sidebar",
        "mpl-histogram",
        "qgrid",
        "ipysheet",
    ],
)
def test_widgets(needle, myselenium, base_url, nb_name):
    target_url = "{0}/voila/render/widgets/{1}.ipynb".format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(10)

    # Take an element screen diff
    needle.assert_screenshot(f"widgets/{nb_name}", threshold=800000)
