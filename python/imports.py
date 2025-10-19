import math
print(math.sqrt(4))  # works
print(sqrt(4))       # error: name 'sqrt' is not defined

from math import sqrt
print(sqrt(4))
