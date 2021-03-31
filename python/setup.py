import os
import sys

from setuptools import find_packages, setup
from setuptools.command.develop import develop


setup_dir = os.path.abspath(os.path.dirname(__file__))


def read_file(filename):
    filepath = os.path.join(setup_dir, filename)
    with open(filepath) as file:
        return file.read()


scm_version_write_to_prefix = os.environ.get(
    "SETUPTOOLS_SCM_VERSION_WRITE_TO_PREFIX", setup_dir
)


def parse_git(root, **kwargs):
    from setuptools_scm.git import parse

    kwargs["describe_command"] = 'git describe --dirty --tags --long --match "[0-9].*"'
    return parse(root, **kwargs)


def get_data_files():
    # Add the templates
    data_files = []
    for (dirpath, dirnames, filenames) in os.walk("share/jupyter/"):
        if filenames:
            data_files.append(
                (dirpath, [os.path.join(dirpath, filename) for filename in filenames])
            )
    return data_files


class DevelopCmd(develop):
    """The DevelopCmd will create symlinks for nbconvert and voila under:
    sys.prefix/share/jupyter/
    """

    prefix_targets = [
        ("share/jupyter/nbconvert/templates", "flex"),
        ("share/jupyter/voila/templates", "flex"),
    ]

    def run(self):
        for parent, name in self.prefix_targets:
            source = os.path.join(os.path.abspath(parent), name)
            target = os.path.join(sys.prefix, parent, name)
            target = target.rstrip(os.path.sep)
            print(source, target)

            if not os.path.exists(os.path.dirname(target)):
                print("Creating:", os.path.dirname(target))
                os.makedirs(os.path.dirname(target))

            if os.path.islink(target):
                print("Removing link:", target)
                os.remove(target)

            print("Linking", source, "->", target)
            os.symlink(source, target)

        super(DevelopCmd, self).run()


setup(
    name="jupyter-flex",
    use_scm_version={
        "root": os.path.dirname(setup_dir),
        "parse": parse_git,
        "write_to": os.path.join(
            scm_version_write_to_prefix, "jupyter_flex/_generated_version.py"
        ),
    },
    packages=find_packages(),
    # package_dir={"": "src"},
    zip_safe=False,
    include_package_data=True,
    package_data={"jupyter_flex": ["static/*"]},
    data_files=get_data_files(),
    cmdclass={"develop": DevelopCmd},
    entry_points={
        "nbconvert.exporters": [
            "flex = jupyter_flex:FlexExporter",
            "flex-illusionist = jupyter_flex:FlexIllusionistExporter",
        ]
    },
    options={"bdist_wheel": {"universal": "1"}},
    python_requires=">=3.7",
    setup_requires=["setuptools_scm"],
    install_requires=read_file("requirements.txt").splitlines(),
    extras_require={
        "test": ["pytest", "pytest-cov", "toml"],
        "dev": read_file("requirements-dev.txt").splitlines(),
    },
    description="Build dashboards using Jupyter Notebooks",
    long_description=read_file("README.md"),
    long_description_content_type="text/markdown",
    license="Apache License, Version 2.0",
    maintainer="Daniel Rodriguez",
    maintainer_email="daniel@danielfrg.com",
    url="https://github.com/danielfrg/jupyter-flex",
    keywords=[
        "jupyter",
        "widgets",
        "ipywidgets",
        "voila",
        "nbconvert",
        "dashboards",
    ],
    classifiers=[
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
)
