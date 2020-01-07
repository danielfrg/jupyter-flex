import pytest
from xprocess import ProcessStarter


def pytest_addoption(parser):
    group = parser.getgroup('selenium', 'selenium')
    group._addoption('--headless',
                     action='store_true',
                     help='enable headless mode for supported browsers.')


@pytest.fixture(scope="module")
def voila_server(xprocess):
    import os
    this_dir = os.path.dirname(os.path.abspath(__file__))
    examples_path = os.path.join(this_dir, "..", "..", "examples")

    port = "8866"
    conn = f"http://localhost:{port}"

    class Starter(ProcessStarter):
        # pattern = conn
        args = ["voila", "--template", "flex", "--no-browser", "--port", port, examples_path]

    logfile = xprocess.ensure("voila_server", Starter)
    return conn


@pytest.fixture(scope="module")
def chrome_options(chrome_options, pytestconfig):
    if pytestconfig.getoption('headless'):
        chrome_options.add_argument('headless')
    return chrome_options
