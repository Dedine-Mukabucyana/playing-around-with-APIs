// Rwanda Smart Market API Handler
class MarketAPI {
    constructor() {
        this.markets = CONFIG.markets;
        this.marketDetails = CONFIG.marketDetails;
        this.shoppingList = this.loadShoppingList();
    }

    // PRIMARY API: Open Food Facts (FREE, NO KEY NEEDED)
    async searchProducts(query, category = 'all', sortBy = 'price-low') {
        try {
            const url = `${CONFIG.openFoodFacts.baseURL}?search_terms=${encodeURIComponent(query)}&page_size=20&json=true&fields=${CONFIG.openFoodFacts.fields}`;
            
            console.log('🔌 Fetching from Open Food Facts API:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.products || data.products.length === 0) {
                return {
                    success: true,
                    data: [],
                    query: query,
                    count: 0,
                    message: 'No products found. Try different keywords.'
                };
            }

            const processed = this.processAPIData(data.products, category, sortBy);
            
            return {
                success: true,
                data: processed,
                query: query,
                count: processed.length,
                apiSource: 'Open Food Facts'
            };

        } catch (error) {
            console.error('❌ API Error:', error);
            return {
                success: false,
                error: `Failed to fetch products: ${error.message}`,
                data: []
            };
        }
    }

    // Process Open Food Facts data
    processAPIData(products, category, sortBy) {
        let processed = products
            .filter(p => p.product_name && p.product_name.trim())
            .slice(0, 10)
            .map(product => {
                const prices = this.generateRwandaPrices();
                
                return {
                    id: product.code || Math.random().toString(),
                    name: product.product_name,
                    brand: product.brands || 'Generic',
                    category: this.detectCategory(product.categories || ''),
                    unit: '1 unit',
                    prices: prices,
                    freshness: this.getFreshnessFromGrade(product.nutriscore_grade),
                    image: product.image_url,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviews: Math.floor(Math.random() * 100) + 10,
                    apiSource: 'Open Food Facts',
                    available: true,
                    priceChange: (Math.random() * 20 - 10).toFixed(1)
                };
            });

        if (category !== 'all') {
            processed = processed.filter(p => p.category === category);
        }

        return this.sortProducts(processed, sortBy);
    }

    // Generate realistic Rwanda prices
    generateRwandaPrices() {
        const basePrice = Math.floor(Math.random() * 3000) + 500;
        
        return this.markets.map((market, idx) => {
            let priceModifier = 1;
            
            // Kimironko Market - usually cheapest (traditional market)
            if (idx === 0) priceModifier = 0.85;
            
            // Nyabugogo Market - wholesale prices, very competitive
            if (idx === 1) priceModifier = 0.88;
            
            // Nyarugenge Market - urban market, moderate prices
            if (idx === 2) priceModifier = 0.95;
            
            // Simba Supermarket - modern retail, higher prices
            if (idx === 3) priceModifier = 1.15;
            
            // Kigali City Market - central location, moderate to high
            if (idx === 4) priceModifier = 1.05;
            
            const variation = Math.floor(Math.random() * 400) - 200;
            const price = basePrice * priceModifier + variation;
            
            return Math.max(Math.floor(price), 300);
        });
    }

    detectCategory(categories) {
        const lower = categories.toLowerCase();
        
        if (lower.includes('vegetable')) return 'vegetables';
        if (lower.includes('fruit')) return 'fruits';
        if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese')) return 'dairy';
        if (lower.includes('grain') || lower.includes('rice') || lower.includes('pasta')) return 'grains';
        if (lower.includes('bread') || lower.includes('bakery')) return 'bakery';
        if (lower.includes('meat') || lower.includes('chicken') || lower.includes('beef')) return 'meat';
        
        return 'other';
    }

    getFreshnessFromGrade(grade) {
        if (!grade) return 'Good';
        const g = grade.toLowerCase();
        if (g === 'a' || g === 'b') return 'Excellent';
        if (g === 'c') return 'Good';
        return 'Fair';
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        if (sortBy === 'price-low') {
            sorted.sort((a, b) => Math.min(...a.prices) - Math.min(...b.prices));
        } else if (sortBy === 'price-high') {
            sorted.sort((a, b) => Math.max(...b.prices) - Math.max(...a.prices));
        } else if (sortBy === 'savings') {
            sorted.sort((a, b) => this.calculateSavings(b.prices) - this.calculateSavings(a.prices));
        }
        
        return sorted;
    }

    getLowestPriceIndex(prices) {
        return prices.indexOf(Math.min(...prices));
    }

    getHighestPriceIndex(prices) {
        return prices.indexOf(Math.max(...prices));
    }

    calculateSavings(prices) {
        return Math.max(...prices) - Math.min(...prices);
    }

    calculateSavingsPercentage(prices) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return ((max - min) / max * 100).toFixed(1);
    }

    // Shopping List Management
    addToShoppingList(product) {
        const existing = this.shoppingList.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.shoppingList.push({ ...product, quantity: 1 });
        }
        this.saveShoppingList();
        return this.shoppingList;
    }

    updateQuantity(id, quantity) {
        const item = this.shoppingList.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveShoppingList();
        }
        return this.shoppingList;
    }

    removeFromShoppingList(id) {
        this.shoppingList = this.shoppingList.filter(item => item.id !== id);
        this.saveShoppingList();
        return this.shoppingList;
    }

    clearShoppingList() {
        this.shoppingList = [];
        this.saveShoppingList();
        return this.shoppingList;
    }

    getShoppingList() {
        return this.shoppingList;
    }

    calculateTotals() {
        return this.markets.map((market, idx) => {
            const total = this.shoppingList.reduce((sum, item) => {
                return sum + (item.prices[idx] * item.quantity);
            }, 0);
            return { 
                market, 
                total,
                details: this.marketDetails[market]
            };
        }).sort((a, b) => a.total - b.total);
    }

    saveShoppingList() {
        try {
            localStorage.setItem('rwanda_shopping_list', JSON.stringify(this.shoppingList));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    loadShoppingList() {
        try {
            const saved = localStorage.getItem('rwanda_shopping_list');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            return [];
        }
    }
}

// Initialize API
const marketAPI = new MarketAPI();
