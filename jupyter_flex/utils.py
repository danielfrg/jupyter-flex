import pkg_resources
from pip._internal.utils.misc import dist_is_editable


distributions = {v.key: v for v in pkg_resources.working_set}
DEV_MODE = dist_is_editable(distributions["jupyter-flex"])
# DEV_MODE = False
del distributions
