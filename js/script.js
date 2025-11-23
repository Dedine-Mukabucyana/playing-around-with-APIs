// Simple Market Comparison App
class SimpleMarketApp {
    constructor() {
        this.markets = [
            { name: 'City Market', type: 'Central Market' },
            { name: 'Nyabugogo', type: 'Traditional Market' },
            { name: 'Kimironko', type: 'Traditional Market' }
        ];
        
        this.products = {
            'milk': { basePrice: 1800, emoji: '🥛' },
            'bread': { basePrice: 1200, emoji: '🍞' },
            'rice': { basePrice: 2500, emoji: '🍚' },
            'eggs': { basePrice: 3500, emoji: '🥚' },
            'sugar': { basePrice: 2000, emoji: '🍬' },
            'prawn crackers': { basePrice: 1700, emoji: '🍤' }
        };
        
        this.init();
    }

    init() {
        this.loadProduct('prawn crackers');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchProduct();
            }
        });
    }

    searchProduct() {
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchTerm) {
            this.loadProduct(searchTerm);
        }
    }

    loadProduct(productName) {
        this.showLoading();
        
        // Simulate API delay
        setTimeout(() => {
            const product = this.products[productName] || { 
                basePrice: 1500, 
                emoji: '🛒' 
            };
            
            this.displayProduct(productName, product);
            this.hideLoading();
        }, 1000);
    }

    displayProduct(productName, product) {
        // Update product title
        const displayName = productName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        document.getElementById('productTitle').textContent = displayName;

        // Generate prices and display markets
        const prices = this.generatePrices(product.basePrice);
        const bestPriceIndex = this.getBestPriceIndex(prices);
        
        const marketCards = this.markets.map((market, index) => {
            const isBestPrice = index === bestPriceIndex;
            
            return `
                <div class="market-card ${isBestPrice ? 'best-price' : ''}">
                    <div class="market-header">
                        <h3>${market.name}</h3>
                        <span class="market-type">${market.type}</span>
                    </div>
                    <div class="price">${prices[index]} RWF</div>
                    ${isBestPrice ? '<div class="best-price-badge">Best Price 🏆</div>' : ''}
                </div>
            `;
        }).join('');

        document.getElementById('marketCards').innerHTML = marketCards;
    }

    generatePrices(basePrice) {
        return this.markets.map((market, index) => {
            let priceModifier = 1;
            
            // City Market - moderate prices
            if (index === 0) priceModifier = 0.95;
            
            // Nyabugogo - competitive prices
            if (index === 1) priceModifier = 1.0;
            
            // Kimironko - slightly higher
            if (index === 2) priceModifier = 1.05;
            
            const variation = Math.floor(Math.random() * 200) - 100;
            const price = basePrice * priceModifier + variation;
            
            return Math.max(Math.floor(price), 500);
        });
    }

    getBestPriceIndex(prices) {
        return prices.indexOf(Math.min(...prices));
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('marketCards').innerHTML = '';
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Global functions for HTML onclick
function loadProduct(productName) {
    app.loadProduct(productName);
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SimpleMarketApp();
});
