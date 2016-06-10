# WDI ATL Project 4/Finals

### One Step Forward, Two Steps Back

> Most people eat.  Every day.  Sometimes two or even three times in a single day.  Some folks don't have the time to cook or they don't like cleaning up afterwards.  A select group of individuals prepare meals professionally.  They spend all day fixing food and keeping their kitchen clean and inspection-ready.  With all they already have to do, keeping up with the inventory and sales can be a chore.  This app is designed to ease that burden.

The goal of this project was to make a full-stack MEAN (Mongo Database, ExpressJS JaveScript Server Framework, AngularJS Client-Side Framework and NodeJS Cross-Platform Runtime Environment) Web Application.

### Models
![#db erb diagram](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2010.28.23.png)
#

My first attempt was based on the Gulp Angular Camping Store exercise.  It presented a menu where a customer can order food using "Add Item" buttons.  The customer also had buttons to "Remove Items" from the order or to "Clear Order" entirely.  Items removed from the order were returned to inventory.  However, the inventory was just a data file, not a MongoDB API (Application Program Interface).

### Gulp Angular Cart
![#db ang-gulp cart](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2010.32.09.png)
#

### Gulp Angular Show Page
![#db ang-gulp show](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2010.32.30.png)
#

### Gulp Angular Remove Item
![#db ang-gulp rem item](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2010.32.56.png)
#

### Gulp Angular Inventory Restocked
![#db ang-gulp inv restore](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2010.33.12.png)
#

The next version used the Full-Stack Camping Store exercise.  On the first build, I tried to alter the security so a customer only had to enter a name, not an email and password.  Unfortunately I was unable to login because of "Missing Credentials."  Next I built the app without security, but that version completely eliminated the user model which is where the order was embedded.  The final version had standard security.  It was able to create an order then move the items back to inventory.  However, the front-end wasn't updating when changes were made in the database.

### Full-Stack Cart
![#db full-stk cart](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.00.18.png)
#

### Full-Stack Negative Inventory
![#db full-stk neg invntry](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.01.55.png)
#

Finally I built a version of my project from the UI-Router Movie app.  First I was stuck because I didn't have a route to update the database.  Next I had a route, but wasn't sending any data.  Next I needed to link my main index page to bower's underscore file.  After that, I didn't have much trouble adopting the Gulp Angular code for my app.  However, at that point, time was up.

### Express Home
![#db xprss home](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.06.29.png)
#

### Express Menu
![#db xprss menu](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.06.51.png)
#

### Express Cart Error
![#db xprss cart err](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.08.38.png)
#

### Express Add Item Button Disabled
![#db xprss disabled bttn](https://github.com/DaveShaffer/xpress-sub-shop-v5/blob/master/public/images/Screen%20Shot%202016-06-09%20at%2011.08.55.png)
#


