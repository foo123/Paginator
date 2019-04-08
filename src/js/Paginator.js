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

function Paginator( totalItems, itemsPerPage, currentPage )
{
    var self = this;
    self._maxPagesToShow = 10;
    self._placeholder = '(:page)';
    self._urlPattern = '?page=' + self._placeholder;
    self._previousText = '&laquo; Previous';
    self._nextText = 'Next &raquo;';
    self._ellipsis = '...';
    self._view = 'list';
    self._numPages = 0;

    self._totalItems = parseInt(totalItems||0);
    self._itemsPerPage = parseInt(itemsPerPage||0);
    self._currentPage = parseInt(currentPage||1);

    self.computeNumPages();
}
Paginator.VERSION = '1.0.0';
Paginator.prototype = {
    constructor: Paginator,

    _totalItems: null,
    _itemsPerPage: null,
    _currentPage: null,
    _numPages: null,
    _maxPagesToShow: null,
    _placeholder: null,
    _urlPattern: null,
    _previousText: null,
    _nextText: null,
    _ellipsis: null,
    _view: null,

    computeNumPages: function( ) {
        var self = this;
        self._numPages = 0 >= self._itemsPerPage || 0 >= self._totalItems ? 0 : Math.ceil(self._totalItems/self._itemsPerPage);
        return self;
    },

    numPages: function( ) {
        return this._numPages;
    },

    totalItems: function( totalItems ) {
        var self = this;
        if ( arguments.length )
        {
            self._totalItems = parseInt(totalItems);
            return self.computeNumPages();
        }
        else
        {
            return self._totalItems;
        }
    },

    itemsPerPage: function( itemsPerPage ) {
        var self = this;
        if ( arguments.length )
        {
            self._itemsPerPage = parseInt(itemsPerPage);
            return self.computeNumPages();
        }
        else
        {
            return self._itemsPerPage;
        }
    },

    currentPage: function( currentPage ) {
        var self = this;
        if ( arguments.length )
        {
            self._currentPage = parseInt(currentPage);
            return self;
        }
        else
        {
            return self._currentPage;
        }
    },

    maxPagesToShow: function( maxPagesToShow ) {
        var self = this;
        if ( arguments.length )
        {
            maxPagesToShow = parseInt(maxPagesToShow);
            if ( maxPagesToShow < 3 ) throw new TypeError('maxPagesToShow cannot be less than 3!');
            self._maxPagesToShow = maxPagesToShow;
            return self;
        }
        else
        {
            return self._maxPagesToShow;
        }
    },

    urlPattern: function( urlPattern ) {
        var self = this;
        if ( arguments.length )
        {
            self._urlPattern = String(urlPattern);
            return self;
        }
        else
        {
            return self._urlPattern;
        }
    },

    placeholder: function( placeholder ) {
        var self = this;
        if ( arguments.length )
        {
            self._placeholder = String(placeholder);
            return self;
        }
        else
        {
            return self._placeholder;
        }
    },

    previousText: function( text ) {
        var self = this;
        if ( arguments.length )
        {
            self._previousText = String(text);
            return self;
        }
        else
        {
            return self._previousText;
        }
    },

    nextText: function( text ) {
        var self = this;
        if ( arguments.length )
        {
            self._nextText = String(text);
            return self;
        }
        else
        {
            return self._nextText;
        }
    },

    ellipsis: function( text ) {
        var self = this;
        if ( arguments.length )
        {
            self._ellipsis = String(text);
            return self;
        }
        else
        {
            return self._ellipsis;
        }
    },

    view: function( view ) {
        var self = this;
        if ( arguments.length )
        {
            view = String(view).toLowerCase();
            switch(view)
            {
                case 'mobile':
                case 'selectbox':
                case 'select':
                    view = 'selectbox';
                    break;
                default:
                    view = 'list';
                    break;
            }
            self._view = view;
            return self;
        }
        else
        {
            return self._view;
        }
    },

    pageUrl: function( pageNum ){
        return this._urlPattern.split(this._placeholder).join(String(pageNum));
    },

    prevPage: function( ) {
        return this._currentPage > 1 ? this._currentPage-1 : null;
    },

    nextPage: function( ) {
        return this._currentPage < this._numPages ? this._currentPage+1 : null;
    },

    prevUrl: function( ) {
        return this.prevPage( ) ? this.pageUrl( this.prevPage( ) ) : null;
    },

    nextUrl: function( ) {
        return this.nextPage( ) ? this.pageUrl( this.nextPage( ) ) : null;
    },

    currentPageFirstItem: function( ) {
        var first = (this._currentPage - 1) * this._itemsPerPage + 1;
        return first > this._totalItems ? null : first;
    },

    currentPageLastItem: function( ) {
        var first = this.currentPageFirstItem(), last;
        if ( null == first ) return null;
        last = first + this._itemsPerPage - 1;
        return last > this._totalItems ? this._totalItems : last;
    },

    /**
     * Get an array of paginated page data.
     *
     * Example:
     * array(
     *     object ('num' : 1,     'url' : '/example/page/1',  'isCurrent' : false),
     *     object ('num' : '...', 'url' : NULL,               'isCurrent' : false),
     *     object ('num' : 3,     'url' : '/example/page/3',  'isCurrent' : false),
     *     object ('num' : 4,     'url' : '/example/page/4',  'isCurrent' : true ),
     *     object ('num' : 5,     'url' : '/example/page/5',  'isCurrent' : false),
     *     object ('num' : '...', 'url' : NULL,               'isCurrent' : false),
     *     object ('num' : 10,    'url' : '/example/page/10', 'isCurrent' : false),
     * )
     *
     * @return array
     */
    pages: function( ) {
        var self = this,
            i, l, numAdjacents, slidingStart, slidingEnd,
            pages = []
        ;

        if ( 1 >= self._numPages ) return pages;

        if ( self._numPages <= self._maxPagesToShow )
        {
            for (i=1,l=self._numPages; i<=l; i++)
                pages.push(self.createPage(i, i==self._currentPage));
        }
        else
        {
            // Determine the sliding range, centered around the current page.
            numAdjacents = Math.floor((self._maxPagesToShow - 3) / 2);

            if ( self._currentPage + numAdjacents > self._numPages )
            {
                slidingStart = self._numPages - self._maxPagesToShow + 2;
            }
            else
            {
                slidingStart = self._currentPage - numAdjacents;
            }
            if ( slidingStart < 2 ) slidingStart = 2;

            slidingEnd = slidingStart + self._maxPagesToShow - 3;
            if ( slidingEnd >= self._numPages ) slidingEnd = self._numPages - 1;

            // Build the list of pages.

            // first
            pages.push(self.createPage(1, 1==self._currentPage));

            // ellipsis ..
            if ( slidingStart > 2 ) pages.push(self.createPage(null));

            // shown pages
            for (i=slidingStart; i<=slidingEnd; i++)
                pages.push(self.createPage(i, i==self._currentPage));

            // ellipsis ..
            if ( slidingEnd < self._numPages - 1 ) pages.push(self.createPage(null));

            // last
            pages.push(self.createPage(self._numPages, self._numPages==self._currentPage));
        }

        return pages;
    },

    createPage: function( pageNum, isCurrent ) {
        return null == pageNum ? {
            'num' : this._ellipsis,
            'url' : null,
            'isCurrent' : false
        } : {
            'num' : pageNum,
            'url' : this.pageUrl(pageNum),
            'isCurrent' : !!isCurrent
        };
    },

    render: function( ) {
        var self = this, html, pages, i, l, page;

        if ( 1 >= self._numPages ) return '';

        if ( 'selectbox' === self._view )
        {
            html = '<div class="pagination">';

            // previous link
            if ( self.prevUrl( ) )
            {
                html += '<span class="page-previous"><a href="' + htmlspecialchars(self.prevUrl( )) + '">'+ self._previousText +'</a></span>';
            }

            html += '<select class="page-select">';
            // shown pages by number including first and last
            for (pages=self.pages(),i=0,l=pages.length; i<l; i++)
            {
                page = pages[i];
                if ( page.url )
                {
                    // actual page with page number
                    html += '<option value="' + htmlspecialchars(page.url) + '"' + (page.isCurrent ? ' selected' : '') + '>' + String(page.num) + '</option>';
                }
                else
                {
                    // ellipsis, more
                    html += '<option disabled>' + String(page.num) + '</option>';
                }
            }
            html += '</select>';

            // next link
            if ( self.nextUrl( ) )
            {
                html += '<span class="page-next"><a href="' + htmlspecialchars(self.nextUrl( )) + '">'+ self._nextText +'</a></span>';
            }

            html += '</div>';
        }
        else
        {
            // possibly should be wrapped around <nav></nav> element when used
            html = '<ul class="pagination">';

            // previous link
            if ( self.prevUrl( ) )
            {
                html += '<li class="page-previous"><a href="' + htmlspecialchars(self.prevUrl( )) + '">'+ self._previousText +'</a></li>';
            }

            // shown pages by number including first and last
            for (pages=self.pages(),i=0,l=pages.length; i<l; i++)
            {
                page = pages[i];
                if ( page.url )
                {
                    // actual page with page number
                    html += '<li class="page-item' + (1==page.num ? ' first' : '') + (self._numPages==page.num ? ' last' : '') + (page.isCurrent ? ' active' : '') + '"><a href="' + htmlspecialchars(page.url) + '">' + String(page.num) + '</a></li>';
                }
                else
                {
                    // ellipsis, more
                    html += '<li class="page-item disabled"><span>' + String(page.num) + '</span></li>';
                }
            }

            // next link
            if ( self.nextUrl( ) )
            {
                html += '<li class="page-next"><a href="' + htmlspecialchars(self.nextUrl( )) + '">'+ self._nextText +'</a></li>';
            }

            html += '</ul>';
        }

        return html;
    },

    toString: function( ) {
        return this.render();
    }
};

// export it
return Paginator;
});