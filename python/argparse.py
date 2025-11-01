import math
import argparse

parser = argparse.ArgumentParser(description="Calculate volume of a cylinder.")

parser.add_argument("-r",
                    "--radius",
                    type=float,
                    metavar="",
                    required=True,
                    help="Radius of the cylinder.")

parser.add_argument("-H",
                    "--height",
                    type=float,
                    metavar="",
                    required=True,
                    help="Height of the cylinder.")

group = parser.add_mutually_exclusive_group()

group.add_argument("-q",
                   "--quiet",
                   action="store_true",
                   help="Only output the volume.")

group.add_argument("-v",
                   "--verbose",
                   action="store_true",
                   help="Output detailed calculation steps.")

args = parser.parse_args()

def cylinder_volume(radius, height):
    return math.pi * radius**2 * height

if __name__ == "__main__":
    volume = cylinder_volume(args.radius, args.height)
    if args.quiet:
        print(f"{volume:.2f}")
    elif args.verbose:
        print(f"Calculating volume of a cylinder with radius"
                "{args.radius} and height {args.height}:")

        print(f"Volume = π * radius^2 * height")
        print(f"Volume = π * {args.radius}^2 * {args.height}")
        print(f"Volume = {volume:.2f}")
    else:
        print(f"Volume of the cylinder: {volume:.2f}")
