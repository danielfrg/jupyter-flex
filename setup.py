import os
import sys
import tempfile
import contextlib
from setuptools import setup
from setuptools.command.develop import develop


this_dir = os.path.abspath(os.path.dirname(__file__))

def read_file(filename):
    filepath = os.path.join(this_dir, filename)
    with open(filepath) as file:
        return file.read()


requirements = read_file("requirements.txt").splitlines()


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
        ("voila/templates", "flex", "flex"),
        ("nbconvert/templates/html", "flex/nbconvert_templates", ""),
    ]

    def run(self):
        # Default location is `{environment}/share/jupyter`
        prefix_dir = os.path.join(sys.prefix, "share", "jupyter")
        # If --user then install it to the correct OS location
        if "--user" in sys.prefix:
            prefix_dir = user_dir()

        for prefix_target, source, name in self.prefix_targets:
            source = os.path.abspath(source)
            target = os.path.join(prefix_dir, prefix_target, name).rstrip(os.path.sep)
            target_subdir = os.path.dirname(target)
            print("!!!!", prefix_target, target_subdir, source, name)
            if not os.path.exists(target_subdir):
                os.makedirs(target_subdir)
            try:
                os.remove(target)
            except:
                pass

            print("Linking", source, "->", target)
            os.symlink(source, target)

        super(DevelopCmd, self).run()


# Create data_files
data_files = []

# Voila files get added to `share/jupyter/voila/flex/{}`
def voila_prefix(*args):
    return os.path.join("share", "jupyter", "voila", "templates", *args)

for (dirpath, dirnames, filenames) in os.walk("flex/"):
    if filenames:
        files = [voila_prefix(dirpath, filename) for filename in filenames]
        data_files.append((voila_prefix(dirpath), files))

# NBConvert files are added to `share/jupyter/nbconvert/html/{}`
# We prefix the files `flex-` for conflicts with other templates
def nbconvert_prefix(*args):
    return os.path.join("share", "jupyter", "nbconvert", "templates", "html", *args)

for (dirpath, dirnames, filenames) in os.walk("flex/nbconvert_templates/"):
    dirpath = ""  # Remove the nbconvert_templates
    if filenames:
        files = []
        for filename in filenames:
            fname, ext = os.path.splitext(filename)
            print(fname)
            filename = filename if fname.startswith("flex") else "flex-{}{}".format(fname, ext)
            files.append(nbconvert_prefix(filename))
        data_files.append((nbconvert_prefix(dirpath), files))

print("Data Files:")
print(data_files)

setup(
    name="jupyter-flex",
    version="0.1.0",
    description="Voila Flex Dashboards",
    data_files=data_files,
    include_package_data=True,
    author="Daniel Rodriguez",
    author_email="df.rodriguez143@gmail.com",
    url="https://github.com/danielfrg/jupyter-flex",
    python_requires=">=3.0,!=3.0.*,!=3.1.*,!=3.2.*,!=3.3.*",
    install_requires=requirements,
    keywords=[
        "ipython",
        "jupyter",
        "widgets",
        "voila",
        "nbconvert"
    ],
    cmdclass={
        "develop": DevelopCmd,
   }
)
