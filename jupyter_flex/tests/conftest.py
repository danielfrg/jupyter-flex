import pytest


def pytest_addoption(parser):
    group = parser.getgroup("selenium", "selenium")
    group._addoption("--headless",
                     action="store_true",
                     help="enable headless mode for supported browsers.")


@pytest.fixture(scope="function")
def chrome_options(chrome_options, request):
    if request.config.getoption("headless"):
        chrome_options.add_argument("headless")
    return chrome_options