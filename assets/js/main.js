var body = document.body;

document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    subMenu();
	featurednavigation();
    pagination();
	video();
    gallery();
    table();
    burger();
});

function featurednavigation() {
	'use strict';
	let snext = document.getElementById('scroll-next');
	let sprev = document.getElementById('scroll-prev');

	if (snext) {
		snext.onclick = function () {
			document.getElementById('feat-feed').scrollLeft += 500;
		}
	}

	if (sprev) {
		sprev.onclick = function () {
			document.getElementById('feat-feed').scrollLeft += -500;
		}
	}
}

function subMenu() {
    'use strict';
    var nav = document.querySelector('.main-nav');
    var items = nav.querySelectorAll('.menu-item');

    function getSiblings(el, filter) {
        var siblings = [];
        while (el= el.nextSibling) { if (!filter || filter(el)) siblings.push(el); }
        return siblings;
    }

    function exampleFilter(el) {
        return el.nodeName.toLowerCase() == 'a';
    }

    if (items.length > 5) {
        var separator = items[4];

        var toggle = document.createElement('button');
        toggle.setAttribute('class', 'button-icon menu-item-button menu-item-more');
        toggle.setAttribute('aria-label', 'More');
        toggle.innerHTML = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'sub-menu');

        var children = getSiblings(separator, exampleFilter);

        children.forEach(function (child) {
            wrapper.appendChild(child);
        });

        toggle.appendChild(wrapper);
        separator.parentNode.appendChild(toggle);

        toggle.addEventListener('click', function () {
            if (window.getComputedStyle(wrapper).display == 'none') {
                wrapper.style.display = 'block';
                wrapper.classList.add('animate__animated', 'animate__bounceIn');
            } else {
                wrapper.classList.add('animate__animated', 'animate__zoomOut');
            }
        });

        wrapper.addEventListener('animationend', function (e) {
            wrapper.classList.remove('animate__animated', 'animate__bounceIn', 'animate__zoomOut');
            if (e.animationName == 'zoomOut') {
                wrapper.style.display = 'none';
            }
        });
    }
}

function pagination() {
    'use strict';

    if (body.classList.contains('paged-next')) {
        let infScroll = new InfiniteScroll( '.post-feed', {
            append: '.feed',
            button: '.infinite-scroll-button',
            debug: false,
            hideNav: '.pagination',
            history: false,
            path: '.pagination .older-posts',
            scrollThreshold: false,
            status: '.infinite-scroll-status',
        });

		infScroll.on( 'append', function ( body, path, items, response ) {
			items[0].classList.add('feed-paged');
		});
    }
}

function video() {
    'use strict';
 	reframe(document.querySelectorAll('.single-content iframe[src*="www.youtube.com"], .single-content iframe[src*="youtube.com"], .single-content iframe[src*="youtube-nocookie.com"], .single-content iframe[src*="player.vimeo.com"]'));
}

function gallery() {
    'use strict';
    let images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        let container = image.closest('.kg-gallery-image');
        let width = image.attributes.width.value;
        let height = image.attributes.height.value;
        let ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });

    pswp(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );
}

function table() {
    'use strict';
    if (!body.classList.contains('post-template') && !body.classList.contains('page-template')) return;

    let tables = document.querySelectorAll('.single-content .table');

    tables.forEach(function (table) {
        let labels = [];

        table.querySelectorAll('thead th').forEach(function (label) {
            labels.push(label.textContent);
        });

        table.querySelectorAll('tr').forEach(function (row) {
            row.querySelectorAll('td').forEach(function (column, index) {
                column.setAttribute('data-label', labels[index]);
            });
        });
    });
}

function burger() {
    'use strict';
    document.querySelector('.burger').addEventListener('click', function () {
        body.classList.toggle('menu-opened');
    });
}

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        el
            .querySelectorAll(element)
            .forEach(function (v) {
                gridEl = v;
                linkEl = gridEl.querySelector(trigger);

                item = {
                    src: isGallery
                        ? gridEl.querySelector('img').getAttribute('src')
                        : linkEl.getAttribute('href'),
                    w: 0,
                    h: 0,
                };

                if (caption && gridEl.querySelector(caption)) {
                    item.title = gridEl.querySelector(caption).innerHTML;
                }

                items.push(item);
            });

        return items;
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
        };

        gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (index, item) {
            if (item.w < 1 || item.h < 1) {
                // unknown size
                var img = new Image();
                img.onload = function () {
                    // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        gallery.init();
    };

    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var siblings = e.target.closest(container).querySelectorAll(element);
        var nodes = Array.prototype.slice.call(siblings);
        var index = nodes.indexOf(e.target.closest(element));
        var clickedGallery = e.target.closest(container);

        openPhotoSwipe(index, clickedGallery);

        return false;
    };

    // container = document.querySelector(container);
    // if (!container) return;

    var triggers = document.querySelectorAll(trigger);
    triggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}
