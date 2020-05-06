import glob
import os
import shutil
import sys

from setuptools import find_packages, setup
from setuptools.command.develop import develop

setup_dir = os.path.abspath(os.path.dirname(__file__))


def read_file(filename):
    this_dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(this_dir, filename)
    with open(filepath) as file:
        return file.read()


def parse_git(root, **kwargs):
    """
    Parse function for setuptools_scm
    """
    from setuptools_scm.git import parse

    kwargs["describe_command"] = "git describe --dirty --tags --long"
    return parse(root, **kwargs)


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


setup(
    name="jupyter-flex",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    # package_data={"jupyter_flex": ["includes/**/*.c"]},
    data_files=data_files,
    # cmdclass={},
    entry_points={
        "nbconvert.exporters": ["flex = jupyter_flex:NBConvertFlexExporter"],
    },
    use_scm_version={
        "root": setup_dir,
        "parse": parse_git,
        "write_to": os.path.join("jupyter_flex/_generated_version.py"),
    },
    python_requires=">=3.6",
    setup_requires=["setuptools_scm"],
    install_requires=read_file("requirements.package.txt").splitlines(),
    description="Easily create Dashboards using Jupyter Notebooks",
    long_description=read_file("README.md"),
    long_description_content_type="text/markdown",
    license="Apache License, Version 2.0",
    maintainer="Daniel Rodriguez",
    maintainer_email="daniel@danielfrg.com",
    url="https://github.com/danielfrg/jupyter-flex",
    classifiers=[
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
    ],
    keywords=["jupyter", "ipython", "widgets", "voila", "nbconvert", "dashboards"],
)
