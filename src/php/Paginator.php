<?php
/**
*  Paginator
*  Simple and versatile Pagination utility class for PHP, Python, Node.js / Browser Javascript
*
*  @version: 1.0.0
*  https://github.com/foo123/Paginator
*
**/
if ( !class_exists('Paginator', false) )
{
// adapted from https://github.com/jasongrimes/php-paginator
class Paginator
{
    const VERSION = '1.0.0';

    protected $totalItems;
    protected $numPages;
    protected $itemsPerPage;
    protected $currentPage;
    protected $pattern;
    protected $maxPagesToShow = 10;
    protected $placeholder = '(:page)';
    protected $previousText = 'Previous';
    protected $nextText = 'Next';

    public function __construct( $totalItems, $itemsPerPage, $currentPage, $urlPattern = '', $placeholder = null )
    {
        $this->totalItems = (int)$totalItems;
        $this->itemsPerPage = (int)$itemsPerPage;
        $this->currentPage = (int)$currentPage;
        $this->urlPattern = (string)$urlPattern;
        if ( !empty($placeholder) )
            $this->placeholder = (string)$placeholder;

        $this->computeNumPages();
    }

    protected function computeNumPages( )
    {
        $this->numPages = (0 === $this->itemsPerPage ? 0 : (int)ceil($this->totalItems/$this->itemsPerPage));
        return $this;
    }

    public function setMaxPagesToShow( $maxPagesToShow )
    {
        if ($maxPagesToShow < 3) {
            throw new \InvalidArgumentException('maxPagesToShow cannot be less than 3.');
        }
        $this->maxPagesToShow = (int)$maxPagesToShow;
        return $this;
    }

    public function getMaxPagesToShow( )
    {
        return $this->maxPagesToShow;
    }

    public function setCurrentPage( $currentPage )
    {
        $this->currentPage = (int)$currentPage;
        return $this;
    }

    public function getCurrentPage( )
    {
        return $this->currentPage;
    }

    public function setItemsPerPage( $itemsPerPage )
    {
        $this->itemsPerPage = (int)$itemsPerPage;
        return $this->computeNumPages();
    }

    public function getItemsPerPage( )
    {
        return $this->itemsPerPage;
    }

    public function setTotalItems( $totalItems )
    {
        $this->totalItems = (int)$totalItems;
        return $this->computeNumPages();
    }

    public function getTotalItems( )
    {
        return $this->totalItems;
    }

    public function getNumPages( )
    {
        return $this->numPages;
    }

    public function setUrlPattern( $urlPattern )
    {
        $this->urlPattern = (string)$urlPattern;
        return $this;
    }

    public function getUrlPattern( )
    {
        return $this->urlPattern;
    }

    public function setPlaceholder( $placeholder )
    {
        $this->placeholder = (string)$placeholder;
        return $this;
    }

    public function getPlaceholder( )
    {
        return $this->placeholder;
    }

    public function getPageUrl( $pageNum )
    {
        return str_replace($this->placeholder, $pageNum, $this->urlPattern);
    }

    public function getNextPage( )
    {
        if ($this->currentPage < $this->numPages) {
            return $this->currentPage + 1;
        }

        return null;
    }

    public function getPrevPage( )
    {
        if ($this->currentPage > 1) {
            return $this->currentPage - 1;
        }

        return null;
    }

    public function getNextUrl( )
    {
        if (!$this->getNextPage()) {
            return null;
        }

        return $this->getPageUrl($this->getNextPage());
    }

    public function getPrevUrl( )
    {
        if (!$this->getPrevPage()) {
            return null;
        }

        return $this->getPageUrl($this->getPrevPage());
    }

    public function setPreviousText( $text )
    {
        $this->previousText = (string)$text;
        return $this;
    }

    public function getPreviousText( )
    {
        return $this->previousText;
    }

    public function setNextText( $text )
    {
        $this->nextText = (string)$text;
        return $this;
    }

    public function getNextText( )
    {
        return $this->nextText;
    }

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
    public function getPages( )
    {
        $pages = array();

        if ($this->numPages <= 1) {
            return array();
        }

        if ($this->numPages <= $this->maxPagesToShow) {
            for ($i = 1; $i <= $this->numPages; $i++) {
                $pages[] = $this->createPage($i, $i === $this->currentPage);
            }
        } else {

            // Determine the sliding range, centered around the current page.
            $numAdjacents = (int) floor(($this->maxPagesToShow - 3) / 2);

            if ($this->currentPage + $numAdjacents > $this->numPages) {
                $slidingStart = $this->numPages - $this->maxPagesToShow + 2;
            } else {
                $slidingStart = $this->currentPage - $numAdjacents;
            }
            if ($slidingStart < 2) $slidingStart = 2;

            $slidingEnd = $slidingStart + $this->maxPagesToShow - 3;
            if ($slidingEnd >= $this->numPages) $slidingEnd = $this->numPages - 1;

            // Build the list of pages.
            $pages[] = $this->createPage(1, $this->currentPage === 1);
            if ($slidingStart > 2) {
                $pages[] = $this->createPage(null);
            }
            for ($i = $slidingStart; $i <= $slidingEnd; $i++) {
                $pages[] = $this->createPage($i, $i === $this->currentPage);
            }
            if ($slidingEnd < $this->numPages - 1) {
                $pages[] = $this->createPage(null);
            }
            $pages[] = $this->createPage($this->numPages, $this->currentPage === $this->numPages);
        }


        return $pages;
    }


    protected function createPage( $pageNum, $isCurrent=false )
    {
        return null === $pageNum ? array(
            'num' => '...',
            'url' => null,
            'isCurrent' => false,
        ) : array(
            'num' => $pageNum,
            'url' => $this->getPageUrl($pageNum),
            'isCurrent' => $isCurrent,
        );
    }

    public function getCurrentPageFirstItem( )
    {
        $first = ($this->currentPage - 1) * $this->itemsPerPage + 1;

        if ($first > $this->totalItems) {
            return null;
        }

        return $first;
    }

    public function getCurrentPageLastItem( )
    {
        $first = $this->getCurrentPageFirstItem();
        if ($first === null) {
            return null;
        }

        $last = $first + $this->itemsPerPage - 1;
        if ($last > $this->totalItems) {
            return $this->totalItems;
        }

        return $last;
    }

    protected function renderer( )
    {
        if ($this->numPages <= 1) {
            return '';
        }

        $html = '<ul class="pagination">';
        if ($this->getPrevUrl()) {
            $html .= '<li><a href="' . htmlspecialchars($this->getPrevUrl()) . '">&laquo; '. $this->previousText .'</a></li>';
        }

        foreach ($this->getPages() as $page) {
            if ($page['url']) {
                $html .= '<li' . ($page['isCurrent'] ? ' class="active"' : '') . '><a href="' . htmlspecialchars($page['url']) . '">' . htmlspecialchars($page['num']) . '</a></li>';
            } else {
                $html .= '<li class="disabled"><span>' . htmlspecialchars($page['num']) . '</span></li>';
            }
        }

        if ($this->getNextUrl()) {
            $html .= '<li><a href="' . htmlspecialchars($this->getNextUrl()) . '">'. $this->nextText .' &raquo;</a></li>';
        }
        $html .= '</ul>';

        return $html;
    }

    public function render( $renderer=null )
    {
        return is_callable($renderer) ? call_user_func($renderer, $this) : $this->renderer();
    }

    public function __toString( )
    {
        return $this->render();
    }
}
}