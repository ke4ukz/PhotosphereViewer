// Database of photo spheres
// TODO: Replace this virtual database with an actual database (not stored in the js file)
const allimages = {
    list_60e48abc9dfa49a9b728b4ab349a4d38: {
        title: "2025 VA Beach Trip",
        images: [
            {
                src: "/images/beachhouse.jpg",
                pitch: -0.06482242575961816,
                yaw: 4.954792236794986,
                zoom: 60,
                caption: "Deck corner",
                description: "This is a view from the corner of the deck. 2025-01-05"
            },
            {
                src: "/images/porch2.JPG",
                pitch: 0,
                yaw: 0,
                zoom: 60,
                caption: "Deck",
                description: "View of the beach from the deck. 2025-01-05"
            },
            {
                src: "/images/livingroom.JPG",
                pitch: -0.18,
                yaw: 0.42,
                zoom: 16.6,
                caption: "Living Room",
                description: "View of the living room. 2025-01-05",
                group: "beachinside"
            },
            {
                src: "/images/sittingroom.JPG",
                pitch: 0,
                yaw: 4.4,
                zoom: 20,
                caption: "Sitting Room",
                description: "View of the sitting room and dining room. 2025-01-05",
                group: "beachinside"
            }
        ]
    }
};

// this is the currently selected image list that the user can cycle through
const imagedata = {
    title: "",
    images: [],
    indices: {},
    curindex: 0
}

// build imagedata from allimages based on the provided list name
// TODO: replace this with a database load
function rebuildImageList(listname) {
    if (allimages[listname]) {
        imagedata.images = [];
        imagedata.indices = {}
        imagedata.curindex = 0;
        imagedata.images = allimages[listname].images;
        imagedata.title = allimages[listname].title;
        // build a cross-reference to go from src to list index
        for (let i=0; i<imagedata.images.length; i++) {
            imagedata.indices[imagedata.images[i].src] = i;
        }
        return true;
    } else {
        return false;
    }
}

