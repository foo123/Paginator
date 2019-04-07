/**
*  Paginator
*  Simple and versatile Pagination utility class for PHP, Python, Node.js / Browser Javascript
*
*  @version: 1.0.0
*  https://github.com/foo123/Paginator
*
**/
!function( root, name, factory ){
"use strict";
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if ( ('undefined'!==typeof System)&&('function'===typeof System.register)&&('function'===typeof System['import']) ) /* ES6 module */
    System.register(name,[],function($__export){$__export(name, factory.call(root));});
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(  /* current root */          'undefined' !== typeof self ? self : this,
    /* module name */           "Paginator",
    /* module factory */        function ModuleFactory__Paginator( undef ){
"use strict";

var html_esc_re = /[&<>'"]/g;
function htmlspecialchars( s )
{
    return String(s).replace(html_esc_re, function( m ){
        switch(m)
        {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            default: return m;
        }
    });
}

function Paginator( totalItems, itemsPerPage, currentPage, urlPattern, placeholder )
{
    this.totalItems = +totalItems;
    this.itemsPerPage = +itemsPerPage;
    this.currentPage = +currentPage;
    this.urlPattern = String(urlPattern||'');
    if ( null != placeholder )
        this.placeholder = String(placeholder);

    this.computeNumPages();
}
Paginator.VERSION = '1.0.0';
Paginator.prototype = {
    constructor: Paginator,

    totalItems: 0,
    numPages: 0,
    itemsPerPage: 0,
    currentPage: 0,
    urlPattern: '',
    maxPagesToShow: 10,
    placeholder: '(:page)',
    previousText: '&laquo; Previous',
    nextText: 'Next &raquo;',

    computeNumPages: function( ) {
        this.numPages = (0 === this.itemsPerPage ? 0 : Math.ceil(this.totalItems/this.itemsPerPage));
        return this;
    },

    setMaxPagesToShow: function( maxPagesToShow ) {
        if (maxPagesToShow < 3) {
            throw new TypeError('maxPagesToShow cannot be less than 3.');
        }
        this.maxPagesToShow = +maxPagesToShow;
        return this;
    },

    getMaxPagesToShow: function( ) {
        return this.maxPagesToShow;
    },

    setCurrentPage: function( currentPage ) {
        this.currentPage = +currentPage;
        return this;
    },

    getCurrentPage: function( ) {
        return this.currentPage;
    },

    setItemsPerPage: function( itemsPerPage ) {
        this.itemsPerPage = +itemsPerPage;
        return this.computeNumPages();
    },

    getItemsPerPage: function( ) {
        return this.itemsPerPage;
    },

    setTotalItems: function( totalItems ) {
        this.totalItems = +totalItems;
        return this.computeNumPages();
    },

    getTotalItems: function( ) {
        return this.totalItems;
    },

    getNumPages: function( ) {
        return this.numPages;
    },

    setUrlPattern: function( urlPattern ) {
        this.urlPattern = String(urlPattern);
        return this;
    },

    getUrlPattern: function( ) {
        return this.urlPattern;
    },

    setPlaceholder: function( placeholder ) {
        this.placeholder = String(placeholder);
        return this;
    },

    getPlaceholder: function( ) {
        return this.placeholder;
    },

    getPageUrl: function( pageNum ){
        return this.urlPattern.split(this.placeholder).join(pageNum);
    },

    getNextPage: function( ) {
        if (this.currentPage < this.numPages) {
            return this.currentPage + 1;
        }

        return null;
    },

    getPrevPage: function( ) {
        if (this.currentPage > 1) {
            return this.currentPage - 1;
        }

        return null;
    },

    getNextUrl: function( ) {
        if (!this.getNextPage()) {
            return null;
        }

        return this.getPageUrl(this.getNextPage());
    },

    getPrevUrl: function( ) {
        if (!this.getPrevPage()) {
            return null;
        }

        return this.getPageUrl(this.getPrevPage());
    },

    setPreviousText: function( text ) {
        this.previousText = String(text);
        return this;
    },

    getPreviousText: function( ) {
        return this.previousText;
    },

    setNextText: function( text ) {
        this.nextText = String(text);
        return this;
    },

    getNextText: function( ) {
        return this.nextText;
    },

    /**
     * Get an array of paginated page data.
     *
     * Example:
     * array(
     *     array ('num' => 1,     'url' => '/example/page/1',  'isCurrent' => false),
     *     array ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     *     array ('num' => 3,     'url' => '/example/page/3',  'isCurrent' => false),
     *     array ('num' => 4,     'url' => '/example/page/4',  'isCurrent' => true ),
     *     array ('num' => 5,     'url' => '/example/page/5',  'isCurrent' => false),
     *     array ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     *     array ('num' => 10,    'url' => '/example/page/10', 'isCurrent' => false),
     * )
     *
     * @return array
     */
    getPages: function( ) {
        var pages = [];

        if (this.numPages <= 1) {
            return [];
        }

        if (this.numPages <= this.maxPagesToShow) {
            for (var i = 1; i <= this.numPages; i++) {
                pages.push(this.createPage(i, i === this.currentPage));
            }
        } else {

            // Determine the sliding range, centered around the current page.
            var numAdjacents = Math.floor((this.maxPagesToShow - 3) / 2),
                slidingStart, slidingEnd;

            if (this.currentPage + numAdjacents > this.numPages) {
                slidingStart = this.numPages - this.maxPagesToShow + 2;
            } else {
                slidingStart = this.currentPage - numAdjacents;
            }
            if (slidingStart < 2) slidingStart = 2;

            slidingEnd = slidingStart + this.maxPagesToShow - 3;
            if (slidingEnd >= this.numPages) slidingEnd = this.numPages - 1;

            // Build the list of pages.
            pages.push(this.createPage(1, this.currentPage === 1));
            if (slidingStart > 2) {
                pages.push(this.createPage(null));
            }
            for (var i = slidingStart; i <= slidingEnd; i++) {
                pages.push(this.createPage(i, i === this.currentPage));
            }
            if (slidingEnd < this.numPages - 1) {
                pages.push(this.createPage(null));
            }
            pages.push(this.createPage(this.numPages, this.currentPage === this.numPages));
        }


        return pages;
    },

    createPage: function( pageNum, isCurrent ) {
        return null == pageNum ? {
            'num' : '...',
            'url' : null,
            'isCurrent' : false
        } : {
            'num' : pageNum,
            'url' : this.getPageUrl(pageNum),
            'isCurrent' : !!isCurrent
        };
    },

    getCurrentPageFirstItem: function( ) {
        var first = (this.currentPage - 1) * this.itemsPerPage + 1;

        if (first > this.totalItems) {
            return null;
        }

        return first;
    },

    getCurrentPageLastItem: function( ) {
        var first = this.getCurrentPageFirstItem();
        if (first === null) {
            return null;
        }

        var last = first + this.itemsPerPage - 1;
        if (last > this.totalItems) {
            return this.totalItems;
        }

        return last;
    },

    renderer: function( ) {
        if (this.numPages <= 1) {
            return '';
        }

        var html = '<ul class="pagination">';
        if (this.getPrevUrl()) {
            html += '<li class="page-previous"><a href="' + htmlspecialchars(this.getPrevUrl()) + '">'+ this.previousText +'</a></li>';
        }

        var pages = this.getPages(), i, l = pages.length, page;
        for (i=0; i<l; i++) {
            page = pages[i];
            if (page.url) {
                html += '<li class="page-item' + (1==page.num ? ' first' : '') + (this.numPages==page.num ? ' last' : '') + (page.isCurrent ? ' active' : '') + '"><a href="' + htmlspecialchars(page.url) + '">' + htmlspecialchars(page.num) + '</a></li>';
            } else {
                html += '<li class="page-item disabled"><span>' + htmlspecialchars(page.num) + '</span></li>';
            }
        }

        if (this.getNextUrl()) {
            html += '<li class="page-next"><a href="' + htmlspecialchars(this.getNextUrl()) + '">'+ this.nextText +'</a></li>';
        }
        html += '</ul>';

        return html;
    },

    render: function( renderer ) {
        return "function" === typeof renderer ? renderer(this) : this.renderer();
    },

    toString: function( ) {
        return this.render();
    }
};

// export it
return Paginator;
});