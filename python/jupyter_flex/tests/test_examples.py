import os
import time

import pytest


pytestmark = [pytest.mark.nondestructive, pytest.mark.examples]


base_url = os.environ.get("PYTEST_BASE_URL", "http://localhost:8866")


@pytest.mark.plots
@pytest.mark.parametrize(
    "nb_name",
    [
        "altair-scroll",
        "altair-single",
        "altair",
        "bokeh-single",
        "bokeh",
        "bqplot-single",
        "bqplot",
        "plotly-single",
        "plotly",
        "plots-mixed-content",
    ],
)
def test_plots(browser, screenshot_regression, nb_name):
    target_url = f"{base_url}/voila/render/plots/{nb_name}.ipynb"
    browser.visit(target_url)
    time.sleep(2)  # Wait for dashboard to render
    screenshot_regression(suffix=f"plots_{nb_name}")


@pytest.mark.apps
@pytest.mark.parametrize(
    "nb_name",
    [
        "data-types",
        "iris-clustering",
        "movie-explorer",
        "nba-scoring",
        "wealth-of-nations",
    ],
)
def test_apps(browser, screenshot_regression, nb_name):
    target_url = "{0}/voila/render/{1}.ipynb".format(base_url, nb_name)
    target_url = f"{base_url}/voila/render/{nb_name}.ipynb"
    browser.visit(target_url)
    time.sleep(2)  # Wait for dashboard to render
    screenshot_regression(suffix=f"apps_{nb_name}")


# @pytest.mark.parametrize(
#     "nb_name", ["1-one-plot", "2-two-plots", "3-two-columns", "4-two-rows"]
# )
# def test_getting_started(needle, myselenium, base_url, nb_name):
#     target_url = "{0}/voila/render/getting-started/{1}.ipynb".format(base_url, nb_name)
#     needle.driver.get(target_url)

#     # Wait for dashboard to render
#     time.sleep(5)

#     # Take an element screen diff
#     needle.assert_screenshot(f"getting-started/{nb_name}", threshold=250000)


# @pytest.mark.parametrize(
#     "nb_name", ["linked", "matplotlib", "multiplier", "widget-gallery"]
# )
# def test_illusionist(needle, myselenium, base_url, nb_name):
#     target_url = "{0}/voila/render/illusionist/{1}.ipynb".format(base_url, nb_name)
#     needle.driver.get(target_url)

#     # Wait for dashboard to render
#     time.sleep(5)

#     # Take an element screen diff
#     needle.assert_screenshot(f"illusionist/{nb_name}", threshold=250000)


# @pytest.mark.parametrize(
#     "nb_name",
#     [
#         "ipyleaflet",
#         "ipysheet",
#         "mpl-histogram",
#         "qgrid",
#         "widgets-gallery",
#         "widgets-sidebar",
#     ],
# )
# def test_widgets(needle, myselenium, base_url, nb_name):
#     target_url = "{0}/voila/render/widgets/{1}.ipynb".format(base_url, nb_name)
#     needle.driver.get(target_url)

#     # Wait for dashboard to render
#     time.sleep(10)

#     # Take an element screen diff
#     needle.assert_screenshot(f"widgets/{nb_name}", threshold=250000)
