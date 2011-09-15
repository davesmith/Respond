/*! Dave Smith's fork of Respond.js 14: github.com/davesmith/respondjs  */

//var ttt = '';

(function (win, mqSupported) {

    var respondezVousStyleSheetLength = 0;
    
    //mqSupported = false; // Only uncomment for testing on media query enabled browsers.
	
	var respondezVous = 'respondezVous',
	Stylesheets = 'b',
	StyleElement = 'c',
	Account = 'd',
	Update = 'e',
	AjaxDone = 'f',
	AjaxCheckSum = 'g',
	CreateCheckSum = 'h',
	AjaxCount = 'i',
	MediaQueryList = 'j',
	MediaQueryList1 = 'k',
	MediaQueryLists = 'l',
	CSS = 'm',
    removeEventListenerString = 'removeEventListener',
    addEventListenerString = 'addEventListener',
    styleString = 'style',
    resizeString = 'resize',
    allString = 'all',
	___respondezVous = '___' + respondezVous,
	respondezVousStyleElementID = respondezVous + '-' + styleString + '-element',
	RESPONDEZVOUSRESPONDEZVOUSRESPONDEZVOUS = respondezVous + respondezVous + respondezVous;
	
	// Is respondezVous already existing?
	if (win[respondezVous]) {
		// If media queries are supported, exit here
		if (mqSupported) {
			return;
		}
		// Do update but not of any stylesheets already loaded.
		win[respondezVous][Update](true);
	}
	else {
		//exposed namespace
		win[respondezVous] = {};
		
		
		win[respondezVous][Account] = [];
		
		//define update even in native-mq-supporting browsers, to avoid errors
		win[respondezVous][Update] = function () {};
	
		//expose media query support flag for external use
		win[respondezVous].mediaQueriesSupported = mqSupported;
		
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
			
		// Get the default font-size.
		var pixelsPerEm = (win.getComputedStyle) ? Number(getComputedStyle(docElem, '').fontSize.match(/(\d+)px/)[1]) : 16;
		// I tried currentStyle but if the html element is set with font-size:100% then 100% is returned, which can't be used.
		// For the most part it would appear 16px is the base font-size. If a browser is cleverer than that then it may also use getComputedStyle.

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
		// AJAX grabfile
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
		
		// Stylesheet store array.
		win[respondezVous][Stylesheets] = [];
		
		// AJAX helper function
		win[respondezVous][CreateCheckSum] = function(n) {
			var rtn = n;
			if (n > 1) {
				rtn = 0;
				for (var i = 0; i <= n; i++) {
					rtn += i;
				}
			}
			return rtn;
		};
		// AJAX done function.
		win[respondezVous][AjaxDone] = function(i, respondezVousAccountLength) {
			i++;
			var respondezVousAccount = win[respondezVous][Account][respondezVousAccountLength - 1];
			respondezVousAccount[AjaxCount] += i;
			if (respondezVousAccount[AjaxCheckSum] === respondezVousAccount[AjaxCount]) {
				prepareMedia();
			}
		};
		
		// Update
		win[respondezVous][Update] = function(avoidPreviouslyGotMedia) {
			
			var newAccount = {},
				respondezVousAccountLength,
				styleSheetArray = [],
				styleSheetArrayLength,
				styleSheetMediaValue;
			
			newAccount[AjaxCheckSum] = 0;
			newAccount[AjaxCount] = 0;
			win[respondezVous][Account].push(newAccount);
			
			respondezVousAccountLength = win[respondezVous][Account].length;
			
			avoidPreviouslyGotMedia = avoidPreviouslyGotMedia || false;
			
			// Go through all elements in the head and add new stylesheets to a stylesheet array called ss.
			var els = docHead.getElementsByTagName('*'),
				elsLength = els.length, i = 0, nodeName;

			for (; i < elsLength; i++) {
				nodeName = els[i].nodeName.toLowerCase();
				if ((nodeName == 'link' && els[i].rel.toLowerCase() == styleString + 'sheet' && els[i].href) || (nodeName == styleString && els[i].id != respondezVousStyleElementID)) {
					if (avoidPreviouslyGotMedia && !els[i][___respondezVous]) {
						els[i][___respondezVous] = true;
						styleSheetArray[styleSheetArray.length] = els[i];
					}
				}
			}
			i = 0;
			styleSheetArrayLength = styleSheetArray.length;
			if (styleSheetArrayLength) {
				// Move the current Respond Style Element if it exists. Otherwise create it.
				if (win[respondezVous][StyleElement]) {
					docHead.appendChild(win[respondezVous][StyleElement].parentNode.removeChild(win[respondezVous][StyleElement]));
				}
				else {
					win[respondezVous][StyleElement] = doc.createElement('span');
					win[respondezVous][StyleElement].id = respondezVousStyleElementID;
					docHead.appendChild(win[respondezVous][StyleElement]);
				}
				// Reference the Respond Style Element.
				win[respondezVous][StyleElement] = doc.getElementById(respondezVousStyleElementID);
				
				var rssl = respondezVousStyleSheetLength;
				respondezVousStyleSheetLength += styleSheetArrayLength;
				win[respondezVous][Account][respondezVousAccountLength - 1][AjaxCheckSum] = win[respondezVous][CreateCheckSum](styleSheetArrayLength);
				
				// Go through each new stylesheet (that were added since the last update).
				// Grab each link element stylesheet via AJAX. When AJAX complete, the Apply Media function is called. 
				for (; i < styleSheetArrayLength; i++) {
					// Handle Link elements.
					if (styleSheetArray[i].nodeName.toLowerCase() == 'link') {
						styleSheetMediaValue = styleSheetArray[i].media || '';
						(function(href, styleSheetMediaValue, i) {
							grabFile(href, function(s) {
								if (s) {
									// Try to repair URLs.
									href = href.substring(0, href.lastIndexOf("/"));
									//if path exists, tack on trailing slash
									if (href.length) {
										href += "/";
									}
									s = s.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3");
									win[respondezVous][Stylesheets][rssl + i] = {css: s, media: styleSheetMediaValue};
									win[respondezVous][AjaxDone](i, respondezVousAccountLength);
								}
								else {
									win[respondezVous][AjaxDone](i, respondezVousAccountLength);
								}
							});
						})(styleSheetArray[i].href, styleSheetMediaValue, i);
					}
					// Handle Style elements.
					else {
						win[respondezVous][Stylesheets][rssl + i] = {css: styleSheetArray[i].innerHTML, media: styleSheetArray[i].media || ''};
						win[respondezVous][AjaxDone](i, respondezVousAccountLength);
					}
				}
			}
		}
		// @media all and (min-width:500px) { … }
		// @media (min-width:500px) { … }
		// @media screen and (min-width: 400px) and (max-width: 700px)
		// @media handheld and (min-width: 20em), 
		//   screen and (min-width: 20em) { … }
		
		var respondezVousMediaQueryBlocks = [];
		var respondezVousQueries = {};
		
		// Prepare Media Query Lists.
		var prepareMediaQueryLists = function(mediaQueryLists) {

			var rtn = [],
				infinity = Number.POSITIVE_INFINITY,
				mediaQueryList,
				mediaQueriesLength,
				mediaQuery,
				mediaQueries,
				mediaQueriesLength,
				mediaType,
				mediaTypeMatch,
				lte,
				lteMatch,
				lteMatchLength,
				gte,
				gteMatch,
				gteMatchLength,
				regexpr;
			
			for (var i = 0; i < mediaQueryLists.length; i++) {
			
				mediaQueryList = mediaQueryLists[i];
				rtn.push([]);
				rtn2 = rtn[rtn.length - 1];
			
				if (!mediaQueryList || mediaQueryList === '') {
					//respondezVousQueries['all_gte_0_lte_' + infinity] = {mediaType:allString, gte:0, lte:infinity};
					//rtn2.push(respondezVousQueries['all_gte_0_lte_' + infinity]);
					rtn2.push({mediaType:allString, gte:0, lte:infinity});
				}
				else {
					// Split the media query list into individual media queries.
					mediaQueries = mediaQueryList.split(',');
					mediaQueriesLength = mediaQueries.length;
					
					for (var j = 0; j < mediaQueriesLength; j++) {
						
						mediaQuery = mediaQueries[j];
						
						mediaQuery = mediaQuery.replace(/and|only|not/g, '');
						
						mediaType = allString;
						mediaTypeMatch = mediaQuery.match(/[\s\n]*(\w+)[\s\n]*/);
						if (mediaTypeMatch) {
							mediaType = mediaTypeMatch[1];
						}
						
						regexpr = /[\s\n]*:[\s\n]*(\d+)([^)]+)/;
						
						lte = infinity;
						lteMatch = mediaQuery.split('max-width');
						lteMatchLength = lteMatch.length;
						if (lteMatchLength > 1) {
							lteMatch = lteMatch[lteMatchLength - 1].match(regexpr);
							if (lteMatch[2] === 'em') {
								lte = lteMatch[1] * pixelsPerEm;
							}
							else {
								lte = lteMatch[1];
							}
						}
						gte = 0;
						gteMatch = mediaQuery.split('min-width');
						gteMatchLength = gteMatch.length;
						if (gteMatchLength > 1) {
							gteMatch = gteMatch[gteMatchLength - 1].match(regexpr);
							if (gteMatch[2] === 'em') {
								gte = gteMatch[1] * pixelsPerEm;
							}
							else {
								gte = gteMatch[1];
							}
						}
						
						//respondezVousQueries[mediaType + '_gte_' + gte + '_lte_' + lte] = {mediaType:mediaType, gte:gte, lte:lte};
						//rtn2.push(respondezVousQueries[mediaType + '_gte_' + gte + '_lte_' + lte]);
						rtn2.push({mediaType:mediaType, gte:gte, lte:lte});
					}
				}
			}

			return rtn;
			
		};
		
		// Add Media Query Block function
		var addMediaQueryBlock = function(respondezVousStyleSheetMediaValue, css, mediaQueryList) {
			var newMediaQueryBlock = {};
			newMediaQueryBlock[MediaQueryList] = mediaQueryList;
			newMediaQueryBlock[MediaQueryList1] = respondezVousStyleSheetMediaValue || '';
			newMediaQueryBlock[MediaQueryLists] = prepareMediaQueryLists([respondezVousStyleSheetMediaValue || '', mediaQueryList]);
			newMediaQueryBlock[CSS] = css;
			var length = respondezVousMediaQueryBlocks.push(newMediaQueryBlock);
		};
		
		// Prepare Media function.
		var prepareMedia = function(undefined) {
			var rssl = win[respondezVous][Stylesheets].length,
				i = 0,
				j = 0,
				css,
				respondezVousStyleSheet,
				respondezVousStyleSheetMediaValue,
				cssSplitAtMediaArray,
				cssBeforeFirstAtMedia,
				cssSplitAtMediaArrayLength,
				cssAfterMediaQueryList,
				mediaQueryList,
				cssAfterMediaQueryListSplit,
				cssAfterMediaQueryBlock;
			
			// Go through each Respond stylesheet.
			for (; i < rssl; i++) {
				
				respondezVousStyleSheet = win[respondezVous][Stylesheets][i];
				
				css = respondezVousStyleSheet.css;
				respondezVousStyleSheetMediaValue = respondezVousStyleSheet.media;
				
				// Split the CSS into media query blocks.						
				if (css) {
					j = 0;
					
					cssSplitAtMediaArray = css.split('@media');
					
					// Find the CSS before the first media query block and add to the Media Query Blocks Array.
					cssBeforeFirstAtMedia = cssSplitAtMediaArray.shift().replace(/^\s+|\s+$/g, '');
					cssSplitAtMediaArrayLength = cssSplitAtMediaArray.length;
					
					if (cssBeforeFirstAtMedia !== '') {
						addMediaQueryBlock(respondezVousStyleSheetMediaValue, cssBeforeFirstAtMedia);
					}
					
					// Go through each Media Query Block, keeping in mind that there may be non Media Query Block CSS appended.
					// e.g. @media queries { Media Query Block CSS } Non Media Query Block CSS here.
					for (; j < cssSplitAtMediaArrayLength; j++) {
						
						// Get the block's Media Query List and the CSS after.
						cssAfterMediaQueryList = cssSplitAtMediaArray[j].split('{');
						mediaQueryList = cssAfterMediaQueryList.shift();
						cssAfterMediaQueryList = cssAfterMediaQueryList.join('{');
						
						// Find the CSS after the media query block and add to the Media Query Blocks Array.
						cssAfterMediaQueryList = cssAfterMediaQueryList.replace(/\}[^\{]+\}/g, "}\n"+RESPONDEZVOUSRESPONDEZVOUSRESPONDEZVOUS);
						cssAfterMediaQueryListSplit = cssAfterMediaQueryList.split(RESPONDEZVOUSRESPONDEZVOUSRESPONDEZVOUS);						
						css = cssAfterMediaQueryListSplit.shift();
						cssAfterMediaQueryBlock = cssAfterMediaQueryListSplit.join(RESPONDEZVOUSRESPONDEZVOUSRESPONDEZVOUS).replace(/^\s+|\s+$/g, '');
						addMediaQueryBlock(respondezVousStyleSheetMediaValue, css, mediaQueryList);
						if (cssAfterMediaQueryBlock) {
							addMediaQueryBlock(respondezVousStyleSheetMediaValue, cssAfterMediaQueryBlock);
						}
					}
				}
			}
			/** /
			for (i = 0; i < respondezVousMediaQueryBlocks.length; i++) {
				var block = respondezVousMediaQueryBlocks[i];
				mediaQueryLists = block[MediaQueryLists];
				mediaQueryListsLength = mediaQueryLists.length;
				for (j = 0; j < mediaQueryListsLength; j++) {
					var queries = mediaQueryLists[j];
					queriesLength = queries.length;
					for (k = 0; k < queriesLength; k++) {
						query = queries[k];
						ttt += '{'+query.mediaType + '===gte=' + query.gte + '===lte=' + query.lte+'}'+'<br />';
					}
					ttt += '---<br/ >';
				}
				ttt += "\t"+block[CSS]+'<br />=================<br />';
			}
			/**/
			applyMedia();
		};
		
		// Apply Media function.
		var applyMedia = function (undefined) {
			var name = "clientWidth",
				docElemProp = docElem[name],
				docBodyProp = (doc.body) ? doc.body[name] : undefined,
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || docBodyProp || docElemProp,
				ssl = win[respondezVous][Stylesheets].length,
				block,
				mediaQueryList,
				query,
				query2,
				i = 0,
				j,
				cssText = '',
				now = (new Date()).getTime(),
				respondezVousMediaQueryBlocksLength = respondezVousMediaQueryBlocks.length,
				blockmediaQueryLists0,
				blockmediaQueryLists1,
				blockmediaQueryLists0Length,
				blockmediaQueryLists1Length;
			
			for (i = 0; i < respondezVousMediaQueryBlocksLength; i++) {
				
				mediaQueryList = '';
				
				block = respondezVousMediaQueryBlocks[i]; // = {mediaQueryList, mediaQueryLists, css}
				
				blockmediaQueryLists0 = block[MediaQueryLists][0] || [];
				blockmediaQueryLists1 = block[MediaQueryLists][1] || [];
				blockmediaQueryLists0Length = blockmediaQueryLists0.length;
				blockmediaQueryLists1Length = blockmediaQueryLists1.length;
				
				for (j = 0; j < blockmediaQueryLists0Length; j++) {
					
					query = blockmediaQueryLists0[j];
					
					if (query.gte <= currWidth && currWidth <= query.lte) {
						
						if (blockmediaQueryLists1Length) {
							
							for (k = 0; k < blockmediaQueryLists1Length; k++) {
								
								query2 = blockmediaQueryLists1[k];
								
								if (query.mediaType === query2.mediaType || query2.mediaType === allString || query.mediaType === allString) {
									
									if (query2.gte <= currWidth && currWidth <= query2.lte) {
										
										if (query.mediaType === allString) {
											mediaQueryList += ', ' + query2.mediaType;
										}
										else {
											mediaQueryList += ', ' + query.mediaType;
										}
									}
								}
							}
						}
						else {
							mediaQueryList += ', ' + query.mediaType;
						}
					}
				}
				if (mediaQueryList === '') {
					mediaQueryList = ' ' + (block[MediaQueryList] || block[MediaQueryList1]);
				}
				else {
					mediaQueryList = ' ' + mediaQueryList.substr(1);
				}
				cssText += '@media ' + mediaQueryList + ' {' + block[CSS] + "\n" + '}' + "\n\n";
			}
			/*
			var output = document.getElementById('output');
			if (output && output.innerHTML) {
				ttt = pixelsPerEm;
				output.innerHTML = '<pre>'+ttt+'<br /><br />'+cssText+'</pre>';
			}
			*/
			win[respondezVous][StyleElement] = doc.getElementById(respondezVousStyleElementID);
			if (ssl === respondezVousStyleSheetLength) {
				win[respondezVous][StyleElement].innerHTML = '_<' + styleString + ' id="' + respondezVousStyleElementID + '">' + cssText + '</' + styleString + '>';
			}
		};
		// End of applyMedia function
		
		
		// Get things started.
		win[respondezVous][Update](true);
	
		function callMedia() {
			if (win[removeEventListenerString]) {
				win[removeEventListenerString](resizeString, callMedia, false);
			}
			else if (win.detachEvent) {
				win.detachEvent("on" + resizeString, callMedia);
			}
			applyMedia(true);
			if (win[addEventListenerString]) {
				win[addEventListenerString](resizeString, callMedia, false);
			}
			else if (win.attachEvent) {
				win.attachEvent("on" + resizeString, callMedia);
			}
		}
		if (win[addEventListenerString]) {
			win[addEventListenerString](resizeString, callMedia, false);
		}
		else if (win.attachEvent) {
			win.attachEvent("on" + resizeString, callMedia);
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
        q = "only all",
		styleString = 'style';

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-99em";
    fakeBody.appendChild(div);

    div.innerHTML = '_<' + styleString + ' media="' + q + '"> #mq-test-1 { width: 9px; }</' + styleString + '>';
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


/*
window.onload = function() {
	setTimeout(function() {
		var el = document.getElementById('output');
		if (el) {
			el.innerHTML = ttt;
		}
	}, 1000);
};
*/