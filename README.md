	# Market Compare - Kigali Price Comparison App
**Live Demo**: http://54.197.14.236

**Domain**: http://mukabucyanaservice.tech 
	##  About This Project
-Market Compare is a simple web application that allows users to search for food products and compare prices across 5 major markets in Kigali; the app helps shoppers save money by showing which market has the lowest prices.
	##  Feature
-**Search Products**: Type any food item (milk, bread, rice, etc.) and get results
-**Price Comparison**: Compare prices across 5 Kigali markets like City market, Nyabugogo, Kimironko, Nyamirambo, Remera markets
-**Best Price Highlight**:The cheapest option is highlighted in green
-**Quick Search Buttons**:click search for common items
-**Search Statistics**: Track how many searches you've done and money saved
-**Dark Mode**: Switch between light and dark themes
-**Mobile Friendly**: Works on phones, tablets, and computers
	##  How to Use Locally
### Requirements
- A web browser (Chrome, Firefox, Safari, or Edge)
- No installation needed
### Steps
1. **Download the project:**
bash
   git clone https://github.com/Dedine-Mukabucyana/playing-around-with-APIs.git
   cd playing-around-with-APIs
2. **Open the app:**
   - Double-click `index.html` file
   - OR right-click and choose "Open with Browser"
   - OR drag the file into your browser
3. **Start using:**
   - Type a product name in the search box
   - Press Enter or click a quick search button
   - See price comparisons instantly!
	##  Live Deployment
The app is deployed and accessible at:

-**Load Balancer**: http://54.197.14.236
-**Domain Name**: http://mukabucyanaservice.tech
-**Web Server 1**: http://52.91.188.182
-**Web Server 2**: http://3.86.25.85
### Why This API?
- Completely free to use
- No authentication needed
- Large database of food products
	##  Technologies Used
- **HTML5**: Page structure
- **CSS3**: Styling and design
- **JavaScript**: Search functionality and user interactions
- **Open Food Facts API**: Product data
- **Nginx**: Web server and load balancer
- **Ubuntu Linux**: Server operating system
	##  Project Structure
playing-around-with-APIs/
├── index.html      
├── css/             
├── js/              
├── .gitignore       
└── README.md
	##  Testing
1. Open `index.html` in browser
2. Search for "milk" - should show 5 market prices
3. Click "Bread" button - should show instant results
4. Toggle dark mode - should switch themes
5. Check Profile tab - should show statistics
### Test Load Balancing
Refresh http://54.197.14.236 multiple times. The load balancer distributes requests between Web01 and Web02 automatically.
	##  Troubleshooting
### App Not Loading?
- Check if Nginx is running: `sudo systemctl status nginx`
- Check error logs: `sudo tail -f /var/log/nginx/error.log`
### Search Not Working?
- Check browser console for errors (F12 key)
- Make sure you have internet connection (API needs internet)
- Try searching for simple items: "milk".
### Load Balancer Issues?
- Verify both web servers are running
- Check load balancer configuration: `sudo nginx -t`
- Restart services: `sudo systemctl restart nginx`
	##  Challenges Faced
### 1. Real Market Prices
**Problem**: No API available for actual Kigali market prices  
**Solution**: Created realistic price simulation based on market research and price variations
### 2. Load Balancer Configuration
**Problem**: Load balancer initially served wrong page  
**Solution**: Removed all default Nginx configs, created clean configuration with proper  settings
       ###  Security & Privacy
- **No user data collected** - Everything runs in your browser
- **No passwords needed** - No login system
- **Safe to use** - No personal information stored
	##  Future Improvements

- Add more products to the database
- Connect to real market price APIs when availabble
- Shopping list feature
- Support for French and Kinyarwanda languages
	## 👤 Author

**Dedine Mukabucyana**
- GitHub: [@Dedine-Mukabucyana](https://github.com/Dedine-Mukabucyana/playing-around-with-APIs)
- Project: [playing-around-with-APIs](https://github.com/Dedine-Mukabucyana/playing-around-with-APIs)
