import tempfile
import pathlib
from hatchling.builders.hooks.plugin.interface import BuildHookInterface

THIS_DIR = pathlib.Path(__file__).parent


class CustomHook(BuildHookInterface):

    def initialize(self, version, build_data):
        if version != "editable":
            return

        input_path = THIS_DIR / "patch-voila-paths.py"
        hook_contents = f"import sys; exec({input_path.read_text()!r})"

        # Format the hook to contain the correct path
        output_path = pathlib.Path(tempfile.mktemp()[1])
        output_path.write_text(
            hook_contents.replace(
                "@@@TEMPLATE_PATH@@@",
                str(THIS_DIR.parent / "share" / "jupyter")
            )
        )

        build_data['force_include_editable'][str(output_path)] = input_path.with_suffix(".pth").name
