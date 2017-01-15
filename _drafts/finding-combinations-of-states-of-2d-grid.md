---
title: Finding Combinations of States of 2d Grid
layout: base
categories: gameoflife
---

# {{page.title}}

I recently started a project that maps [Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) simulations to pixels on an image. Simulations can be categorized by things like board dimensions and number of starting cells. The mapping takes every initial state of a simulation given a certain board dimension and cell count.

In order to store simulation statistics in a sane manner, it would be nice to loop through initial states of a simulation space in an orderly fashion. For the sake of brevity, we will use a 3x3 board with an initial cell count of three.

The first step is to flatten 2d coordinates so that each index is as follows:

```
0 1 2
3 4 5
6 7 8
```

This allows us to represent each cell as a list of integers:

```
                 - - X
[2, 4, 7]   ==   - X -   ==   - - X - X - - X -
                 - X -
```

Fortunately, it is both convenient and desired to have states ordered [lexicographically](https://en.wikipedia.org/wiki/Lexicographical_order). I will explain this in plain language using dashes and X's, which is similar to moving beads on an abacus.

```
XXX------
XX-X-----
XX--X----
XX---X---
XX----X--
XX-----X-
XX------X
X-XX-----
X-X-X----
X-X--X---
X-X---X--
X-X----X-
X-X-----X
X--XX----
X--X-X---
.
.
.
---X-X-X-
---X-X--X
---X--XX-
---X--X-X
---X---XX
----XXX--
----XX-X-
----XX--X
----X-XX-
----X-X-X
----X--XX
-----XXX-
-----XX-X
-----X-XX
------XXX
```

```python
from itertools import combinations

def get_all_combinations(dimensions, number_of_cells):
    # dimensions -> [rows, cols]
    number_of_spaces = dimensions[0] * dimensions[1]
    for combination in combinations(range(number_of_spaces), number_of_cells):
        yield combination
```

```python
def print_permutation(cells, number_of_spaces):
    cell_string = lambda cell, cells: 'X' if cell in cells else '-'
    board = [cell_string(cell, cells) for cell in range(number_of_spaces)]
    print(''.join(board))
```
