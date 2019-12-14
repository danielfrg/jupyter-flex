import os
import sys
import tempfile
import contextlib
from setuptools import setup
from setuptools.command.develop import develop


def get_home_dir():
    """Get the real path of the home directory
    Taken from jupyter_core/paths.py
    """
    homedir = os.path.expanduser('~')
    # Next line will make things work even when /home/ is a symlink to
    # /usr/home as it is on FreeBSD, for example
    homedir = os.path.realpath(homedir)
    return homedir


_dtemps = {}
def _mkdtemp_once(name):
    """Make or reuse a temporary directory.
    If this is called with the same name in the same process, it will return
    the same directory.
    Taken from jupyter_core/paths.py
    """
    try:
        return _dtemps[name]
    except KeyError:
        d = _dtemps[name] = tempfile.mkdtemp(prefix=name + '-')
        return d


def jupyter_config_dir():
    """Get the Jupyter config directory for this platform and user.
    Returns JUPYTER_CONFIG_DIR if defined, else ~/.jupyter
    """
    homedir = get_home_dir()

    if os.environ.get("JUPYTER_NO_CONFIG"):
        return _mkdtemp_once("jupyter-clean-cfg")

    if os.environ.get("JUPYTER_CONFIG_DIR"):
        return os.environ["JUPYTER_CONFIG_DIR"]

    return os.path.join(homedir, ".jupyter")


def user_dir():
    homedir = get_home_dir()

    if sys.platform == "darwin":
        return os.path.join(homedir, "Library", "Jupyter")
    elif os.name == "nt":
        appdata = os.environ.get("APPDATA", None)
        if appdata:
            return os.path.join(appdata, "jupyter")
        else:
            return os.path.join(jupyter_config_dir(), "data")
    else:
        # Linux, non-OS X Unix, AIX, etc.
        xdg = os.environ.get("XDG_DATA_HOME", None)
        if not xdg:
            xdg = os.path.join(homedir, ".local", "share")
        return os.path.join(xdg, "jupyter")


class DevelopCmd(develop):
    prefix_targets = [
        ("voila/templates", "flex"),
    ]

    def run(self):
        # Default is environment/share/jupyter
        target_dir = os.path.join(sys.prefix, "share", "jupyter")
        # If --user then install it to the correct OS location
        if "--user" in sys.prefix:
            target_dir = user_dir()

        for prefix_target, name in self.prefix_targets:
            source = os.path.join(name)
            target = os.path.join(target_dir, prefix_target, name)
            target_subdir = os.path.dirname(target)
            if not os.path.exists(target_subdir):
                os.makedirs(target_subdir)
            try:
                os.remove(target)
            except:
                pass

            rel_source = os.path.relpath(os.path.abspath(source), os.path.abspath(target_subdir))
            print("Linking", rel_source, "->", target)
            os.symlink(rel_source, target)

        super(DevelopCmd, self).run()


# WARNING: all files generates during setup.py will not end up in the source distribution
data_files = []
# Add all the templates
for (dirpath, dirnames, filenames) in os.walk("flex/"):
    if filenames:
        data_files.append((dirpath, [os.path.join(dirpath, filename) for filename in filenames]))


print(data_files)

setup(
    name="voila-flex",
    version="0.1.0",
    description="Voila Flex Dashboards",
    data_files=data_files,
    install_requires=["voila>=0.1.11,<0.2"],
    include_package_data=True,
    author="Daniel Rodriguez",
    author_email="df.rodriguez143@gmail.com",
    url="https://github.com/danielfrg/voila-flex",
    keywords=[
        "ipython",
        "jupyter",
        "widgets",
        "voila"
    ],
    cmdclass={
        "develop": DevelopCmd,
   },
)
