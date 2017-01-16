---
title: Finding Combinations of States of 2d Grid
layout: base
categories: gameoflife python
---

# {{page.title}}

I recently started a project that maps [Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) simulations to pixels on an image. The project is written in [Python 3](https://docs.python.org/3/), and utilizes 3's [extended iterable unpacking](https://www.python.org/dev/peps/pep-3132/).

Each simulation takes place on a two-dimensional grid, populated with "cells". The spaces of a grid can be given a unique number

```
0 1 2
3 4 5
6 7 8
```

which  allows us to represent each cell as a tuple of integers:

```
                 - - X
(2, 4, 7)   ==   - X -   ==   --X-X--X-
                 - X -
```

One challenge, and the focus of this post, is determining every initial state of a grid given _n_ starting cells.

Fortunately, it is both convenient and desired to have states ordered [lexicographically](https://en.wikipedia.org/wiki/Lexicographical_order). The rules, in plain language, are as follows:

1. Searching from right to left, find the first cell that is able to shift one space to the right.
2. Shift the active cell to the right. If the active cell is not the right-most cell, shift all cells to the right of the active cell as far left as possible.
3. If no cells can be shifted to the right, you are done!

Rule 2 is kind of confusing, so let's look at some applications of the rules:

```
XXX---    (0, 1, 2)
XX-X--    (0, 1, 3)
XX--X-    (0, 1, 4)
XX---X    (0, 1, 5)
X-XX--    (0, 2, 3)
X-X-X-    (0, 2, 4)
X-X--X    (0, 2, 5)
X--XX-    (0, 3, 4)
X--X-X    (0, 3, 5)
X---XX    (0, 4, 5)
-XXX--    (1, 2, 3)
-XX-X-    (1, 2, 4)
-XX--X    (1, 2, 5)
-X-XX-    (1, 3, 4)
-X-X-X    (1, 3, 5)
-X--XX    (1, 4, 5)
--XXX-    (2, 3, 4)
--XX-X    (2, 3, 5)
--X-XX    (2, 4, 5)
---XXX    (3, 4, 5)
```

One way to accomplish this task is with the following, heavily-indented, [generator](https://docs.python.org/3/tutorial/classes.html#generators):

```python
def get_all_combinations(dimensions, number_of_cells):
    # dimensions is a tuple => (rows, cols)
    number_of_spaces = dimensions[0] * dimensions[1]
    cells = tuple(reversed(range(number_of_cells)))

    # yield initial state
    yield tuple(reversed(cells))

    while True:
        for index, cell in enumerate(cells):
            cell_plus = cell + 1
            if index == 0:
                # right-most cell
                if cell_plus < number_of_spaces:
                    cells = (cell_plus, *cells[1:])
                    yield tuple(reversed(cells))
                    break
            else:
                if cell_plus < cells[index - 1]:
                    shifted_cells = reversed(range(cell_plus,
                                                   cell_plus + index + 1))
                    cells = (*shifted_cells, *cells[index + 1:])
                    yield tuple(reversed(cells))
                    break
                elif index == len(cells) - 1:
                        # we are done!
                        return
```

_OR_ you could use the [Python standard library](https://docs.python.org/3/library/itertools.html).

```python
from itertools import combinations

def get_all_combinations(dimensions, number_of_cells):
    # dimensions -> [rows, cols]
    number_of_spaces = dimensions[0] * dimensions[1]
    for combination in combinations(range(number_of_spaces), number_of_cells):
        yield combination
```
