"use strict";
var Paginator = require(__dirname+'/../src/js/Paginator.js');

function echo(s)
{
    console.log(String(s) + "\n");
}

echo('Paginator.VERSION = ' + Paginator.VERSION + "\n");

var p1 = new Paginator(100, 10);

var p2 = (new Paginator(1000, 10, 3))
    .previousText('Prev')
    .nextText('Next')
    .placeholder('{page}')
    .urlPattern('/category/{page}')
;

var p3 = new Paginator(100, 10, 2);

echo(p1);

echo(p2);

echo(p3);

echo(p1.view('mobile'));

echo(p2.view('mobile'));

echo(p3.view('mobile'));