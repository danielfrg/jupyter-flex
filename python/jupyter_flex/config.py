import os


class Settings:
    def __init__(self, dev_mode=None):
        if dev_mode is None:
            _ = os.environ.get("ILLUSIONIST_DEV_MODE", "")
            dev_mode = False if _ in ["", "0"] else True
        self.dev_mode = dev_mode

        this_dir = os.path.dirname(os.path.realpath(__file__))
        self.templates_dir = os.path.join(this_dir, "templates")


settings = Settings()
