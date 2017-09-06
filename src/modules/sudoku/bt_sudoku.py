#!/usr/bin/python
#coding: utf-8

"""
6 4 2 9 5 7
7 9 8 2 3 1
5 3 1 4 6 8
4 1 5 8 2 3
3 7 9 5 1 6
2 8 6 7 4 9

"""

import pprint
import sys
import random

WIDTH = 9
TOTAL = WIDTH**2

def     disp(grid):
    for line in grid:
        print ' '.join(map(str,line))

def     get_empty_cell(grid):
    for y in range(WIDTH):
        for x in range(WIDTH):
            if grid[y][x] == 0:
                return (x, y)
    return None

def     valid_play(grid, ec, p):
    x, y = ec
    for i in range(WIDTH):
        if grid[y][i] == p:
            return False
        if grid[i][x] == p:
            return False
    x = (x / 3) * 3
    y = (y / 3) * 3
    for i in range(3):
        for j in range(3):
            if grid[y + i][x + j] == p:
                return False
    return True

def     bt(grid):
    ec = get_empty_cell(grid)
    if not ec:
        return True # solution reached
    for p in range(1,10):
        if valid_play(grid, ec, p):
            x, y = ec
            grid[y][x] = p
            r = bt(grid)
            if r:
                return True
            else:
                grid[y][x] = 0
    return False

def     randomInsert(grid):
    where = random.choice(range(WIDTH)), random.choice(range(WIDTH))
    print("where:", where)
    which = random.choice(range(1,10))
    print("number:", which)
    if valid_play(grid, where, which):
        y, x = where
        grid[y][x] = which
        return True
    return False

def     main():
    grid = [[0 for i in range(WIDTH)] for j in range(WIDTH)]
    i = 0
    while i < 5:
        if randomInsert(grid):
            i += 1
    disp(grid)
    print bt(grid)
    disp(grid)
    return False

if __name__ == "__main__":
    main()
