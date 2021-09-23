import os
import time

import pytest

pytestmark = [
    pytest.mark.nondestructive,
    pytest.mark.illusionist,
    pytest.mark.skip,
]
base_url = os.environ.get("PYTEST_BASE_URL", "http://localhost:8866")


@pytest.mark.parametrize(
    "nb_name", ["linked", "matplotlib", "multiplier", "widget-gallery"]
)
def test_illusionist(browser, screenshot_regression, nb_name):
    target_url = f"{base_url}/voila/render/illusionist/{nb_name}.ipynb"
    browser.visit(target_url)
    time.sleep(3)  # Wait for dashboard to render
    screenshot_regression(suffix=f"illusionist_{nb_name}")
