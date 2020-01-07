import time
import pytest


@pytest.fixture
def selenium2(selenium):
    selenium.set_window_size(1440, 900)
    return selenium


@pytest.mark.nondestructive
@pytest.mark.parametrize("nb_name", ["iris-clustering", "movie-explorer", "nba-scoring", "wealth-of-nations"])
def test_example_nb(needle, selenium2, base_url, nb_name):
    target_url = '{0}/voila/render/{1}.ipynb'.format(base_url, nb_name)
    needle.driver.get(target_url)

    # Wait for dashboard components to render
    time.sleep(5)

    # Take an element screen diff
    needle.assert_screenshot(f'{nb_name}')
