import os
import time

import pytest

pytestmark = [
    pytest.mark.nondestructive,
    pytest.mark.layouts,
    pytest.mark.examples,
]
base_url = os.environ.get("PYTEST_BASE_URL", "http://localhost:8866")


@pytest.mark.parametrize(
    "name,path",
    [
        ("tree", ""),
        ("404", "non-existent-page-404"),
        ("404-voila", "voila/render/non-existent-page-404"),
    ],
)
def test_voila(browser, screenshot_regression, name, path):
    target_url = f"{base_url}/{path}"
    browser.visit(target_url)
    time.sleep(2)  # Wait for dashboard to render
    screenshot_regression(suffix=f"voila_{name}")


@pytest.mark.parametrize(
    "nb_name",
    [
        "focal-chart-top-card-size",
        "focal-chart-top",
        "grid-2x2",
        "grid-2x3",
        "header-columns-footer",
        "layout-fill",
        "layout-scroll",
        "pages-diff-layouts",
        "pages",
        "section-columns-columns",
        "section-columns-rows",
        "section-rows-columns",
        "section-rows-rows",
        "section-tabs-columns",
        "section-tabs-rows",
        "sidebar-global-and-pages",
        "sidebar-global",
        "sidebar-pages",
        "test-empty-sections",
        "test-empty-pages",
    ],
)
def test_layouts(browser, screenshot_regression, nb_name):
    target_url = f"{base_url}/voila/render/layouts/{nb_name}.ipynb"
    browser.visit(target_url)
    time.sleep(2)  # Wait for dashboard to render
    screenshot_regression(suffix=f"layouts_{nb_name}")


@pytest.mark.parametrize("nb_name", ["classes-colors", "custom-css"])
def test_layouts_customize(browser, screenshot_regression, nb_name):
    target_url = f"{base_url}/voila/render/layouts/customize/{nb_name}.ipynb"
    browser.visit(target_url)
    time.sleep(2)  # Wait for dashboard to render
    screenshot_regression(suffix=f"customize_{nb_name}")
