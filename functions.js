var url = "-"
var query = "-"
var totalPages = 0
var bgImg = "./ bgImage2new.jpg"
const clientId = "Enter your client Id here"
let searchPhoto = "https://api.unsplash.com/search/photos?query="
let randomPhoto = "https://api.unsplash.com/photos/random?"
let maxPhotos = 30

document.querySelector(".NoOfPhotos").addEventListener("change", () => {
    maxPhotos = event.target.value
    console.log(maxPhotos)
    let divEle = document.querySelector("#allPhotos")
    if (divEle.childElementCount != 0 && !divEle.children[0].children[0].classList.contains("nothingFound"))
        search()

})

async function work(url) {
    console.log(maxPhotos)
    console.log(url)
    let divEle = document.querySelector("#allPhotos")
    divEle.innerHTML = ""
    let orinetationEle = document.querySelector(".orientation")
    let orient = orinetationEle.value
    console.log(orient)
    await fetch(url)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            // console.log(data)
            totalPages = data.total_pages;
            if (totalPages == 0) {
                let curImage = document.createElement('div');
                curImage.innerHTML = "<img class = 'nothingFound' onload='blinkNotFound(this)' src=" +
                    "oops-nothing-found-here.jpg" + "></img>"
                divEle.appendChild(curImage)
            }
            else {
                data.results.forEach(photo => {
                    let curImage = document.createElement('div');
                    curImage.setAttribute("ondblclick", "popUp(this)")
                    if (photo.height < photo.width) {
                        // console.log(photo.links.download + " in adder")
                        curImage.innerHTML = "<label class='reg'>" + photo.links.download + "</label>" +
                            "<label class='reg'>" + photo.urls.regular + "</label>" +
                            "<img class = 'land' id='resImage' src=" + photo.urls.thumb + "></img>" +
                            "<label class='reg'>" + photo.likes + "</label>"
                    }
                    else if (photo.height >= photo.width) {
                        curImage.innerHTML = "<label class='reg'>" + photo.links.download + "</label>" +
                            "<label class='reg'>" + photo.urls.regular + "</label>" +
                            "<img class = 'port' id='resImage'  src=" + photo.urls.thumb + "></img>" +
                            "<label class='reg'>" + photo.likes + "</label>"
                    }
                    divEle.appendChild(curImage)
                });
            }
        })

    await (function orinetationEle() {
        let resImgEle = document.querySelectorAll("#resImage")
        for (var x = 0; x < resImgEle.length; x++) {
            if (orient == 'Landscape') {
                if (resImgEle[x].classList.contains("land"))
                    resImgEle[x].style.display = "block";
            }
            else if (orient == 'Portrait') {
                if (resImgEle[x].classList.contains("port"))
                    resImgEle[x].style.display = "block";
            }
            else {
                resImgEle[x].style.display = "block"
            }
        }
    }())
}

function blinkNotFound(t) {
    let blinkCnt = 0;
    let intvl = setInterval(() => {
        blinkCnt += 1;
        console.log("Nothing found")
        t.style.height = (t.style.height == "18rem") ? "20rem" : "18rem";
        if (blinkCnt == 10) {
            clearInterval(intvl);
        }
    }, 500)
}


// search button
async function search() {
    query = document.getElementById("input").value;
    if (query == "")
        return;
    let pageEle = document.getElementById("Page")
    let controlPanelEle = document.querySelector(".controlPanel")
    pageEle.style.display = 'none';
    controlPanelEle.style.display = 'none';

    let titleEle = document.querySelector(".title")
    titleEle.style.paddingTop = '0.5rem';

    let page = document.getElementById("PageNumber");
    page.innerText = 1;

    url = searchPhoto + query + "&page=" + 1 + "&per_page=" + maxPhotos + "&client_id=" + clientId;
    await work(url)

    let lastPageEle = document.getElementById("LastPage");
    lastPageEle.innerText = totalPages;

    let nextBtnEle = document.querySelector(".next")
    let prevBtnEle = document.querySelector(".prev")
    prevBtnEle.disabled = true;
    prevBtnEle.classList.add("disabled")
    if (totalPages == 1) {
        nextBtnEle.disabled = true;
        nextBtnEle.classList.add("disabled")
    }
    if (totalPages != 0) {
        pageEle.style.display = 'flex';
        controlPanelEle.style.display = 'flex';
    }
}


//next button
function next() {
    let divEle = document.querySelector("#allPhotos")
    divEle.innerHTML = ""
    let page = document.getElementById("PageNumber");
    let curPage = parseInt(page.innerText) + 1;


    let nextBtnEle = document.querySelector(".next")
    let prevBtnEle = document.querySelector(".prev")
    prevBtnEle.disabled = false;
    prevBtnEle.classList.remove("disabled")
    if (curPage == totalPages) {
        nextBtnEle.disabled = true;
        nextBtnEle.classList.add("disabled")
    }


    let url = searchPhoto + query + "&page=" + curPage + "&per_page=" + maxPhotos + "&client_id=" + clientId;
    work(url)
    page.innerText = parseInt(curPage);
}


//prev button
function prev() {
    let divEle = document.querySelector("#allPhotos")
    divEle.innerHTML = ""
    let page = document.getElementById("PageNumber");
    let curPage = parseInt(page.innerText) - 1;
    if (curPage == 0) {
        curPage = 1;
        alert("Its the first Page\nCan't go at prev page")
    }
    let nextBtnEle = document.querySelector(".next")
    let prevBtnEle = document.querySelector(".prev")
    nextBtnEle.disabled = false;
    nextBtnEle.classList.remove("disabled")
    if (curPage == 1) {
        prevBtnEle.disabled = true;
        prevBtnEle.classList.add("disabled")
    }
    let url = searchPhoto + query + "&page=" + curPage + "&per_page=" + maxPhotos + "&client_id=" + clientId;
    work(url)
    page.innerText = parseInt(curPage);
}

//Change in orinetation.
let orinetationEle = document.querySelector(".orientation")
orinetationEle.addEventListener("change", function (e) {
    let resImgEle = document.querySelectorAll("#resImage")
    orient = this.value
    console.log(orient)
    for (var x = 0; x < resImgEle.length; x++) {
        resImgEle[x].style.display = "none";
        // console.log(resImgEle[x].classList)
        if (orient == 'Landscape') {
            if (resImgEle[x].classList.contains("land"))
                resImgEle[x].style.display = "block";
        }
        else if (orient == 'Portrait') {
            if (resImgEle[x].classList.contains("port"))
                resImgEle[x].style.display = "block";
        }
        else {
            resImgEle[x].style.display = "block"
        }
    }
})


//Random images
function randomImages() {
    let pageEle = document.getElementById("Page")
    pageEle.style.display = 'none';

    let controlPanelEle = document.querySelector(".controlPanel")
    controlPanelEle.style.display = 'none';

    let titleEle = document.querySelector(".title")
    titleEle.style.paddingTop = '0.5rem';

    let divEle = document.querySelector("#allPhotos")
    divEle.innerHTML = ""
    url = randomPhoto + "&page=" + 1 + " &per_page=30&client_id=" + clientId;
    fetch(url)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            if (data.height > data.width) {
                console.log("Portrait")
            }
            let curImage = document.createElement('div');
            curImage.innerHTML = "<img src=" + data.urls.small_s3 + "></img>"
            divEle.appendChild(curImage)
        });
}

// added the event listener for enter key
let searchBox = document.getElementById("input")
console.log(searchBox.innerHTML)
searchBox.addEventListener("keydown", function (e) {
    let key = e.key;
    if (key == "Enter") {
        console.log("hello");
        search()
    }
});


//event listener for in and out of mouse on the cur page number
let curPageEle = document.getElementById("PageNumber")
curPageEle.addEventListener("mouseover", function () {
    setInterval(blink(this), 500);
})
function blink(t) {
    t.style.backgroundColor = (t.style.backgroundColor == "red") ? "rgb(79, 5, 5)" : "rgb(228, 154, 79)";
}
curPageEle.addEventListener("mouseout", function () {
    this.style.backgroundColor = "rgb(79, 5, 5)";
})

// To load the different background on each reload.
async function loadBg() {
    async function fecthBgIMg() {
        let clientId = "FHLmBfpRd6ZjRMAu22JS_3lVTtvj89OF-_heW9q4yYg"
        url = "https://api.unsplash.com/photos/random?" + "&page=" + 1 + " &per_page=30&client_id=" + clientId;
        await fetch(url)
            .then(function (data) {
                return data.json();
            }).then(function (data) {
                // if (data.height + "5rem" < data.width)
                bgImg = data.urls.regular
                // else
                //     loadBg()
            })
    }
    var bodyEle = document.querySelector("body")
    await fecthBgIMg();
    console.log(bgImg)
    bodyEle.style.backgroundImage = "url(" + bgImg + ")";
}


//Pop up window
function popUp(t) {
    // console.log("download", t.children[0].innerHTML)
    // console.log("regular version of image", t.children[1].innerHTML)
    let popUpWindow = document.querySelector(".imagePopUpWindow")
    popUpWindow.style.display = "block";
    // popUpWindow.innerHTML = "";
    popUpWindow.children[0].innerHTML = ""
    let popImgEle = document.createElement('div')
    let imgSrc = t.children[1].innerHTML;
    popImgEle.innerHTML = "<img class='imgInPopUp'src=" + imgSrc + ">";

    //adding the download button
    let downBtnEle = document.querySelector(".downBtn")
    let downloadBtn = document.createElement("button")
    downloadBtn.innerHTML = "<a style='text-decoration:none' href='" +
        t.children[0].innerHTML + "&force=true'>Download</a>"
    console.log(downloadBtn.innerHTML)
    downloadBtn.classList.add("downloadBtn")
    downBtnEle.appendChild(downloadBtn)

    //adding the number of likes.
    let likesBtn = document.querySelector(".noOfLikes")
    likesBtn.innerText = t.children[3].innerText

    popUpWindow.children[0].appendChild(popImgEle)
}

//Close the popUp window.
function closePopUp() {
    let popUpWindow = document.querySelector(".imagePopUpWindow")
    popUpWindow.style.display = "none";
}

// async function loadBg() {
//     async function fecthBgIMg() {
//         let clientId = "FHLmBfpRd6ZjRMAu22JS_3lVTtvj89OF-_heW9q4yYg"

//         url = "https://api.unsplash.com/photos/random?" + "&page=" + 1 + " &per_page=30&client_id=" + clientId;
//         try {
//             var p = new Promise(await fetch(url))
//         }
//         catch (e) {
//             console.log(e)
//         }
//         p.then(function (data) {
//             return data.json();
//         })
//             .then(function (data) {
//                 bgImg = data.urls.regular
//             })
//     }
//     var bodyEle = document.querySelector("body")
//     await fecthBgIMg();
//     console.log(bgImg)
//     bodyEle.style.backgroundImage = "url(" + bgImg + ")";
// }



// why not working like this
// curPageEle.addEventListener("mouseover", function () {
//     this.style.backgroundColor == "red" ? "rgb(79, 5, 5)" : "red";
// })
// // curPageEle.addEventListener("mouseout", function () {
// //     this.style.backgroundColor = "rgb(79, 5, 5)";
// // })

function download(url) {
    console.log("Yes" + url)
}
