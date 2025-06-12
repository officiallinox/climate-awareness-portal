/**
 * Article Card Component
 * 
 * This component renders an article card with image, title, summary, and metadata.
 * It can be used in article listings, featured sections, and related articles.
 * 
 * Usage:
 * <div id="articles-container"></div>
 * <script>
 *   const articlesContainer = document.getElementById('articles-container');
 *   fetchArticles().then(articles => {
 *     articles.forEach(article => {
 *       articlesContainer.appendChild(createArticleCard(article));
 *     });
 *   });
 * </script>
 */

/**
 * Creates an article card element
 * @param {Object} article - The article data
 * @param {string} size - The size of the card: 'small', 'medium', or 'large'
 * @returns {HTMLElement} The article card element
 */
function createArticleCard(article, size = 'medium') {
    // Create card container
    const card = document.createElement('div');
    card.className = `article-card article-card-${size}`;
    card.setAttribute('data-article-id', article._id);
    card.setAttribute('data-article-slug', article.slug);
    
    // Create card content
    let categoryLabel = '';
    switch(article.category) {
        case 'climate-science':
            categoryLabel = 'Climate Science';
            break;
        case 'sustainability':
            categoryLabel = 'Sustainability';
            break;
        case 'renewable-energy':
            categoryLabel = 'Renewable Energy';
            break;
        case 'conservation':
            categoryLabel = 'Conservation';
            break;
        case 'policy':
            categoryLabel = 'Policy';
            break;
        case 'education':
            categoryLabel = 'Education';
            break;
        default:
            categoryLabel = article.category;
    }
    
    // Format date if not already formatted
    const createdDate = article.createdAtFormatted || new Date(article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Author info
    const authorName = article.author ? article.author.name : 'Unknown Author';
    const authorAvatar = article.author && article.author.avatar 
        ? article.author.avatar 
        : '/images/default-avatar.png';
    
    // Default image if none provided
    const featuredImage = article.featuredImage || '/images/default-article.jpg';
    
    // HTML structure based on size
    if (size === 'large') {
        card.innerHTML = `
            <div class="article-card-image">
                <img src="${featuredImage}" alt="${article.title}" loading="lazy">
                <div class="article-card-category">${categoryLabel}</div>
            </div>
            <div class="article-card-content">
                <h2 class="article-card-title">
                    <a href="/article/${article.slug}">${article.title}</a>
                </h2>
                <div class="article-card-meta">
                    <div class="article-card-author">
                        <img src="${authorAvatar}" alt="${authorName}" class="author-avatar">
                        <span>${authorName}</span>
                    </div>
                    <div class="article-card-date">${createdDate}</div>
                    <div class="article-card-read-time">${article.readTime} min read</div>
                </div>
                <p class="article-card-summary">${article.summary}</p>
                <a href="/article/${article.slug}" class="article-card-link">Read More</a>
            </div>
        `;
    } else if (size === 'medium') {
        card.innerHTML = `
            <div class="article-card-image">
                <img src="${featuredImage}" alt="${article.title}" loading="lazy">
                <div class="article-card-category">${categoryLabel}</div>
            </div>
            <div class="article-card-content">
                <h3 class="article-card-title">
                    <a href="/article/${article.slug}">${article.title}</a>
                </h3>
                <div class="article-card-meta">
                    <div class="article-card-author">
                        <img src="${authorAvatar}" alt="${authorName}" class="author-avatar">
                        <span>${authorName}</span>
                    </div>
                    <div class="article-card-date">${createdDate}</div>
                </div>
                <p class="article-card-summary">${article.summary.substring(0, 120)}${article.summary.length > 120 ? '...' : ''}</p>
            </div>
        `;
    } else if (size === 'small') {
        card.innerHTML = `
            <div class="article-card-image">
                <img src="${featuredImage}" alt="${article.title}" loading="lazy">
                <div class="article-card-category">${categoryLabel}</div>
            </div>
            <div class="article-card-content">
                <h4 class="article-card-title">
                    <a href="/article/${article.slug}">${article.title}</a>
                </h4>
                <div class="article-card-meta">
                    <div class="article-card-date">${createdDate}</div>
                </div>
            </div>
        `;
    }
    
    // Add click event to navigate to article
    card.addEventListener('click', (e) => {
        // Only navigate if the click wasn't on a link
        if (!e.target.closest('a')) {
            window.location.href = `/article/${article.slug}`;
        }
    });
    
    return card;
}

/**
 * Creates a grid of article cards
 * @param {Array} articles - Array of article data
 * @param {string} size - The size of the cards: 'small', 'medium', or 'large'
 * @returns {HTMLElement} A container with article cards
 */
function createArticleGrid(articles, size = 'medium') {
    const grid = document.createElement('div');
    grid.className = `article-grid article-grid-${size}`;
    
    articles.forEach(article => {
        grid.appendChild(createArticleCard(article, size));
    });
    
    return grid;
}

/**
 * Creates a featured article section
 * @param {Array} articles - Array of featured article data
 * @returns {HTMLElement} A container with featured articles
 */
function createFeaturedArticles(articles) {
    if (!articles || articles.length === 0) {
        return document.createElement('div');
    }
    
    const container = document.createElement('div');
    container.className = 'featured-articles';
    
    // Main featured article
    const mainArticle = articles[0];
    const mainFeature = createArticleCard(mainArticle, 'large');
    mainFeature.className += ' featured-main';
    
    // Secondary featured articles
    const secondaryContainer = document.createElement('div');
    secondaryContainer.className = 'featured-secondary';
    
    const secondaryArticles = articles.slice(1, 5);
    secondaryArticles.forEach(article => {
        secondaryContainer.appendChild(createArticleCard(article, 'small'));
    });
    
    container.appendChild(mainFeature);
    container.appendChild(secondaryContainer);
    
    return container;
}

/**
 * Fetches articles from the API
 * @param {Object} options - Fetch options (page, limit, category, tag, etc.)
 * @returns {Promise<Array>} Promise resolving to array of articles
 */
async function fetchArticles(options = {}) {
    try {
        // Build query string from options
        const queryParams = new URLSearchParams();
        
        if (options.page) queryParams.append('page', options.page);
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.category) queryParams.append('category', options.category);
        if (options.tag) queryParams.append('tag', options.tag);
        if (options.search) queryParams.append('search', options.search);
        if (options.sort) queryParams.append('sort', options.sort);
        if (options.featured) queryParams.append('featured', options.featured);
        
        const queryString = queryParams.toString();
        const url = `/api/articles${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.articles || data; // Handle both paginated and non-paginated responses
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

/**
 * Fetches a single article by slug
 * @param {string} slug - The article slug
 * @returns {Promise<Object>} Promise resolving to article data
 */
async function fetchArticleBySlug(slug) {
    try {
        const response = await fetch(`/api/articles/${slug}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching article with slug ${slug}:`, error);
        return null;
    }
}

/**
 * Fetches featured articles
 * @returns {Promise<Array>} Promise resolving to array of featured articles
 */
async function fetchFeaturedArticles() {
    try {
        const response = await fetch('/api/articles/featured');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch featured articles: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching featured articles:', error);
        return [];
    }
}

/**
 * Fetches recent articles
 * @param {number} limit - Number of articles to fetch
 * @returns {Promise<Array>} Promise resolving to array of recent articles
 */
async function fetchRecentArticles(limit = 5) {
    try {
        const response = await fetch(`/api/articles/recent?limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch recent articles: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching recent articles:', error);
        return [];
    }
}

/**
 * Fetches popular articles
 * @param {number} limit - Number of articles to fetch
 * @returns {Promise<Array>} Promise resolving to array of popular articles
 */
async function fetchPopularArticles(limit = 5) {
    try {
        const response = await fetch(`/api/articles/popular?limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch popular articles: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching popular articles:', error);
        return [];
    }
}

// Export functions for use in other scripts
window.ArticleComponents = {
    createArticleCard,
    createArticleGrid,
    createFeaturedArticles,
    fetchArticles,
    fetchArticleBySlug,
    fetchFeaturedArticles,
    fetchRecentArticles,
    fetchPopularArticles
};