import pytest

pytestmark = [pytest.mark.nondestructive]


def test_import():
    import jupyter_flex

    jupyter_flex.__version__
