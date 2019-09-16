let gallery = (function () {
    let dataSize = {};
    let dataLength = 0;
    let currentData = null;
    let navbarHeight = 60;
    let resizeTimeout = null;
    let xmlhttp = new XMLHttpRequest();


    function polaroidGallery(url) {
        observe();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let myArr = JSON.parse(xmlhttp.responseText);
                setGallery(myArr);

                init();
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function setGallery(arr) {
        let out = "";
        let i;
        for (i = 0; i < arr.length; i++) {
            out += '<div class="photo" id="' + i + '"><div class="side side-front"><figure>' +
                '<img src="' + arr[i].name + '" alt="' + arr[i].name + '"/>' +
                '<figcaption>' + arr[i].caption + '</figcaption>' +
                // '<button onclick="clone()" id="like" class="heart" > like</button>' +
                '</figure></div><div class="side side-back"><div><p>' + arr[i].description + '</p></div></div></div>'
            ;

        }
        document.getElementById("gallery").innerHTML = out;

        // function clone(){
        //
        //
        //     // accessing div attribute using a
        //     //variable geek
        //     let pics =
        //         document.getElementById("photo")[0];
        //
        //     // cloning geek variable into a variable
        //     //named clone
        //     let clone = pics.cloneNode(true);
        //
        //     // adding our clone variable to end
        //     //of the document
        //     document.body.appendChild(clone);
        // }

    }


    function observe() {
        let observeDOM = (function () {
            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
                eventListenerSupported = window.addEventListener;

            return function (obj, callback) {
                if (MutationObserver) {
                    let obs = new MutationObserver(function (mutations, observer) {
                        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                            callback(mutations);
                    });

                    obs.observe(obj, { childList: true, subtree: false });
                }
                else if (eventListenerSupported) {
                    obj.addEventListener('DOMNodeInserted', callback, false);
                }
            }
        })();

        observeDOM(document.getElementById('gallery'), function (mutations) {
            let gallery = [].slice.call(mutations[0].addedNodes);
            gallery.forEach(function (item) {
                let img = item.getElementsByTagName('img')[0];
                let fig = item.getElementsByTagName('figure')[0];
                let first = true;

                img.addEventListener('load', function () {
                    item.style.height = (fig.offsetHeight).toString() + 'px';
                    item.style.width = (fig.offsetWidth).toString() + 'px';

                    dataSize[item.id] = {item: item, width: item.offsetWidth, height: img.offsetHeight};

                    if (first) {
                        currentData = dataSize[item.id];
                        first = false;
                    }

                    dataLength++;

                    item.addEventListener('click', function () {
                        if ((currentData != dataSize[item.id]) || (currentData == null)) {
                            select(dataSize[item.id]);
                            shuffleAll();
                        } else {
                            item.classList.contains('flipped') === true ? item.classList.remove('flipped') : item.classList.add('flipped');
                        }
                    });
                    shuffle(dataSize[item.id]);
                })
            });
        });
    }

    function init() {
        navbarHeight = document.getElementById("nav").offsetHeight;
        navigation();

        window.addEventListener('resize', function () {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
                shuffleAll();
                if (currentData) {
                    select(currentData);
                }
            }, 100);
        });
    }

    function select(data) {
        let scale = 1.8;

        let x = (window.innerWidth - data.item.offsetWidth) / 2;
        let y = (window.innerHeight - navbarHeight - data.item.offsetHeight) / 2;

        data.item.style.zIndex = 999;
        data.item.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
        data.item.style.mozTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
        data.item.style.msTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
        data.item.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';

        currentData = data;
    }

    function shuffle(data) {
        let randomX = Math.random();
        let randomY = Math.random();
        let maxR = 45;
        let minR = -45;
        let rotRandomD = Math.random() * (maxR - minR) + minR;

        let x = Math.floor((window.innerWidth - data.item.offsetWidth) * randomX);
        let y = Math.floor((window.innerHeight - data.item.offsetHeight - navbarHeight) * randomY);

        data.item.style.zIndex = 1;
        data.item.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
        data.item.style.mozTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
        data.item.style.msTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
        data.item.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
    }

    function shuffleAll() {
        for (let id in dataSize) {
            if (id != currentData.item.id) {
                shuffle(dataSize[id]);
            }
        }
    }

    function navigation() {
        let next = document.getElementById('next');
        let preview = document.getElementById('preview');
        let like = document.getElementById('favorites');

        next.addEventListener('click', function () {
            let currentIndex = Number(currentData.item.id) + 1;
            if (currentIndex >= dataLength) {
                currentIndex = 0
            }
            select(dataSize[currentIndex]);
            shuffleAll();
        });

        preview.addEventListener('click', function () {
            let currentIndex = Number(currentData.item.id) - 1;
            if (currentIndex < 0) {
                currentIndex = dataLength - 1
            }
            select(dataSize[currentIndex]);
            shuffleAll();
        });



    }


    return polaroidGallery;
})();

