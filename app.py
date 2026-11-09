""" Import libraries """
# Import needed components from Flask library
from flask import Flask, render_template, request

# Import other Python libraries
from sqlite3 import connect




""" Configure application """
# Initialize Flask application
app = Flask(__name__)

# This code will modify each HTTP response before server sends it
@app.after_request
def modify(response):
    # Make sure browsers check for changes before using cached content
    response.headers["Cache-Control"] = "no-cache"
    return response

# Connect to database
db = connect("photos.db", check_same_thread=False)




""" Define URL routes """
@app.route("/")
def index():
    return render_template("index.html")


# Search page supports both GET and POST methods
@app.route("/search", methods=["GET", "POST"])
def search():
    # User has not searched for photos yet
    if request.method == "GET":
        return render_template("search.html")
    # Otherwise user has submitted a search request

    """ Process form data """
    # Read state checkboxes into a list of selected states
    states = []
    if request.form.get("maine"):
        states.append("Maine")
    if request.form.get("new_york"):
        states.append("New York")
    if request.form.get("south_dakota"):
        states.append("South Dakota")
    if request.form.get("wyoming"):
        states.append("Wyoming")
    if request.form.get("arizona"):
        states.append("Arizona")
    if request.form.get("utah"):
        states.append("Utah")
    # Read category selection
    category = request.form.get("category")
    # If user selected landscapes category
    if category == "landscape":
        # Read features checkboxes
        features = []
        if request.form.get("mountains"):
            features.append("mountains")
        if request.form.get("forest"):
            features.append("forest")
        if request.form.get("water"):
            features.append("water")
        if request.form.get("rocks"):
            features.append("rocks")
    # If user selected flowers category
    elif category == "flower":
        # Read type field if filled in
        if request.form.get("type"):
            type = request.form.get("type").lower()
            color = ""
        # Read color field if filled in
        elif request.form.get("color"):
            color = request.form.get("color").lower()
            type = ""
        # Mark both fields as blank if neither is filled in
        else:
            type = ""
            color = ""
    # If user selected birds category
    elif category == "bird":
        # Read type field if filled in
        if request.form.get("type"):
            type = request.form.get("type").lower()
        else:
            type = ""
    # If user selected animals category
    elif category == "animal":
        # Read type field if filled in
        if request.form.get("type"):
            type = request.form.get("type").lower()
        else:
            type = ""
    # Else no category or invalid category is selected
    else:
        category = ""

    """ Prepare database query based on search parameters """
    # Beginning of any query (end each query expecting next condition)
    query = "SELECT id FROM photos WHERE "
    # Empty list to hold unsanitized user input
    parameters = []
    # If user picked a category
    if category:
        # Add category section to query
        query += "category = ? AND "
        # Add category to parameters list
        parameters.append(category)
    # If user picked at least one state
    if states:
        # Start subcondition
        query += "("
        # Attach each state to query
        for state in states:
            # Leave query ready for next state
            query += "state = ? OR "
            # Add state to parameters list
            parameters.append(state)
        # End query to avoid trailing OR and close parentheses
        # Will not affect results because 0=1 is false
        query += "0 = 1) AND "
    # If category is landscapes
    if category == "landscape":
        # Start subcondition
        # Check for each allowable feature and add to query if it exists
        if "mountains" in features:
            query += "mountains = 'y' AND "
        if "forest" in features:
            query += "forest = 'y' AND "
        if "water" in features:
            query += "water = 'y' AND "
        if "rocks" in features:
            query += "rocks = 'y' AND "
    # If category accepts a type
    if category == "bird" or category == "animal" or category == "flower":
        # If user provided a type
        if type:
            # Add type section to query
            query += "type = ? AND "
            # Add type to parameters list
            parameters.append(type)
    # If category is flowers (can take a color) and user did not enter type
    if category == "flower" and not type:
        # If user entered a color
        if color:
            # Add color section to query with trailing AND for consistency
            query += "color = ? AND "
            # Add color to parameters list
            parameters.append(color)
    # End query (1=1 is true and will not affect results)
    # Avoids a trailing AND at end of query
    query += "1 = 1"
    # Convert parameters list to tuple for compatibility with sqlite3 library
    parameters = tuple(parameters)

    # Execute SQL query to find all photos matching search criteria 
    rows = db.execute(query, parameters)
    # List to hold photo filenames
    photos = []
    # Add filename of each photo to list
    for row in rows:
        photos.append(str(row[0]) + ".webp")

    # Render search page template with photos
    return render_template("search.html", photos=photos, num_photos = len(photos))
        

# Category pages (birds, animals, or flowers)
@app.route("/<category>")
def topic(category):
    # Remove 's' from end of category name to match database records
    dbCategory = category[0:len(category)-1]
    # Query database for list of matching rows
    results = db.execute("SELECT id FROM photos WHERE category = ?", (dbCategory,))
    # Empty list to hold photo filenames
    photos = []
    # For each row in query results
    for row in results:
        # Generate filename by adding file extension to id number
        photos.append(str(row[0]) + ".webp")
    # Title case category name for page header
    title = category.title().replace("_", " ")
    # Return web page
    return render_template("collection.html", title=title, heading=title, photos=photos, num_photos = len(photos))


# State (landscape) pages
@app.route("/landscapes/<state>")
def landscape(state):
    # Title case state and replace underscores with spaces
    # for page header and to match database entries
    state = state.title().replace("_", " ")
    # Query database for matching rows
    rows = db.execute("SELECT id FROM photos WHERE category = 'landscape' AND state = ?", (state,))
    # List to hold photo filenames
    photos = []
    # Iterate over list of rows
    for row in rows:
        # Add filename to list
        photos.append(str(row[0]) + ".webp")
    # Return web page
    return render_template("collection.html", title=state + " Landscapes", heading=state, photos=photos, num_photos = len(photos))
