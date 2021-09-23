import pytest


@pytest.fixture(scope="session")
def splinter_webdriver():
    """Splinter webdriver name."""
    return "chrome"


@pytest.fixture(scope="session")
def splinter_headless():
    return True


# Make all splinter files go into test-results
@pytest.fixture(scope="session")
def splinter_screenshot_dir():
    import os
    from pathlib import Path

    this_dir = Path(__file__).resolve().parent
    return os.path.join(this_dir, "..", "..", "test-results")


@pytest.fixture(scope="session")
def splinter_driver_kwargs():
    from selenium import webdriver

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--force-device-scale-factor=2")
    chrome_options.add_argument("--window-size=1440,900")
    return {"options": chrome_options}


# ==============================================================================
# Overwritting pytest-image-diff
# Original: https://github.com/Apkawa/pytest-image-diff/blob/master/pytest_image_diff/plugin.py


@pytest.fixture(scope="session")
def image_diff_threshold() -> float:
    """
    Set default threshold differences of images. By default - 0.001
    """
    return 0.1


# Changes the scheenshots taked to the test-results dir
@pytest.fixture(scope="session")
def image_diff_root():
    import os
    from pathlib import Path

    this_dir = Path(__file__).resolve().parent
    return os.path.join(this_dir, "..", "..", "test-results")


# Changes the reference directory to be under docs so we can serve the screenshots
@pytest.fixture(scope="session")
def image_diff_reference_dir():
    import os
    from pathlib import Path

    this_dir = Path(__file__).resolve().parent
    return os.path.join(
        this_dir, "..", "..", "..", "docs", "assets", "img", "screenshots"
    )


# We overwrite the this to save the reference into a single directory
# becuase the parameterized test make the filenames weird
# This requires the suffix to be unique between tests which is easy
@pytest.fixture(scope="function")
def _image_diff_info(request, image_diff_reference_dir, image_diff_dir):
    import os

    from pytest_image_diff.helpers import get_test_info
    from pytest_image_diff.plugin import DiffInfo

    def _factory(image, suffix=None):
        test_info = get_test_info(request)
        class_name = test_info.class_name
        # test_name = test_info.test_name
        if suffix is None:
            # Todo enumerate every call
            suffix = ""

        reference_dir = os.path.join(image_diff_reference_dir, class_name)
        screenshot_dir = os.path.join(image_diff_dir, class_name)

        reference_name = os.path.join(reference_dir, suffix + "-reference.png")
        image_name = os.path.join(screenshot_dir, suffix + "-screenshot.png")
        diff_name = os.path.join(screenshot_dir, suffix + "-diff.png")
        return DiffInfo(
            diff_name=diff_name,
            image_name=image_name,
            reference_name=reference_name,
        )

    return _factory
