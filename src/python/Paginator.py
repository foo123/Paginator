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
def htmlspecialchars_replace( m ):
    if m == '&': return '&amp;'
    elif m == '<': return '&lt;'
    elif m == '>': return '&gt;'
    elif m == '"': return '&quot;'
    else: return m

def htmlspecialchars( s ):
    global html_esc_re
    return re.sub(html_esc_re, lambda m: htmlspecialchars_replace( m.group() ), str(s))


class Paginator:
    VERSION = '1.0.0'
    
    def __init__( self, totalItems, itemsPerPage, currentPage, urlPattern='', placeholder=None ):
        self.totalItems = 0
        self.numPages = 0
        self.itemsPerPage = 0
        self.currentPage = 0
        self.urlPattern = ''
        self.maxPagesToShow = 10
        self.placeholder = '(:page)'
        self.previousText = '&laquo; Previous'
        self.nextText = 'Next &raquo;'
        
        self.totalItems = int(totalItems)
        self.itemsPerPage = int(itemsPerPage)
        self.currentPage = int(currentPage)
        self.urlPattern = str(urlPattern)
        if placeholder is not None:
            self.placeholder = str(placeholder)

        self.computeNumPages()

    def computeNumPages( self ):
        self.numPages = 0 if 0 == self.itemsPerPage else math.ceil(self.totalItems/self.itemsPerPage)
        return self

    def setMaxPagesToShow( self, maxPagesToShow ):
        if maxPagesToShow < 3:
            raise ValueError('maxPagesToShow cannot be less than 3.')
        
        self.maxPagesToShow = int(maxPagesToShow)
        return self

    def getMaxPagesToShow( self ):
        return self.maxPagesToShow

    def setCurrentPage( self, currentPage ):
        self.currentPage = int(currentPage)
        return self

    def getCurrentPage( self ):
        return self.currentPage

    def setItemsPerPage( self, itemsPerPage ):
        self.itemsPerPage = int(itemsPerPage)
        return self.computeNumPages()

    def getItemsPerPage( self ):
        return self.itemsPerPage

    def setTotalItems( self, totalItems ):
        self.totalItems = int(totalItems)
        return self.computeNumPages()

    def getTotalItems( self ):
        return self.totalItems

    def getNumPages( self, ):
        return self.numPages

    def setUrlPattern( self, urlPattern ):
        self.urlPattern = str(urlPattern)
        return self

    def getUrlPattern( self, ):
        return self.urlPattern

    def setPlaceholder( self, placeholder ):
        self.placeholder = str(placeholder)
        return self

    def getPlaceholder( self ):
        return self.placeholder

    def getPageUrl( self, pageNum ):
        return self.urlPattern.replace(self.placeholder, str(pageNum))

    def getNextPage( self ):
        if self.currentPage < self.numPages:
            return self.currentPage + 1

        return None

    def getPrevPage( self ):
        if self.currentPage > 1:
            return self.currentPage - 1

        return None

    def getNextUrl( self ):
        if not self.getNextPage():
            return None

        return self.getPageUrl(self.getNextPage())

    def getPrevUrl( self ):
        if not self.getPrevPage():
            return None

        return self.getPageUrl(self.getPrevPage())

    def setPreviousText( text ):
        self.previousText = str(text)
        return self

    def getPreviousText( self ):
        return self.previousText

    def setNextText( text ):
        self.nextText = str(text)
        return self

    def getNextText( self ):
        return self.nextText

    ##
     # Get an array of paginated page data.
     #
     # Example:
     # array(
     #     array ('num' => 1,     'url' => '/example/page/1',  'isCurrent' => false),
     #     array ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     #     array ('num' => 3,     'url' => '/example/page/3',  'isCurrent' => false),
     #     array ('num' => 4,     'url' => '/example/page/4',  'isCurrent' => true ),
     #     array ('num' => 5,     'url' => '/example/page/5',  'isCurrent' => false),
     #     array ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     #     array ('num' => 10,    'url' => '/example/page/10', 'isCurrent' => false),
     # )
     #
     # @return array
     #
    def getPages( self ):
        pages = []

        if self.numPages <= 1:
            return []

        if self.numPages <= self.maxPagesToShow:
            for i in range(1, self.numPages+1):
                pages.append(self.createPage(i, i == self.currentPage))
        else:

            # Determine the sliding range, centered around the current page.
            numAdjacents = math.floor((self.maxPagesToShow - 3) / 2)

            if self.currentPage + numAdjacents > self.numPages:
                slidingStart = self.numPages - self.maxPagesToShow + 2
            else:
                slidingStart = self.currentPage - numAdjacents
            
            if slidingStart < 2: slidingStart = 2

            slidingEnd = slidingStart + self.maxPagesToShow - 3
            if slidingEnd >= self.numPages: slidingEnd = self.numPages - 1

            # Build the list of pages.
            pages.append(self.createPage(1, self.currentPage == 1))
            if slidingStart > 2:
                pages.append(self.createPage(None))
            
            for i in range(slidingStart,slidingEnd+1):
                pages.append(self.createPage(i, i == self.currentPage))
            
            if slidingEnd < self.numPages - 1:
                pages.append(self.createPage(None))
            
            pages.append(self.createPage(self.numPages, self.currentPage == self.numPages))


        return pages

    def createPage( self, pageNum, isCurrent=False ):
        return {
            'num' : '...',
            'url' : None,
            'isCurrent' : False
        } if pageNum is None else {
            'num' : pageNum,
            'url' : self.getPageUrl(pageNum),
            'isCurrent' : bool(isCurrent)
        }

    def getCurrentPageFirstItem( self ):
        first = (self.currentPage - 1) * self.itemsPerPage + 1

        if first > self.totalItems:
            return None

        return first

    def getCurrentPageLastItem( self ):
        first = self.getCurrentPageFirstItem();
        if first is None:
            return None

        last = first + self.itemsPerPage - 1
        if last > self.totalItems:
            return self.totalItems

        return last

    def renderer( self ):
        if self.numPages <= 1:
            return ''

        html = '<ul class="pagination">';
        if self.getPrevUrl():
            html += '<li class="page-previous"><a href="' + htmlspecialchars(self.getPrevUrl()) + '">'+ self.previousText +'</a></li>';

        for page in self.getPages():
            if page['url']:
                html += '<li class="page-item' + (' first' if 1==page['num'] else '') + (' last' if self.numPages==page['num'] else '') + (' active' if page['isCurrent'] else '') + '"><a href="' + htmlspecialchars(page['url']) + '">' + htmlspecialchars(page['num']) + '</a></li>'
            else:
                html += '<li class="page-item disabled"><span>' + htmlspecialchars(page['num']) + '</span></li>'

        if self.getNextUrl():
            html += '<li class="page-next"><a href="' + htmlspecialchars(self.getNextUrl()) + '">'+ self.nextText +'</a></li>';
        html += '</ul>'

        return html

    def render( self, renderer=None ):
        return renderer(self) if callable(renderer) else self.renderer()

    def __str__( self ):
        return self.render()

__all__ = ['Paginator']