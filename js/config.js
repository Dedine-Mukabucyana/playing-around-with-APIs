// API Configuration for Rwanda Smart Market
const CONFIG = {
    // Open Food Facts API (No API Key Required - FREE)
    openFoodFacts: {
        baseURL: 'https://world.openfoodfacts.org/cgi/search.pl',
        fields: 'product_name,brands,categories,image_url,nutriscore_grade,code'
    },
    
    // Rwanda Markets
    markets: [
        'Kimironko Market',
        'Nyabugogo Market',
        'Nyarugenge Market',
        'Simba Supermarket',
        'Kigali City Market'
    ],
    
    // Market Details
    marketDetails: {
        'Kimironko Market': {
            location: 'Gasabo District',
            type: 'Traditional Market',
            specialty: 'Fresh produce, local goods'
        },
        'Nyabugogo Market': {
            location: 'Nyarugenge District',
            type: 'Major Market Hub',
            specialty: 'Wholesale & retail, diverse products'
        },
        'Nyarugenge Market': {
            location: 'Nyarugenge District',
            type: 'Urban Market',
            specialty: 'Daily essentials, fresh foods'
        },
        'Simba Supermarket': {
            location: 'Multiple Locations',
            type: 'Modern Supermarket',
            specialty: 'Imported & local products'
        },
        'Kigali City Market': {
            location: 'City Center',
            type: 'Central Market',
            specialty: 'Electronics, clothing, food'
        }
    }
};
