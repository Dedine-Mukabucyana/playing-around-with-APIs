document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resultsDiv = document.getElementById('results');
    const cartCount = document.getElementById('cartCount');
    const listCount = document.getElementById('listCount');

    // Tab Management
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            if (tabName === 'list') {
                updateShoppingListDisplay();
            } else if (tabName === 'trends') {
                updateTrendsDisplay();
            }
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Quick search buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            searchInput.value = btn.dataset.search;
            handleSearch();
        });
    });

    // Initialize
    showInitialState();
    updateCartBadge();

    async function handleSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a product name');
            return;
        }

        const category = categoryFilter.value;
        const sortBy = sortFilter.value;

        showLoading();

        try {
            const result = await marketAPI.searchProducts(query, category, sortBy);
            
            if (result.success) {
                if (result.data.length === 0) {
                    showNoResults(query);
                } else {
                    displayResults(result.data, result.apiSource);
                }
            } else {
                showError(result.error);
            }
        } catch (error) {
            console.error('Search error:', error);
            showError('An unexpected error occurred. Please try again.');
        }
    }

    function showLoading() {
        resultsDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>🔌 Fetching data from Open Food Facts API...</p>
            </div>
        `;
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="error-box">
                <strong>⚠️ Error:</strong> ${message}
            </div>
        `;
    }

    function showInitialState() {
        resultsDiv.innerHTML = `
            <div class="initial-state">
                <div class="initial-icon">🛒</div>
                <h2>Start Your Smart Shopping</h2>
                <p>Search for products to compare prices across 5 major markets in Kigali</p>
                <div class="market-badges">
                    ${marketAPI.markets.map(market => `
                        <span class="market-badge">${market}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function showNoResults(query) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h2>No products found for "${query}"</h2>
                <p>Try searching for: milk, bread, rice, chocolate, juice, coffee</p>
            </div>
        `;
    }

    function displayResults(products, apiSource) {
        const header = `
            <div class="results-header">
                <p>✅ Found <strong>${products.length}</strong> products from <strong>${apiSource}</strong> API</p>
            </div>
        `;

        const productCards = products.map(product => {
            const lowestIdx = marketAPI.getLowestPriceIndex(product.prices);
            const highestIdx = marketAPI.getHighestPriceIndex(product.prices);
            const savings = marketAPI.calculateSavings(product.prices);
            const savingsPercent = marketAPI.calculateSavingsPercentage(product.prices);
            const lowestPrice = Math.min(...product.prices);

            return `
                <div class="product-card">
                    <div class="product-header">
                        <div class="product-info">
                            ${product.image ? `
                                <img src="${product.image}" alt="${product.name}" class="product-image">
                            ` : ''}
                            <div>
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-meta">
                                    <span class="brand">Brand: ${product.brand}</span> | 
                                    <span>Freshness: ${product.freshness}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="savings-banner">
                        <div class="savings-left">
                            <p class="label">Best Price</p>
                            <p class="best-price">${lowestPrice} RWF</p>
                            <p class="market-name">at ${marketAPI.markets[lowestIdx]}</p>
                        </div>
                        <div class="savings-right">
                            <p class="label">Save up to</p>
                            <p class="savings-amount">${savings} RWF</p>
                            <p class="savings-percent">(${savingsPercent}% savings)</p>
                        </div>
                    </div>
                    
                    <div class="price-grid">
                        ${product.prices.map((price, idx) => `
                            <div class="market-price ${idx === lowestIdx ? 'lowest' : ''}">
                                <div class="market-name-small">${marketAPI.markets[idx]}</div>
                                <div class="price">${price} RWF</div>
                                ${idx === lowestIdx ? '<span class="badge badge-best">BEST</span>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        ➕ Add to Shopping List
                    </button>
                </div>
            `;
        }).join('');

        resultsDiv.innerHTML = header + productCards;
    }

    // Shopping List Functions
    window.addToCart = function(productId) {
        marketAPI.addToShoppingList({ id: productId });
        updateCartBadge();
        alert('Product added to shopping list! Check the Shopping List tab.');
    };

    function updateCartBadge() {
        const list = marketAPI.getShoppingList();
        const count = list.length;
        cartCount.textContent = count;
        listCount.textContent = count;
    }

    function updateShoppingListDisplay() {
        const list = marketAPI.getShoppingList();
        const shoppingListItems = document.getElementById('shoppingListItems');
        const priceComparison = document.getElementById('priceComparison');
        
        if (list.length === 0) {
            shoppingListItems.innerHTML = `
                <div class="empty-list">
                    <h3>Your shopping list is empty</h3>
                    <p>Search for products and add them to your list</p>
                </div>
            `;
            priceComparison.innerHTML = '';
            return;
        }

        shoppingListItems.innerHTML = `
            <div class="list-header">
                <h3>Your Items (${list.length})</h3>
                <button class="danger-btn" onclick="clearList()">Clear All</button>
            </div>
            ${list.map(item => `
                <div class="list-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>Best price: ${Math.min(...item.prices)} RWF</p>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity - 1})">−</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="removeItem('${item.id}')">🗑️</button>
                    </div>
                </div>
            `).join('')}
        `;

        const totals = marketAPI.calculateTotals();
        const cheapest = totals[0];
        const mostExpensive = totals[totals.length - 1];
        const maxSavings = mostExpensive.total - cheapest.total;

        priceComparison.innerHTML = `
            <div class="comparison-header">
                <h3>💰 Total Cost Comparison</h3>
            </div>
            ${totals.map((marketTotal, idx) => `
                <div class="comparison-item ${idx === 0 ? 'cheapest' : ''}">
                    <div class="market-details">
                        <h4>${marketTotal.market}</h4>
                        <p class="market-type">${marketTotal.details.type}</p>
                    </div>
                    <div class="total-price">
                        <span class="price-big">${marketTotal.total.toFixed(0)} RWF</span>
                        ${idx === 0 ? '<span class="badge badge-best">CHEAPEST</span>' : ''}
                    </div>
                </div>
            `).join('')}
            <div class="savings-summary">
                <p>💡 <strong>You save ${maxSavings.toFixed(0)} RWF</strong> by shopping at <strong>${cheapest.market}</strong>!</p>
            </div>
        `;
    }

    function updateTrendsDisplay() {
        const trendsContent = document.getElementById('trendsContent');
        trendsContent.innerHTML = `
            <div class="trends-info">
                <div class="trend-card">
                    <h3>📊 Market Insights</h3>
                    <p><strong>Cheapest Market:</strong> Kimironko Market</p>
                    <p><strong>Best for Fresh Produce:</strong> Nyabugogo Market</p>
                    <p><strong>Most Convenient:</strong> Simba Supermarket</p>
                </div>
                <div class="trend-card">
                    <h3>💡 Shopping Tips</h3>
                    <ul>
                        <li>Traditional markets offer 10-20% lower prices</li>
                        <li>Nyabugogo Market is best for wholesale</li>
                        <li>Simba Supermarket has consistent quality</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Global functions for shopping list
    window.updateQty = function(id, quantity) {
        marketAPI.updateQuantity(id, quantity);
        updateShoppingListDisplay();
        updateCartBadge();
    };

    window.removeItem = function(id) {
        marketAPI.removeFromShoppingList(id);
        updateShoppingListDisplay();
        updateCartBadge();
    };

    window.clearList = function() {
        if (confirm('Clear all items from shopping list?')) {
            marketAPI.clearShoppingList();
            updateShoppingListDisplay();
            updateCartBadge();
        }
    };
});
