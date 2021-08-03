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
    theme();
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

	function getNextSiblings(elem) {
        let sibs = [];
        let nextElem = elem.parentNode.firstChild;
        do {
            if (nextElem.nodeType === 3) continue; // ignore text nodes
            if (nextElem === elem) continue; // ignore elem of target
            if (nextElem === elem.nextElementSibling) {
                sibs.push(nextElem);
                elem = nextElem;
            }
        } while(nextElem = nextElem.nextSibling)
        return sibs;
    }

	// Wrap wrapper around nodes
	// Just pass a collection of nodes, and a wrapper element
	function wrapme(nodes, wrapper) {
		// Cache the current parent and previous sibling of the first node.
		let parent = nodes[0].parentNode;
		let previousSibling = nodes[0].previousSibling;

		// Place each node in wrapper.
		//  - If nodes is an array, we must increment the index we grab from 
		//    after each loop.
		//  - If nodes is a NodeList, each node is automatically removed from 
		//    the NodeList when it is removed from its parent with appendChild.
		for (var i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
			wrapper.appendChild(nodes[i]);
		}

		// Place the wrapper just after the cached previousSibling,
		// or if that is null, just before the first child.
		let nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
		parent.insertBefore(wrapper, nextSibling);

		return wrapper;
	}

    let mainNav = document.querySelector('.main-nav');
    let separator = document.querySelector('.menu-item[href*="..."]');

    if (separator) {
		let nextsibs = getNextSiblings(separator);
		let div = document.createElement('div');
		div.classList.add('sub-menu');

		wrapme(nextsibs, div);

		let repuse = document.createElementNS("http://www.w3.org/2000/svg", "use");
		let repsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		let repbut = document.createElement("button");

		repuse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#dots-horizontal');
		repsvg.classList.add('icon');
		repbut.classList.add('button-icon', 'menu-item-button', 'menu-item-more');
		repbut.setAttribute('aria-label', 'More');

        separator.replaceWith(repbut);
		repbut.append(repsvg);
		repsvg.append(repuse);

        let toggle = document.querySelector('.menu-item-more');
        let subMenu = document.querySelector('.sub-menu');
        toggle.append(subMenu);

        toggle.addEventListener('click', function () {
            if (subMenu.offsetWidth === 0 && subMenu.offsetHeight === 0) {
				subMenu.style.display = 'inline';
                subMenu.classList.add('animate__animated', 'animate__bounceIn');
            } else {
                subMenu.classList.add('animate__animated', 'animate__zoomOut');
            }
        });

        subMenu.addEventListener('animationend', function (e) {
            subMenu.classList.remove(
                'animate__animated', 'animate__bounceIn', 'animate__zoomOut'
            );
            if (e.animationName == 'zoomOut') {
                subMenu.style.display = 'none';
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

function theme() {
    'use strict';
    let toggle = document.querySelector('.js-theme');
    let toggleText = toggle.querySelector('.theme-text');

    function system() {
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        localStorage.removeItem('dawn_theme');
        toggleText.textContent = toggle.getAttribute('data-system');
    }

    function dark() {
        document.documentElement.classList.remove('theme-light');
		document.documentElement.classList.add('theme-dark');
        localStorage.setItem('dawn_theme', 'dark');
        toggleText.textContent = toggle.getAttribute('data-dark');
    }

    function light() {
        document.documentElement.classList.remove('theme-dark');
		document.documentElement.classList.add('theme-light');
        localStorage.setItem('dawn_theme', 'light');
        toggleText.textContent = toggle.getAttribute('data-light');
    }

    switch (localStorage.getItem('dawn_theme')) {
        case 'dark':
            dark();
            break;
        case 'light':
            light();
            break;
        default:
            system();
            break;
    }

    toggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (!document.documentElement.classList.contains('theme-dark') && !document.documentElement.classList.contains('theme-light')) {
            dark();
        } else if (document.documentElement.classList.contains('theme-dark')) {
            light();
        } else {
            system();
        }
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
