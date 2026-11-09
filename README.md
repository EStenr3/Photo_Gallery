# Nature Photo Gallery Website
Live demo: https://gnwtksf.pythonanywhere.com

## Overview
This project is an online photo gallery showcasing a variety of photos taken outside. It features several static photo collections that can be accessed from the main navigation bar, as well as a search page where users can filter photos by state, category, and various other fields. The website runs on the Flask framework and uses a SQLite database to store photo names and metadata. It uses Bootstrap classes for page styling, along with some custom CSS. Javascript is used to lazy load images, provide hover animations, show a larger preview of each photo when the user clicks on it, and display search options relevant to the user-selected photo category.

## How to Run

### Prerequisites
This project uses Conda for dependency management. In order to activate the virtual environment located in the /env folder, you first need to install Anaconda or Miniconda. Once finished, open a terminal window inside the main project folder and run the command **conda activate ./env**. This will provide access to the Flask library and all other libraries needed to run the Python script. Alternately, you can ignore the /env folder entirely if Flask and its dependencies are already installed on your system.

To run the program, type **flask run** in the command line (make sure you are still working within the Photo\_Gallery folder). The command line will print out a web address that you can type into your browser to view the website. If you get an error saying Flask can't find the file, set the FLASK_APP environment variable to app.py. You can do this with the command **set FLASK\_APP=app.py** for the Windows Command Prompt or **export FLASK\_APP="app.py"** for the Mac or Linux terminal.

## Website Features

### Home page
The home page introduces the website and gives basic usage instructions. It features the common navigation bar, footer, and background gradient that appear throughout the website. The background gradient is a neutral gray color, which helps the photos stand out from the background and also prevents the background from clashing with any of the colors in the photos.

### Navigation
The navigation bar at the top of each web page allows users to access every page on the site, regardless of their location within the site structure. The "Photos" link at the upper left corner leads to the home page, while the "Birds", "Flowers", and "Animals" links lead to the corresponding photo collections. There is no "Landscapes" collection: the "Landscapes" link is actually a Bootstrap dropdown menu that allows users to access the "Maine", "New York", "South Dakota", "Wyoming", "Arizona", and "Utah" photo collections. The "Search" link leads to an interactive search page that displays photos based on user-selected filters. The footer at the bottom of each page has a "Back to Top" button that returns users to the top of the page.

### Photo collections
Each photo collection is web page with a header at the top (displaying the name of the collection) and a grid of relevant photos underneath. The photos are lazy loaded, meaning that they do not display until the user scrolls near them. This helps the page load faster initially. Each photo gets slightly larger when the user hovers over it and returns to its normal size as soon as the user moves the mouse away. This indicates to the user that the photos can be clicked on.

When the user clicks on one of the photos, a larger preview of the photo is displayed in the center of the screen. Attention is drawn to the photo by displaying a white border around it and darkening the surrounding page. The user is also prevented from interacting with the rest of the page while the preview is displayed. As soon as the user clicks anywhere on the screen, the large preview disappears and the page returns to normal.

### Search page
The search page initially displays a list of states and a dropdown box of photo categories. The user can click on one or more state buttons to choose which states to include in the search results. The user can then select exactly one category from the category dropdown (either landscapes, flowers, birds, or animals). After a category is selected, more search options will appear below the dropdown.

If the user selects landscapes, a list of common features (mountains, forest, water, and rock formations) will be shown, and the user can click on one or more feature buttons to specify which features must appear in the resulting images. If multiple features are selected, only images with all of the selected features will appear in the search results.

If the user selects birds or animals, a text input field will appear in which the user can specify a type of bird or animal. 

If the user selects flowers, two text input fields will appear: one will accept a flower type, and the other will accept a flower color. The two text boxes are mutually exclusive: a user can enter either a type or a color, but not both. Clicking on either field will highlight the label to the left of the text box and clear the other text box of all content. It is important to note that all text input fields on the search page are case-insensitive.

At the bottom of the search page is a search button that will send the contents of the form to the server and load a list of matching images at the bottom of the page. The images are displayed exactly as they appear in the collection pages, including the lazy loading feature, hover animation, and "click to preview" functionality. If no images match the specified filters, "no results found" is displayed under the search button. When using the search feature, the user can leave any of the input fields blank. If no state is selected, results from all states will be displayed. If no category is selected, results from all categories will be displayed (this means selecting neither a state nor a category will return all images in the database).

## Project Files

#### photos.db
photos.db is the SQLite3 database that stores all of the data associated with the photos on the website. It has one table, "photos", that contains the "id", "category", "state", "location", "type", "color", "mountains", "forest", "water", and "rocks" fields.

The id field holds integer values and is the primary key of the table. The category field holds one of four text values: "landscape", "bird", "animal", or "flower". The state, type, and color fields also hold text values. The mountains, forest, water, and rocks fields are text fields that hold either "y" for "yes" or "n" for "no" (they can also be blank for photos that are not landscapes). The photos are not actually stored in the database; instead, each photo is identified by its ID number, and the actual photos stored in the /static/images folder are named to match these IDs.

#### app.py
app.py is the Flask application, written in Python, that runs the entire website. The script first initializes the Flask application, connects to the SQLite database using Python's sqlite3 library, and configures the server to add a "Cache-Control: no-cache" HTTP header to all responses sent from the server. This prevents browsers from using cached content without first checking with the server to make sure the content has not changed.

The script defines four main routes: the "/" route, which leads directly to the website's home page; the "/search" route, which leads to the search page; the "/\<category\>" route, which is used to process all URLs leading to a photo collection page, and the "/landscapes/\<state\>" route, which is used to process any route leading to a state landscape collection page. The "/" route simply renders the "index.html" template, displaying a static homepage.

The "/\<category\>" route queries the database for the ID numbers of all images whose category field matches the specified category, then adds the ".webp" file extension to each ID number and passes the resulting list of image filenames to the "collection.html" template, along with the total number of photos and a page title and header derived from the category name. The "/landscapes/\<state\>" route does the same thing, except it finds all photos with a category of "landscape" and a state equal to the specified state. As an example, this means that the route "/birds" would lead to the "Birds" photo collection page and the route "/landscapes/south_dakota" would lead to the "South Dakota" collection page (which only shows photos of landscapes from South Dakota).

The "/search" route accepts both GET and POST requests - if accessed via a GET request, it simply renders the "search.html" template without passing in any data, which will display the search form without any photos. If accessed via a POST request, it first parses the form data in the request to determine which filters the user selected, then dynamically builds and executes a SQlite3 query based on the given filters. The processing logic is specifically set up to only retrieve data from the form and add it to the query if it corresponds to the selected category (so if a tech-savvy user selected "landscapes" and also managed to submit text in the "type" field, the program would not be affected because it would never process the "type" data). When building the query, "?" placeholders are used to represent all unvalidated user input to prevent SQL injection attacks. The user-entered data is then added as parameters when the SQL query is executed. After obtaining a list of matching photo IDs from the database, the "/search" route reconstructs the filenames and passes them to the "search.html" template, which renders the same search form as before with the photo results displayed underneath it.

### /static

#### /images
This folder holds all of the images (WEBP file format) that can be accessed through the photos.db database. They are named to correspond to the ID numbers in the database (for example, the photo with an ID of 54 in the database is named "54.webp" in the images folder). It also holds favicon.ico, the favicon image that is displayed next to the title of each page in the browser tab. The favicon is designed to look like a gallery of photos hanging on a wall.

#### styles.css
This holds all of the custom CSS styles used in the website. Most of the styles are defined using Bootstrap classes, so there are not many style rules in this file. However, styles.css defines the background gradient for al of the pages on the website. This gradient is given a fixed 400px height and set to repeat vertically so it covers the entire page. It is applied to the \<main\> element, which holds the main page content, instead of the \<body\> element so that the upper part of the gradient is not hidden behind the navigation bar at the top of the page (this would make the gradient look inconsistent since it repeats vertically). styles.css also defines several styles for displaying larger previews of photos and adds several styles to the links in the navigation bar, for example changing their color when the user hovers over them.

#### images.js
This file holds all of the Javascript code that controls how images are displayed on the search and collection pages. It attaches several event listeners to all images on the page.

One event listener decreases the amount of padding on the image's parent \<div\> element whenever the user's mouse enters the image area. Because every image is styled with the responsive Bootstrap "img-fluid" class, this increases the size of the image whenever the user hovers over it. Another event listener sets the padding back to normal when the user's mouse leaves the image area, restoring the image's normal size when the user moves the mouse away.

In order to lazy load images, the "src" attribute of each image is initially left blank. The image filename is stored in a different attribute called "location". In images.js, an IntersectionObserver object is created and attached to every image on the page. Whenever an image intersects the browser viewport, the IntersectionObserver object will check all the images on the page to find which images are visible in the viewport, then change the src attribute of each image to equal the value of the location attribute. This means that the images will not be loaded immediately when the page loads, but will only load when they are visible to the user, significantly decreasing overhead loading time.

In addition, an event handler is attached to each image that will fire when the image is clicked. This event handler will first make a transparent black \<div\> visible on the screen by removing its default Bootstrap "d-none" class. This \<div\>, defined in collections.html and styles.css to have a fixed position and a z-index of 1, will cover all content on the screen, stopping the user from triggering click or hover events on any of the images. It will also darken the entire page, making it appear as if the entire page is "grayed out". The event handler will then display a larger preview version of the image in the center of the screen.

Finally, an event handler is attached to the transparent black \<div\> so that clicking on it (and, by extension, clicking its child preview image) deletes the image preview and sets the div's display property to "none" via the Bootstrap d-none class. This makes the div disappear, resetting the page to normal and allowing the user to escape the image preview. Because the div's display property is set to "none" by default, this event handler will only fire when the user is viewing an image in the larger preview mode.

#### search.js
This file holds the Javascript code that controls the photo search page. It adds an event listener to the category dropdown box that runs whenever the user selects a different category. If the user selected the landscapes category, it displays a list of natural features that the user can specify. If the user selected the flowers category, it displays both the type and color input fields. If the user selected the birds or animals category, it displays only the type field. This event handler ensures that the user can only specify filters that are relevant to the chosen category and hides all filters that are irrelevant. If the user selected the option labeled "--Select--", the event handler hides all the extra options because the user has opted not to select a category.

In addition, this file also adds event listeners to the "type" and "color" text input fields so that clicking on one field clears the other. It also changes the color of the label to the left of the chosen field so the user can clearly see which field is active.

### /templates

#### layout.html
This template defines the general page format for the entire website, including the basic HTML file structure, navigation bar, footer, links to styles.css and the Bootstrap style sheet, and the viewport \<meta\> tag for more responsive behavior. It includes several Jinja blocks where later templates can insert the page title, page header, main content, and links to any necessary Javascript files. All other templates on the website extend this template.

#### index.html
This template defines the home page for the website.

#### collection.html
This template defines a page that displays a collections of photos. All the photo collections accessed from the navigation bar use this template. It dynamically generates the page title and \<h1\> heading text based on the variables passed to it from app.py. It also links to the images.js Javascript file. It then uses a Jinja for loop to iterate over the list of photo filenames and create an \<img\> element to display each photo, adding wrapper divs and appropriate Bootstrap classes to display the images in a responsive grid. It also defines the background \<div\> that is used to cover the page when showing an image preview. Finally, it displays the paragraph "No results found" when there are no images to display. This template also defines a "search" block that is used by the search.html template.

#### search.html
This template extends collections.html and defines the search page. It defines a \<form\> element that sends its results back to the "/search" route using a POST request and adds a link to search.js in the \<head\> of the page. After the search query is submitted, the logic from collections.html displays the search results underneath the form.
