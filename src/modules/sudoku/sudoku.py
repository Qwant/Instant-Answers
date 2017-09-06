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

WIDTH = 6
TOTAL = WIDTH**2

def     disp(grid):
    for i in range(WIDTH):
        print ' '.join(map(str,grid[i*WIDTH:(i+1)*WIDTH]))

def     adjustPoss(poss, where, which):
    x = where % WIDTH
    y = where / WIDTH
    pprint.pprint({'x':x,'y':y})
    for i in range(WIDTH):
        #print (x + i * WIDTH, y * WIDTH + i), poss[x + i * WIDTH], poss[y * WIDTH + i]
        try:
            poss[x + i * WIDTH].remove(which)
        except:
            pass
        try:
            poss[y * WIDTH + i].remove(which)
        except:
            pass
    a = x / 3
    b = y / 3
    for i in range(3):
        for j in range(3):
            #print a * 3 + i, b * 3 + j
            #print (b * 3 + j) * WIDTH + (a * 3 + i)
            p = (b * 3 + j) * WIDTH + (a * 3 + i)
            try:
                poss[p].remove(which)
            except:
                pass

def     randomInsert(grid, poss):
    freespots = [i for i, a in enumerate(grid) if a == 0]
    pprint.pprint(freespots)
    where = random.choice(freespots)
    print("where:", where)
    which = random.choice(poss[where])
    print("number:", which)
    poss[where].append(which) # opti because double remove below
    #print poss
    #adjustPoss(poss, where, which)
    try:
        #pass
        adjustPoss(poss, where, which)
        grid[where] = which
        print poss
    except:
        grid[where] = 0
        print 'Could not put', which, 'on', where, "x:%d y:%d"%(1+where%WIDTH,1+where/WIDTH)
        print poss
        poss[where].remove(which)

def     main():
    stop = False
    while not stop:
        grid = [0] * TOTAL
        #poss = [range(1,10)] * TOTAL # bad idea
        poss = []
        for i in range(TOTAL):
            poss.append(range(1,10))

        pprint.pprint(grid)
        pprint.pprint(poss)
        for i in range(300):
            try:
                randomInsert(grid, poss)
            except:
                pass#print poss
            disp(grid)
        print poss
        print grid.count(0)
        if grid.count(0) == 0:
            break
    return False

if __name__ == "__main__":
    main()
