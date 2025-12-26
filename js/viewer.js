import { Viewer } from '@photo-sphere-viewer/core';

const listnameRegex = /^\?l=(list_.*?)$/gm;
const listname = listnameRegex.exec(window.location.search);

if (listname !== null && rebuildImageList(listname[1])) {
    document.title = imagedata.title;

    document.getElementById("viewer").classList.remove("hidden");
    document.getElementById("invalidlist").classList.add("hidden");
    const NAVLIST = document.createElement("UL");

    function buildNavList() {
        NAVLIST.innerHTML = "";
        NAVLIST.id = "list";
        imagedata.images.forEach((e)=>{
            const LI = document.createElement("LI");
            const A = document.createElement("A");
            A.textContent = e.caption;
            A.setAttribute("href", `#${e.src}`);
            LI.append(A);
            NAVLIST.append(LI);
        });
    }

    function convertGPSCoord(coord, ref) {
        if (!coord || !ref) {
            return false;
        }
        let ret = coord[0];
        if (ref == "S" || ref == "W") {
            ret *= -1;
        }
        return ret;
    }

    function handleEXIFData(exifdata) {
        console.debug(exifdata);
        const mapbutton = viewer.navbar.getButton("map");
        if (!exifdata) {
            mapbutton.hide();
            return;
        }
        let lat = convertGPSCoord(exifdata.GPSLatitude, exifdata.GPSLatitudeRef);
        let long = convertGPSCoord(exifdata.GPSLongitude, exifdata.GPSLongitudeRef);
        if (lat !== false && long !== false) {
            mapbutton.href = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${long}`;
            mapbutton.show();
        }
    }

    async function showImage(toshow) {
        // toshow should be the index of te image to show (int) or the path to the image (string)
        let index = false;
        if (typeof toshow === "string") {
            index = imagedata.indices[toshow];
        } else if (typeof toshow === "number") {
            index = toshow;
        }
        if (index === false) {
            console.error(`Unknown image ${toshow}`);
            return;
        }
        if (index < 0) {
            imagedata.curindex = imagedata.images.length - 1;
        } else if (index >= imagedata.images.length) {
            imagedata.curindex = 0;
        } else {
            imagedata.curindex = index
        }
        let showDetails = viewer.panel.isVisible("description");
        viewer.panel.hide();
        viewer.navbar.getButton("map").hide();
        const img = new Image();
        img.src = imagedata.images[imagedata.curindex].src;
        await img.decode();
        EXIF.getData(img, function() { handleEXIFData(EXIF.getAllTags(this)); });
        
        viewer.setPanorama(imagedata.images[imagedata.curindex].src, {
            caption: imagedata.images[imagedata.curindex].caption,
            description: imagedata.images[imagedata.curindex].description,
            position: {
                pitch: imagedata.images[imagedata.curindex].pitch,
                yaw: imagedata.images[imagedata.curindex].yaw
            },
            zoom: imagedata.images[imagedata.curindex].zoom
        });
        if (showDetails) {
            const P = document.createElement("P");
            P.textContent = imagedata.images[imagedata.curindex].caption;
            const PANELDATA = document.createTextNode(P.outerHTML);
            PANELDATA.appendData(imagedata.images[imagedata.curindex].description);
            viewer.panel.show({id: "description", content: PANELDATA.data});
        }
    }

    function nextImage() {
        showImage(imagedata.curindex + 1);
    }

    function prevImage() {
        showImage(imagedata.curindex - 1);
    }

    const viewer = new Viewer({
        container: document.querySelector('#viewer'),
        navbar: [
            {id: "list", title: "Show images list", content: document.querySelector("#listicon").innerHTML, onClick: (viewer) =>{
                //viewer.overlay.show({dismissable: true, id: "test", text:"Test overlay text", title: "Test"});
                viewer.panel.show({id: "test", content: NAVLIST.innerHTML});
            }},
            {id: "first", title: "Jump to first", content: document.querySelector("#firsticon").innerHTML, onClick: (viewer)=>{
                showImage(0);
            }},
            {id: "prev", title: "Previous image", content: document.querySelector("#previcon").innerHTML, onClick: (viewer)=>{
                prevImage();
            }},
            {id: "next", title: "Next image", content: document.querySelector("#nexticon").innerHTML, onClick: (viewer)=>{
                nextImage();
            }},
            {id: "last", title: "Jump to last", content: document.querySelector("#lasticon").innerHTML, onClick: (viewer)=>{
                showImage(-1);
            }},
            "zoom",
            "move",
            "description",
            {id: "map", title: "Show on map", content: document.querySelector("#locationicon").innerHTML, visible: false, href: "", onClick: (viewer) => {
                window.open(viewer.navbar.getButton("map").href, "_blank");
            }},
            "caption",
            "fullscreen",
        ],
        minFov: 10,
        defaultTransition: {
            effect: "black",
            speed: 0.0
        }
    });
    viewer.addEventListener("position-updated", (data) => {
        document.getElementById("yawcoord").textContent = `${data.position.yaw.toFixed(2)}`;
        document.getElementById("pitchcoord").textContent = `${data.position.pitch.toFixed(2)}`;
    });
    viewer.addEventListener("zoom-updated", (data) => {
        document.getElementById("zoomamount").textContent = `${data.zoomLevel.toFixed(1)}`;
    });
    viewer.addEventListener("key-press", ({key})=> {
        switch(key) {
            case "ArrowLeft":
            case "ArrowDown":
                prevImage();
                break;
            case "ArrowRight":
            case "ArrowUp":
            case "Enter":
            case " ":
                nextImage();
                break;
            case "F9":
                document.getElementById("coords").classList.toggle("hidden");
                break;
            case "Home":
                showImage(0);
                break;
            case "End":
                showImage(-1);
                break;
            case "i":
                const detailsbutton = viewer.navbar.getButton('description', false);
                //console.log(detailsbutton);
                break;
            default:
                console.debug(key);
            }
    });
    viewer.addEventListener("panorama-loaded", ()=>{window.location.hash = "#"});
    document.getElementById("copycoords").addEventListener("click", (data) => {
        navigator.clipboard.writeText(`        pitch: ${viewer.getPosition().pitch},\n        yaw: ${viewer.getPosition().yaw},\n        zoom: ${viewer.getZoomLevel()},`);
    });
    window.location.hash = "#";
    window.addEventListener("hashchange", (e) => {
        viewer.panel.hide("list");
        if (window.location.hash.length > 1) {
            showImage(window.location.hash.substr(1));
        }
    })
    buildNavList();
    showImage(0);
} else if (window.location.search === "?masterlist") {
    document.getElementById("invalidlist").classList.add("hidden");
    const UL = document.getElementById("masterlist");
    for (let imagelistkey in allimages) {
        const LI = document.createElement("LI");
        const A = document.createElement("A");
        A.textContent = `${allimages[imagelistkey].title} (${allimages[imagelistkey].images.length} images)`;
        A.setAttribute("href", `/?l=${imagelistkey}`);
        LI.append(A);
        UL.append(LI);
    }
    UL.classList.remove("hidden");
} else {
    document.title = "Invalid list";
}