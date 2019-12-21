import os
import sys
import glob
import shutil
from setuptools import setup
from setuptools import find_packages
from setuptools.command.develop import develop
import versioneer

# -----------------------------------------------------------------------------
# Create the files for the data_files
# It takes the files on the module and copies them under `share`

data_files = []

# Create data_files
if os.path.exists("share"):
    shutil.rmtree("share")

# Voila files
voila_prefix = "share/jupyter/voila/templates/flex"
os.makedirs(voila_prefix)
shutil.copytree("jupyter_flex/nbconvert_templates", os.path.join(voila_prefix, "nbconvert_templates"))
shutil.copytree("jupyter_flex/static", os.path.join(voila_prefix, "static"))
shutil.copytree("jupyter_flex/templates", os.path.join(voila_prefix, "templates"))

# nbconvert files
nbconvert_prefix = "share/jupyter/nbconvert/templates/html"
os.makedirs(nbconvert_prefix)
for file in glob.glob(r"jupyter_flex/nbconvert_templates/*"):
    if os.path.basename(file).startswith("flex"):
        shutil.copy(file, nbconvert_prefix)

for root, dirs, files in os.walk("share"):
    root_files = [os.path.join(root, i) for i in files]
    data_files.append((root, root_files))

print("Data Files:")
print(data_files)

# -----------------------------------------------------------------------------

def read_file(filename):
    this_dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(this_dir, filename)
    with open(filepath) as file:
        return file.read()


class DevelopCmd(develop):
    """The DevelopCmd will create symlinks for nbconvert and voila
    to `sys.prefix/share/jupyter`
    """
    prefix_targets = [
        ("voila/templates", "jupyter_flex", "flex"),
        ("nbconvert/templates/html", "jupyter_flex/nbconvert_templates", ""),
    ]

    def run(self):
        prefix_dir = os.path.join(sys.prefix, "share", "jupyter")

        for prefix_target, source, name in self.prefix_targets:
            source = os.path.abspath(source)
            target = os.path.join(prefix_dir, prefix_target, name).rstrip(os.path.sep)
            target_subdir = os.path.dirname(target)
            if not os.path.exists(target_subdir):
                os.makedirs(target_subdir)
            try:
                os.remove(target)
            except Exception as e:
                print("Error:", e)
                pass

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
    author_email="df.rodriguez143@gmail.com",
    url="https://github.com/danielfrg/jupyter-flex",
    license="Apache 2.0",
    python_requires=">=3.0,!=3.0.*,!=3.1.*,!=3.2.*,!=3.3.*",
    install_requires=read_file("requirements.package.txt").splitlines(),
    keywords=["jupyter", "ipython", "widgets", "voila", "nbconvert", "dashboards"],
    packages=find_packages(),
    include_package_data=True,
    data_files=data_files,
    zip_safe=False,
    cmdclass=cmdclass,
)
