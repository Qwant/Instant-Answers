#coding: utf-8

import pprint
import sys
import random

WIDTH = 3
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
        poss[x + i * WIDTH].remove(which)
        poss[y * WIDTH + i].remove(which)

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
    grid = [0] * TOTAL
    #poss = [range(1,10)] * TOTAL # bad idea
    poss = []
    for i in range(TOTAL):
        poss.append(range(1,10))

    pprint.pprint(grid)
    pprint.pprint(poss)
    for i in range(10):
        try:
            randomInsert(grid, poss)
        except:
            pass#print poss
        disp(grid)
    print poss
    return False

if __name__ == "__main__":
    main()
