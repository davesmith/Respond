//
// Dave Smith's fork of the excellent Respond.js polyfill by Scott Jehl
// http://github.com/davesmith/Respond
//
// Reasons for the fork
// The display of the page wasn't the same in IE when using the original Respond.js, 
// I was curious about why that was and rather than find the answer in the CSS I
// did what any lunatic would do and try something out.
//
// Main Changes
// 1. All CSS including from within style elements ripped, modified and added.
// 2. Different AJAX code used to aid testing with Firefox/Firebug as it was
// reporting only the last request of a series being successful.
// 3. Coded to be a bit more modular in that it should be possible to have
// <script src="respond.js"></script> several times and all to work well.
//
// Caveats
// 1. Avoid adding a link[rel=stylesheet] with an empty href. It might mess with IE8 and I couldn't be bothered to sort out IE's href property, which includes the current URL.
//
// Resources
// 1. http://www.quirksmode.org/bugreports/archives/2006/01/IE_wont_allow_documentcreateElementstyle.html
// 2. http://ejohn.org/blog/dom-documentfragments/
// 3. Preventing The IE6 CSS Background Flicker: http://davidwalsh.name/preventing-css-background-flicker

(function (win, mqSupported) {

    var respondSSLength = 0;
	
	mqSupported = false;
	
	// Is respond already existing?
	if (win.respond) {
		// If media queries are supported, exit here
		if (mqSupported) {
			return;
		}
		// Do update but not of any stylesheets already loaded.
		respond.update(true);
	}
	else {
		//exposed namespace
		win.respond = {};
		
		respond.account = [];
		
		//define update even in native-mq-supporting browsers, to avoid errors
		respond.update = function () {};
	
		//expose media query support flag for external use
		respond.mediaQueriesSupported = mqSupported;
		
		// If media queries are supported, exit here
		if (mqSupported) {
			return;
		}
		
		// Stop IE 6 from flickering a little and getting its knickers in a twist.
		try {
			document.execCommand('BackgroundImageCache', false, true);
		}
		catch(e) {}
	
		var doc = win.document,
			docElem = doc.documentElement,
			docHead = doc.getElementsByTagName('head')[0];

		// Removed Tweaked Ajax functions from Quirksmode
		//   While testing in Firebug Firefox, to see what was going on, 
		//   only the last request was working; requests before that were being aborted.
		// Tweaked Ajax functions from Jeremey Keith: http://bulletproofajax.com/tokyo/slides/02xhr.html
		//   One modification made to additionally check for no ActiveX support
		//   Two, added callback on failure.
		function getHTTPObject() {
			var xhr = false;
			if (window.XMLHttpRequest && !window.ActiveXObject) {
				xhr = new XMLHttpRequest();
			}
			else if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e) {
					try {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e) {
						xhr = false;
					}
				}
			}
			return xhr;
		}
		function grabFile(file, callback) {
			var request = getHTTPObject();
			if (request) {
				request.onreadystatechange = function() {
					if (request.readyState == 4) {
						if (request.status == 200 || request.status == 304) {
							callback(request.responseText);
						}
						else {
							callback(false);
						}
					}
				};
				request.open("GET", file, true);
				request.send(null);
			}
		}
		
		respond.stylesheets = [];
		
		respond.createCheckSum = function(n) {
			var rtn = n;
			if (n > 1) {
				rtn = 0;
				for (var i = 0; i <= n; i++) {
					rtn += i;
				}
			}
			return rtn;
		};
		respond.ajaxDone = function(i, respondAccountLength) {
			i++;
			var respondAccount = respond.account[respondAccountLength - 1];
			respondAccount.ajaxCount += i;
			if (respondAccount.ajaxCheckSum === respondAccount.ajaxCount) {
				applyMedia();
			}
		};
		
		// RESPOND.UPDATE
		// Expose update for re-running respond later on
		respond.update = function(avoidPreviouslyGotMedia) {
			respond.account.push({ajaxCount: 0, ajaxCheckSum: 0});
			var respondAccountLength = respond.account.length;
			
			avoidPreviouslyGotMedia = avoidPreviouslyGotMedia || false;
			var els = docHead.getElementsByTagName('*'),
				elsLength = els.length, i = 0, nodeName;
			var ss = [];
			for (; i < elsLength; i++) {
				nodeName = els[i].nodeName.toLowerCase();
				if ((nodeName == 'link' && els[i].rel.toLowerCase() == 'stylesheet' && els[i].href) || (nodeName == 'style' && els[i].id != 'respond-style-element')) {
					if (avoidPreviouslyGotMedia && !els[i].___respond) {
						ss[ss.length] = els[i];
						els[i].___respond = true;
					}
				}
			}
			i = 0;
			ssl = ss.length;
			if (ssl) {
				// Remove the current one if it exists.
				if (respond.element) {
					docHead.appendChild(respond.element.parentNode.removeChild(respond.element));
				}
				else {
					respond.element = doc.createElement('span');
					respond.element.id = 'respond-style';
					docHead.appendChild(respond.element);
				}
				respond.element = doc.getElementById(respond.element.id);
				
				var rssl = respondSSLength;
				respondSSLength += ssl;
				respond.account[respondAccountLength - 1].ajaxCheckSum = respond.createCheckSum(ssl);
				
				for (; i < ssl; i++) {
					if (ss[i].nodeName.toLowerCase() == 'link') {
						media = ss[i].media || undefined;
						(function(href, media, i) {
							grabFile(href, function(s) {
								if (s) {
									// Try to repair URLs.
									href = href.substring(0, href.lastIndexOf("/"));
									//if path exists, tack on trailing slash
									if (href.length) {
										href += "/";
									}
									s = s.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3");
									respond.stylesheets[rssl + i] = {css: s, media: media};
									respond.ajaxDone(i, respondAccountLength);
								}
								else {
									respond.ajaxDone(i, respondAccountLength);
								}
							});
						})(ss[i].href, media, i);
					}
					else {
						respond.stylesheets[rssl + i] = {css: ss[i].innerHTML, media: ss[i].media};
						respond.ajaxDone(i, respondAccountLength);
					}
				}
			}
		}
		// @media all and (min-width:500px) { … }
		// @media (min-width:500px) { … }
		// @media screen and (min-width: 400px) and (max-width: 700px)
		// @media handheld and (min-width: 20em), 
		//   screen and (min-width: 20em) { … }
		var processMediaQueryList = function(mql, currWidth) {
			return mql.replace(/\sand(.|\n)*\((max|min)\-width\s*:\s*(\d+)([a-zA-Z]+)\s*\)/gi, function(mtch, p1, p2, p3, p4, offset, str) {
				var rtn = mtch;
				if ((p2 === 'min' && currWidth >= p3) || (p2 === 'max' && currWidth <= p3)) {
					rtn = '';
				}
				return rtn;
			});
		};
		
		var applyMedia = function (undefined) {
			var name = "clientWidth",
				docElemProp = docElem[name],
				docBodyProp = (doc.body) ? doc.body[name] : undefined,
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || docBodyProp || docElemProp,
				ssl = respond.stylesheets.length,
				i = 0, j, cssText = '', mr, css
					now = (new Date()).getTime();
			if (ssl) {
				for (; i < ssl; i++) {
					if (respond.stylesheets[i]) {
						media = respond.stylesheets[i].media || '';
						css = respond.stylesheets[i].css;
						
						if (css) {
							// if it has media then we may want to add it to the styles
							if (/@media/g.test(css)) {
								j = 0;
								mediaQueryLists = css.split('@media');
								cssBeforeMediaQueryLists = mediaQueryLists.shift();
								mediaQueryListsLength = mediaQueryLists.length;
								// Go through each Media Query Block, which may have normal CSS at the end of each block.
								for (; j < mediaQueryListsLength; j++) {
									cssAfterMediaQueryList = mediaQueryLists[j].split('{');
									mediaQueryList = cssAfterMediaQueryList.shift();
									cssAfterMediaQueryList = cssAfterMediaQueryList.join('{');
									
									// Now we have the media query list and the block of everything after.
									cssAfterMediaQueryList = cssAfterMediaQueryList.replace(/\}[^\{]+\}/g, "}\n}\n@media " + 
									((media) ? processMediaQueryList(media, currWidth) : 'all')  + " {\n");
									
									mediaQueryLists[j] = processMediaQueryList(mediaQueryList, currWidth) +
										' {' + cssAfterMediaQueryList + "\n}\n";
								}
								text = "\n @media " +  ((media) ? processMediaQueryList(media, currWidth) : 'all') + 
								" { " + cssBeforeMediaQueryLists + " }\n@media" + mediaQueryLists.join('@media');
							}
							else {
								text = "\n @media " + ((media) ? processMediaQueryList(media, currWidth) : 'all') + " {\n" + css + "\n}";
							}
							cssText += text;
						}
					}
				}
			}
			respond.element = doc.getElementById(respond.element.id);
			if (ssl === respondSSLength) {
				respond.element.innerHTML = '_<style id="respond-style-element">' + cssText + '</style>';
			}
		};
		// End of applyMedia function
		
		
		// Get things started.
		respond.update(true);
	
		function callMedia() {
			if (win.removeEventListener) {
				win.removeEventListener("resize", callMedia, false);
			}
			else if (win.detachEvent) {
				win.detachEvent("onresize", callMedia);
			}
			applyMedia(true);
			if (win.addEventListener) {
				win.addEventListener("resize", callMedia, false);
			}
			else if (win.attachEvent) {
				win.attachEvent("onresize", callMedia);
			}
		}
		if (win.addEventListener) {
			win.addEventListener("resize", callMedia, false);
		}
		else if (win.attachEvent) {
			win.attachEvent("onresize", callMedia);
		}
	}
})(
this, (function (win) {

    //for speed, flag browsers with window.matchMedia support and IE 9 as supported
    if (win.matchMedia) {
        return true;
    }

    var bool, doc = document,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeUsed = !doc.body,
        fakeBody = doc.body || doc.createElement("body"),
        div = doc.createElement("div"),
        q = "only all";

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-99em";
    fakeBody.appendChild(div);

    div.innerHTML = '_<style media="' + q + '"> #mq-test-1 { width: 9px; }</style>';
    if (fakeUsed) {
        docElem.insertBefore(fakeBody, refNode);
    }
    div.removeChild(div.firstChild);
    bool = div.offsetWidth == 9;
    if (fakeUsed) {
        docElem.removeChild(fakeBody);
    } else {
        fakeBody.removeChild(div);
    }
    return bool;
})(this));
