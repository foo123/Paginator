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
class Paginator
{
    const VERSION = '1.0.0';

    protected $_totalItems;
    protected $_itemsPerPage;
    protected $_currentPage;
    protected $_maxPagesToShow;
    protected $_numPages;
    protected $_placeholder;
    protected $_urlPattern;
    protected $_previousText;
    protected $_nextText;
    protected $_ellipsis;
    protected $_view;

    public function __construct( $totalItems=0, $itemsPerPage=0, $currentPage=1 )
    {
        $this->_maxPagesToShow = 10;
        $this->_placeholder = '(:page)';
        $this->_urlPattern = '?page=' . $this->_placeholder;
        $this->_previousText = '&laquo; Previous';
        $this->_nextText = 'Next &raquo;';
        $this->_ellipsis = '...';
        $this->_view = 'list';

        $this->_totalItems = (int)$totalItems;
        $this->_itemsPerPage = (int)$itemsPerPage;
        $this->_currentPage = (int)$currentPage;

        $this->computeNumPages();
    }

    protected function computeNumPages( )
    {
        $this->_numPages = 0 >= $this->_itemsPerPage || 0 >= $this->_totalItems ? 0 : (int)ceil($this->_totalItems/$this->_itemsPerPage);
        return $this;
    }

    public function numPages( )
    {
        return $this->_numPages;
    }

    public function totalItems( $totalItems=null )
    {
        if ( func_num_args() )
        {
            $this->_totalItems = (int)$totalItems;
            return $this->computeNumPages();
        }
        else
        {
            return $this->_totalItems;
        }
    }

    public function itemsPerPage( $itemsPerPage=null )
    {
        if ( func_num_args() )
        {
            $this->_itemsPerPage = (int)$itemsPerPage;
            return $this->computeNumPages();
        }
        else
        {
            return $this->_itemsPerPage;
        }
    }

    public function currentPage( $currentPage=null )
    {
        if ( func_num_args() )
        {
            $this->_currentPage = (int)$currentPage;
            return $this;
        }
        else
        {
            return $this->_currentPage;
        }
    }

    public function maxPagesToShow( $maxPagesToShow=null )
    {
        if ( func_num_args() )
        {
            $maxPagesToShow = (int)$maxPagesToShow;
            if ( $maxPagesToShow < 3 ) throw new \InvalidArgumentException('maxPagesToShow cannot be less than 3!');
            $this->_maxPagesToShow = $maxPagesToShow;
            return $this;
        }
        else
        {
            return $this->_maxPagesToShow;
        }
    }

    public function urlPattern( $urlPattern=null )
    {
        if ( func_num_args() )
        {
            $this->_urlPattern = (string)$urlPattern;
            return $this;
        }
        else
        {
            return $this->_urlPattern;
        }
    }

    public function placeholder( $placeholder=null )
    {
        if ( func_num_args() )
        {
            $this->_placeholder = (string)$placeholder;
            return $this;
        }
        else
        {
            return $this->_placeholder;
        }
    }

    public function previousText( $text=null )
    {
        if ( func_num_args() )
        {
            $this->_previousText = (string)$text;
            return $this;
        }
        else
        {
            return $this->_previousText;
        }
    }

    public function nextText( $text=null )
    {
        if ( func_num_args() )
        {
            $this->_nextText = (string)$text;
            return $this;
        }
        else
        {
            return $this->_nextText;
        }
    }

    public function ellipsis( $text=null )
    {
        if ( func_num_args() )
        {
            $this->_ellipsis = (string)$text;
            return $this;
        }
        else
        {
            return $this->_ellipsis;
        }
    }

    public function view( $view=null )
    {
        if ( func_num_args() )
        {
            $view = strtolower((string)$view);
            switch($view)
            {
                case 'mobile':
                case 'selectbox':
                case 'select':
                    $view = 'selectbox';
                    break;
                default:
                    $view = 'list';
                    break;
            }
            $this->_view = $view;
            return $this;
        }
        else
        {
            return $this->_view;
        }
    }

    public function pageUrl( $pageNum )
    {
        return str_replace($this->_placeholder, (string)$pageNum, $this->_urlPattern);
    }

    public function prevPage( )
    {
        return $this->_currentPage > 1 ? $this->_currentPage-1 : null;
    }

    public function nextPage( )
    {
        return $this->_currentPage < $this->_numPages ? $this->_currentPage+1 : null;
    }

    public function prevUrl( )
    {
        return $this->prevPage( ) ? $this->pageUrl( $this->prevPage( ) ) : null;
    }

    public function nextUrl( )
    {
        return $this->nextPage( ) ? $this->pageUrl( $this->nextPage( ) ) : null;
    }

    public function currentPageFirstItem( )
    {
        $first = ($this->_currentPage - 1) * $this->_itemsPerPage + 1;
        return $first > $this->_totalItems ? null : $first;
    }

    public function currentPageLastItem( )
    {
        $first = $this->currentPageFirstItem( );
        if ( null === $first ) return null;
        $last = $first + $this->_itemsPerPage - 1;
        return $last > $this->_totalItems ? $this->_totalItems : $last;
    }

    /**
     * Get an array of paginated page data.
     *
     * Example:
     * array(
     *     object ('num' => 1,     'url' => '/example/page/1',  'isCurrent' => false),
     *     object ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     *     object ('num' => 3,     'url' => '/example/page/3',  'isCurrent' => false),
     *     object ('num' => 4,     'url' => '/example/page/4',  'isCurrent' => true ),
     *     object ('num' => 5,     'url' => '/example/page/5',  'isCurrent' => false),
     *     object ('num' => '...', 'url' => NULL,               'isCurrent' => false),
     *     object ('num' => 10,    'url' => '/example/page/10', 'isCurrent' => false),
     * )
     *
     * @return array
     */
    public function pages( )
    {
        $pages = array();

        if ( 1 >= $this->_numPages )  return $pages;

        if ( $this->_numPages <= $this->_maxPagesToShow )
        {
            for ($i=1; $i<=$this->_numPages; $i++)
                $pages[] = $this->createPage($i, $i==$this->_currentPage);
        }
        else
        {
            // Determine the sliding range, centered around the current page.
            $numAdjacents = (int)floor(($this->_maxPagesToShow - 3) / 2);

            if ( $this->_currentPage + $numAdjacents > $this->_numPages )
            {
                $slidingStart = $this->_numPages - $this->_maxPagesToShow + 2;
            }
            else
            {
                $slidingStart = $this->_currentPage - $numAdjacents;
            }
            if ( $slidingStart < 2 ) $slidingStart = 2;

            $slidingEnd = $slidingStart + $this->_maxPagesToShow - 3;
            if ( $slidingEnd >= $this->_numPages ) $slidingEnd = $this->_numPages - 1;

            // Build the list of pages.

            // first
            $pages[] = $this->createPage(1, 1==$this->_currentPage);

            // ellipsis ..
            if ( $slidingStart > 2 ) $pages[] = $this->createPage(null);

            // shown pages
            for ($i=$slidingStart; $i<=$slidingEnd; $i++)
                $pages[] = $this->createPage($i, $i==$this->_currentPage);

            // ellipsis ..
            if ( $slidingEnd < $this->_numPages-1 ) $pages[] = $this->createPage(null);

            // last
            $pages[] = $this->createPage($this->_numPages, $this->_numPages==$this->_currentPage);
        }

        return $pages;
    }


    protected function createPage( $pageNum, $isCurrent=false )
    {
        return null === $pageNum ? (object)array(
            'num' => $this->_ellipsis,
            'url' => null,
            'isCurrent' => false
        ) : (object)array(
            'num' => $pageNum,
            'url' => $this->pageUrl($pageNum),
            'isCurrent' => (bool)$isCurrent
        );
    }

    public function render( )
    {
        if ( 1 >= $this->_numPages ) return '';

        if ( 'selectbox' === $this->_view )
        {
            $html = '<div class="pagination">';

            // previous link
            if ( $this->prevUrl( ) )
            {
                $html .= '<span class="page-previous"><a href="' . htmlspecialchars($this->prevUrl( ), ENT_COMPAT) . '">'. $this->_previousText .'</a></span>';
            }

            $html .= '<select class="page-select">';
            // shown pages by number including first and last
            foreach($this->pages( ) as $page)
            {
                if ( $page->url )
                {
                    // actual page with page number
                    $html .= '<option value="' . htmlspecialchars($page->url, ENT_COMPAT) . '"' . ($page->isCurrent ? ' selected' : '') . '>' . (string)$page->num . '</option>';
                }
                else
                {
                    // ellipsis, more
                    $html .= '<option disabled>' . (string)$page->num . '</option>';
                }
            }
            $html .= '</select>';

            // next link
            if ( $this->nextUrl( ) )
            {
                $html .= '<span class="page-next"><a href="' . htmlspecialchars($this->nextUrl( ), ENT_COMPAT) . '">'. $this->_nextText .'</a></span>';
            }

            $html .= '</div>';
        }
        else
        {
            // possibly should be wrapped around <nav></nav> element when used
            $html = '<ul class="pagination">';

            // previous link
            if ( $this->prevUrl( ) )
            {
                $html .= '<li class="page-previous"><a href="' . htmlspecialchars($this->prevUrl( ), ENT_COMPAT) . '">'. $this->_previousText .'</a></li>';
            }

            // shown pages by number including first and last
            foreach($this->pages( ) as $page)
            {
                if ( $page->url )
                {
                    // actual page with page number
                    $html .= '<li class="page-item' . (1==$page->num ? ' first' : '') . ($this->_numPages==$page->num ? ' last' : '') . ($page->isCurrent ? ' active' : '') . '"><a href="' . htmlspecialchars($page->url, ENT_COMPAT) . '">' . (string)$page->num . '</a></li>';
                }
                else
                {
                    // ellipsis, more
                    $html .= '<li class="page-item disabled"><span>' . (string)$page->num . '</span></li>';
                }
            }

            // next link
            if ( $this->nextUrl( ) )
            {
                $html .= '<li class="page-next"><a href="' . htmlspecialchars($this->nextUrl( ), ENT_COMPAT) . '">'. $this->_nextText .'</a></li>';
            }

            $html .= '</ul>';
        }

        return $html;
    }

    public function __toString( )
    {
        return $this->render( );
    }
}
}