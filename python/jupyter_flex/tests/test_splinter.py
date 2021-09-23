import pytest

pytestmark = [pytest.mark.nondestructive]


def test_browsers(browser, screenshot_regression):
    browser.visit("http://example.com")
    screenshot_regression(suffix="example")
