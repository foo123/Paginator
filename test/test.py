#!/usr/bin/env python

import os, sys

# import the Paginator.py engine (as a) module, probably you will want to place this in another dir/package
import imp
PBSModulePath = os.path.join(os.path.dirname(__file__), '../src/python/')
try:
    PBSFp, PBSPath, PBSDesc  = imp.find_module('Paginator', [PBSModulePath])
    Paginator = getattr( imp.load_module('Paginator', PBSFp, PBSPath, PBSDesc), 'Paginator' )
except ImportError as exc:
    Paginator = None
    sys.stderr.write("Error: failed to import module ({})".format(exc))
finally:
    if PBSFp: PBSFp.close()

if not Paginator:
    print ('Could not load the Paginator Module')
    sys.exit(1)

def echo(s):
    print(str(s) + "\n")
    
echo('Paginator.VERSION = ' + Paginator.VERSION + "\n")

p1 = Paginator(100, 10)

p2 = Paginator(1000, 10, 3).previousText('Prev').nextText('Next').placeholder('{page}').urlPattern('/category/{page}')

p3 = Paginator(100, 10, 2)

echo(p1)

echo(p2)

echo(p3)

echo(p1.view('mobile'))

echo(p2.view('mobile'))

echo(p3.view('mobile'))