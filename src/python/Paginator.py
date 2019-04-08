##
#  Paginator
#  Simple and versatile Pagination utility class for PHP, Python, Node.js / Browser Javascript
#
#  @version: 1.0.0
#  https://github.com/foo123/Paginator
#
##

import math, re

html_esc_re = re.compile(r'[&<>\'"]')
def htmlspecialchars_replace( match ):
    m = match.group(0)
    if m == '&': return '&amp;'
    elif m == '<': return '&lt;'
    elif m == '>': return '&gt;'
    elif m == '"': return '&quot;'
    else: return m

def htmlspecialchars( s ):
    global html_esc_re
    return re.sub(html_esc_re, htmlspecialchars_replace, str(s))


class Paginator:
    VERSION = '1.0.0'

    def __init__( self, totalItems=0, itemsPerPage=0, currentPage=1 ):
        self._maxPagesToShow = 10
        self._placeholder = '(:page)'
        self._urlPattern = '?page=' + self._placeholder
        self._previousText = '&laquo; Previous'
        self._nextText = 'Next &raquo;'
        self._ellipsis = '...'
        self._view = 'list'
        self._numPages = 0

        self._totalItems = int(totalItems)
        self._itemsPerPage = int(itemsPerPage)
        self._currentPage = int(currentPage)

        self.computeNumPages()

    def computeNumPages( self ):
        self._numPages = 0 if 0 >= self._itemsPerPage or 0 >= self._totalItems else math.ceil(self._totalItems/self._itemsPerPage)
        return self

    def numPages( self ):
        return self._numPages

    def totalItems( self, *args ):
        if len(args):
            self._totalItems = int(args[0])
            return self.computeNumPages()
        else:
            return self._totalItems

    def itemsPerPage( self, *args ):
        if len(args):
            self._itemsPerPage = int(args[0])
            return self.computeNumPages()
        else:
            return self._itemsPerPage

    def currentPage( self, *args ):
        if len(args):
            self._currentPage = int(args[0])
            return self
        else:
            return self._currentPage

    def maxPagesToShow( self, *args ):
        if len(args):
            maxPagesToShow = int(args[0])
            if maxPagesToShow < 3:
                raise ValueError('maxPagesToShow cannot be less than 3!')
            self._maxPagesToShow = maxPagesToShow
            return self
        else:
            return self._maxPagesToShow

    def urlPattern( self, *args ):
        if len(args):
            self._urlPattern = str(args[0])
            return self
        else:
            return self._urlPattern

    def placeholder( self, *args ):
        if len(args):
            self._placeholder = str(args[0])
            return self
        else:
            return self._placeholder

    def previousText( self, *args ):
        if len(args):
            self._previousText = str(args[0])
            return self
        else:
            return self._previousText

    def nextText( self, *args ):
        if len(args):
            self._nextText = str(args[0])
            return self
        else:
            return self._nextText

    def ellipsis( self, *args ):
        if len(args):
            self._ellipsis = str(args[0])
            return self
        else:
            return self._ellipsis

    def view( self, *args ):
        if len(args):
            view = str(args[0]).lower()
            if 'mobile' == view: view = 'selectbox'
            elif 'selectbox' == view: view = 'selectbox'
            elif 'select' == view: view = 'selectbox'
            else: view = 'list'
            self._view = view
            return self
        else:
            return self._view

    def pageUrl( self, pageNum ):
        return self._urlPattern.replace(self._placeholder, str(pageNum))

    def prevPage( self ):
        return self._currentPage-1 if self._currentPage > 1 else None

    def nextPage( self ):
        return self._currentPage+1 if self._currentPage < self._numPages else None

    def prevUrl( self ):
        return self.pageUrl( self.prevPage( ) ) if self.prevPage( ) else None

    def nextUrl( self ):
        return self.pageUrl( self.nextPage( ) ) if self.nextPage( ) else None

    def currentPageFirstItem( self ):
        first = (self._currentPage - 1) * self._itemsPerPage + 1
        return None if first > self._totalItems else first

    def currentPageLastItem( self ):
        first = self.currentPageFirstItem()
        if first is None: return None
        last = first + self._itemsPerPage - 1
        return self._totalItems if last > self._totalItems else last

    ##
     # Get a list of paginated page data.
     #
     # Example:
     # list(
     #     dict ('num' : 1,     'url' : '/example/page/1',  'isCurrent' : false),
     #     dict ('num' : '...', 'url' : NULL,               'isCurrent' : false),
     #     dict ('num' : 3,     'url' : '/example/page/3',  'isCurrent' : false),
     #     dict ('num' : 4,     'url' : '/example/page/4',  'isCurrent' : true ),
     #     dict ('num' : 5,     'url' : '/example/page/5',  'isCurrent' : false),
     #     dict ('num' : '...', 'url' : NULL,               'isCurrent' : false),
     #     dict ('num' : 10,    'url' : '/example/page/10', 'isCurrent' : false),
     # )
     #
     # @return list
     #
    def pages( self ):
        pages = []

        if 1 >= self._numPages: return pages

        if self._numPages <= self._maxPagesToShow:

            for i in range(1, self._numPages+1):
                pages.append(self.createPage(i, i==self._currentPage))

        else:

            # Determine the sliding range, centered around the current page.
            numAdjacents = math.floor((self._maxPagesToShow - 3) / 2)

            if self._currentPage + numAdjacents > self._numPages:
                slidingStart = self._numPages - self._maxPagesToShow + 2
            else:
                slidingStart = self._currentPage - numAdjacents

            if slidingStart < 2: slidingStart = 2

            slidingEnd = slidingStart + self._maxPagesToShow - 3
            if slidingEnd >= self._numPages: slidingEnd = self._numPages - 1

            # Build the list of pages.

            # first
            pages.append(self.createPage(1, 1==self._currentPage))

            # ellipsis ..
            if slidingStart > 2: pages.append(self.createPage(None))

            # shown pages
            for i in range(slidingStart,slidingEnd+1):
                pages.append(self.createPage(i, i==self._currentPage))

            # ellipsis ..
            if slidingEnd < self._numPages - 1: pages.append(self.createPage(None))

            # last
            pages.append(self.createPage(self._numPages, self._numPages==self._currentPage))


        return pages

    def createPage( self, pageNum, isCurrent=False ):
        return {
            'num' : self._ellipsis,
            'url' : None,
            'isCurrent' : False
        } if pageNum is None else {
            'num' : pageNum,
            'url' : self.pageUrl(pageNum),
            'isCurrent' : bool(isCurrent)
        }

    def render( self ):
        if 1 >= self._numPages: return ''

        if 'selectbox' == self._view:
            html = '<div class="pagination">'

            # previous link
            if self.prevUrl( ):
                html += '<span class="page-previous"><a href="' + htmlspecialchars(self.prevUrl()) + '">'+ self._previousText +'</a></span>';

            html += '<select class="page-select">'
            # shown pages by number including first and last
            for page in self.pages():
                if page['url']:
                    # actual page with page number
                    html += '<option value="' + htmlspecialchars(page['url']) + '"' + (' selected' if page['isCurrent'] else '') + '>' + str(page['num']) + '</option>'
                else:
                    # ellipsis, more
                    html += '<option disabled>' + str(page['num']) + '</option>'

            html += '</select>'

            # next link
            if self.nextUrl():
                html += '<span class="page-next"><a href="' + htmlspecialchars(self.nextUrl()) + '">'+ self._nextText +'</a></span>';

            html += '</div>'

        else:
            # possibly should be wrapped around <nav></nav> element when used
            html = '<ul class="pagination">'

            # previous link
            if self.prevUrl( ):
                html += '<li class="page-previous"><a href="' + htmlspecialchars(self.prevUrl()) + '">'+ self._previousText +'</a></li>';

            # shown pages by number including first and last
            for page in self.pages():
                if page['url']:
                    # actual page with page number
                    html += '<li class="page-item' + (' first' if 1==page['num'] else '') + (' last' if self._numPages==page['num'] else '') + (' active' if page['isCurrent'] else '') + '"><a href="' + htmlspecialchars(page['url']) + '">' + str(page['num']) + '</a></li>'
                else:
                    # ellipsis, more
                    html += '<li class="page-item disabled"><span>' + str(page['num']) + '</span></li>'

            # next link
            if self.nextUrl():
                html += '<li class="page-next"><a href="' + htmlspecialchars(self.nextUrl()) + '">'+ self._nextText +'</a></li>';

            html += '</ul>'

        return html

    def __str__( self ):
        return self.render()

__all__ = ['Paginator']