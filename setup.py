import glob
import os
import shutil
import sys

import versioneer
from setuptools import find_packages, setup
from setuptools.command.develop import develop

# -----------------------------------------------------------------------------
# Create file struture for data_files
# It takes the files on the module and copies them under `share`

data_files = []

if os.path.exists("share"):
    shutil.rmtree("share")

# Voila files
voila_prefix = "share/jupyter/voila/templates/flex"
os.makedirs(voila_prefix)
shutil.copytree(
    "jupyter_flex/nbconvert_templates",
    os.path.join(voila_prefix, "nbconvert_templates"),
)
shutil.copytree("jupyter_flex/static", os.path.join(voila_prefix, "static"))
shutil.copytree("jupyter_flex/templates", os.path.join(voila_prefix, "templates"))

for root, dirs, files in os.walk("share"):
    root_files = [os.path.join(root, i) for i in files]
    data_files.append((root, root_files))

# print("Data Files:")
# print(data_files)

# -----------------------------------------------------------------------------


def read_file(filename):
    this_dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(this_dir, filename)
    with open(filepath) as file:
        return file.read()


class DevelopCmd(develop):
    """The DevelopCmd will create symlinks for voila under:
        sys.prefix/share/jupyter
    """

    prefix_targets = [
        ("voila/templates", "jupyter_flex", "flex"),
    ]

    def run(self):
        share_jupyter_dir = os.path.join(sys.prefix, "share", "jupyter")

        for prefix_target, source, name in self.prefix_targets:
            source = os.path.abspath(source)
            target = os.path.join(share_jupyter_dir, prefix_target, name).rstrip(
                os.path.sep
            )
            target_subdir = os.path.dirname(target)
            if not os.path.exists(target_subdir):
                os.makedirs(target_subdir)
            if os.path.islink(target):
                print("Removing link:", target)
                os.remove(target)
            elif os.path.exists(target):
                print("Removing:", target)
                shutil.rmtree(target)

            print("Linking", source, "->", target)
            os.symlink(source, target)

        super(DevelopCmd, self).run()


cmdclass = versioneer.get_cmdclass()
cmdclass["develop"] = DevelopCmd

setup(
    name="jupyter-flex",
    version=versioneer.get_version(),
    description="Voila Flex Dashboards",
    long_description=read_file("README.md"),
    long_description_content_type="text/markdown",
    author="Daniel Rodriguez",
    author_email="daniel@danielfrg.com",
    url="https://github.com/danielfrg/jupyter-flex",
    license="Apache 2.0",
    python_requires=">=3.0,!=3.0.*,!=3.1.*,!=3.2.*,!=3.3.*,!=3.4.*",
    install_requires=read_file("requirements.package.txt").splitlines(),
    keywords=["jupyter", "ipython", "widgets", "voila", "nbconvert", "dashboards"],
    packages=find_packages(),
    include_package_data=True,
    data_files=data_files,
    zip_safe=False,
    cmdclass=cmdclass,
    entry_points={
        "nbconvert.exporters": ["flex = jupyter_flex:NBConvertFlexExporter"],
    },
)
