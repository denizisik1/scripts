import math
import argparse

class CylinderVolumeCalculator:
    def __init__(self):
        self.parser = argparse.ArgumentParser(
            description="Calculate volume of a cylinder."
        )
        self._setup_args()
        self.args = self.parser.parse_args()

    def _setup_args(self):
        self.parser.add_argument("-r", "--radius", type=float,
                                 metavar="", required=True,
                                 help="Radius of the cylinder.")
        self.parser.add_argument("-H", "--height", type=float,
                                 metavar="", required=True,
                                 help="Height of the cylinder.")
        group = self.parser.add_mutually_exclusive_group()
        group.add_argument("-q", "--quiet", action="store_true",
                           help="Only output the volume.")
        group.add_argument("-v", "--verbose", action="store_true",
                           help="Output detailed calculation steps.")

    def calculate(self):
        return math.pi * self.args.radius ** 2 * self.args.height

    def display(self):
        volume = self.calculate()
        if self.args.quiet:
            print(f"{volume:.2f}")
        elif self.args.verbose:
            print(f"Calculating volume of a cylinder with radius "
                  f"{self.args.radius} and height {self.args.height}:")
            print("Volume = π * radius^2 * height")
            print(f"Volume = π * {self.args.radius}^2 * {self.args.height}")
            print(f"Volume = {volume:.2f}")
        else:
            print(f"Volume of the cylinder: {volume:.2f}")

if __name__ == "__main__":
    app = CylinderVolumeCalculator()
    app.display()
