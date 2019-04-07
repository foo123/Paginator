<?php
require(dirname(__FILE__).'/../src/php/Paginator.php');

function echo_($s)
{
    echo( ((string)$s) . PHP_EOL . PHP_EOL);
}

echo_('Paginator.VERSION = ' . Paginator::VERSION . "\n");

$p1 = new Paginator(100, 10);

$p2 = (new Paginator(1000, 10, 3))
    ->previousText('Prev')
    ->nextText('Next')
    ->placeholder('{page}')
    ->urlPattern('/category/{page}')
;

$p3 = new Paginator(100, 10, 2);

echo_($p1);

echo_($p2);

echo_($p3);