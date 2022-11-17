import os


class Settings:
    def __init__(self, dev_mode=None):
        if dev_mode is None:
            _ = os.environ.get("JUPYTER_FLEX_DEVMODE", "")
            dev_mode = False if _ in ["", "0"] else True
        self.dev_mode = dev_mode


settings = Settings()
