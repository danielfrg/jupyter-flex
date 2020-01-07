import pytest
from xprocess import ProcessStarter


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
