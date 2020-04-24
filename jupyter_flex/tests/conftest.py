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
    chrome_options.add_argument("force-device-scale-factor=2")
    return chrome_options


@pytest.fixture(scope="function")
def firefox_options(firefox_options, request):
    if request.config.getoption("headless"):
        firefox_options.add_argument('-headless')
    return firefox_options


# This is not very reliable tbh, its better to run it manually in another terminal
# from xprocess import ProcessStarter
# @pytest.fixture(scope="module")
# def voila_server(xprocess):
#     import os
#     this_dir = os.path.dirname(os.path.abspath(__file__))
#     examples_path = os.path.join(this_dir, "..", "..", "examples")
#
#     port = "8866"
#     conn = f"http://localhost:{port}"
#
#     class Starter(ProcessStarter):
#         pattern = ""
#         args = ["voila", "--debug", "--template", "flex", "--no-browser", "--port", port, "--VoilaConfiguration.file_whitelist=['.*']", examples_path]
#
#     if  not is_port_in_use(port):
#         print(f"No server running in port {port}. Starting voila server")
#         logfile = xprocess.ensure("voila_server", Starter)
#
#     return conn


# def is_port_in_use(port):
#     import socket
#     if isinstance(port, str):
#         port = int(port)
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         return s.connect_ex(('localhost', port)) == 0
