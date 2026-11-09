document.addEventListener("DOMContentLoaded", function() {
    /* Define a function for lazy loading images */
    loader = new IntersectionObserver(function(images) {
        /* Chech each image to see which one triggered the function */
        for (let image of images) {
            /* If image is in the browser viewport */
            if (image.isIntersecting) {
                let element = image.target;
                /* Change image's src attribute from blank to actual image url */
                /* (In other words, load the image) */
                element.setAttribute("src", element.getAttribute("location"));
            }
        }
    });

    let cover = document.getElementById("bg_cover");

    /* Iterate over all images on page */
    for (let image of document.getElementsByTagName("img")) {

        /* Attach lazy loading function to image */
        loader.observe(image);

        /* Enlarge image when user hovers over it */
        image.addEventListener("mouseover", function(event) {
            let div = event.currentTarget.parentElement;
            div.classList.replace("p-4", "p-2");
        });
        
        /* Restore normal image size when user moves mouse away */
        image.addEventListener("mouseout", function(event) {
            let div = event.currentTarget.parentElement;
            div.classList.replace("p-2", "p-4");
        });

        /* Add function to view larger image when clicked */
        image.addEventListener("click", function(event) {
            let source = event.target;
            /* Only react to event if image is loaded */
            if (source.getAttribute("src")) {
                /* Grey out background */
                cover.classList.remove("d-none");
                /* Create new image element to display preview */
                preview = document.createElement("img");
                /* Set preview to point to target image url on server */
                preview.setAttribute("src", source.getAttribute("src"));
                /* Set unique element ID */
                preview.setAttribute("id", "preview");
                /* Set CSS formatting */
                preview.setAttribute("class", "position-fixed top-50 start-50 translate-middle border border-white border-3");
                /* Display image preview */
                cover.appendChild(preview);
            }
        });
    }

    /* Add event handler so clicking on cover div makes preview disappear */
    cover.addEventListener("click", function() {
        /* Remove image preview */
        cover.removeChild(document.getElementById("preview"));
        /* Hide cover div */
        cover.classList.add("d-none");
    });

});