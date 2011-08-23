# Dave's fork of Respond.js

### Firstly why
I found while working on a site the display of a part of the page wasn't quite the same in IE when using the original Respond.js. 
I was curious about why that was and did what any good lunatic would do and had a look in the JS.

The display issue was because I had media attribute on a link element, muh, read the documentation Dave :)

### Status: Ready for testing, so far so good

### Positive Notes
1. Link and style elements processed
2. Media attribute supported on link and style elements
3. ems and px supported
4. Using the respond.js script element several times in the head should work happily (more modular hopefully)
5. Still fast


### Notes
1. The cross domain part is new to me and therefore untested
2. The test folder hasn't been looked at either, the action is in the respond.src.js
3. A different AJAX code was used to aid testing in development with Firefox/Firebug. I was finding that only the last request of
a series was being reported successful
4. Because all CSS is being captured, not just max/min width media query blocks as in the original, there might be a slight performance
hit. When tested on a reasonably normal and complex page with an average-to-slowish Dell with XP the preformance felt just as good as the original, but measured slower in milliseconds on average.

### How the fork this version works
The CSS from all the linked stylesheets and style elements is captured and added to a 
single style element in source order. All CSS added to the single style element is wrapped in 
media query blocks - except for those already being media query blocks. Depending on the screen size the 
media query block queries are modified.

Additionally the following code was used to prevent some IE6 weirdness: Preventing The IE6 CSS Background Flicker: http://davidwalsh.name/preventing-css-background-flicker

### Caveats
1. Avoid having stylesheet link elements with an empty href (like anyone would anyway) it might mess with IE8.
2. "not" is ignored in queries, meaning whether a "not" is used or not the CSS will get applied (probably should change this)

### Changelog
13c 2011 August 23

1. "only" now handled. Previously Respondez-vous was failing the Respond.js test page by not showing green when it should have.
2. Commented out mqSupported = false, which I left in there accidentally.
3. Media attributes supported on link and style elements
4. ems non-dynamically supported (depends on html element having font-size:100% or left unchanged, works on update, however no adaption if text size is increased)


### Lastly...
A big thanks to Scott Jehl for his awesome script

# Original Respond.js documentation
### A fast & lightweight polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)

 - Copyright 2011: Scott Jehl, scottjehl.com
 - Dual licensed under the MIT or GPL Version 2 licenses. 
 
The goal of this script is to provide a fast and lightweight (3kb minified / 1kb gzipped) script to enable [responsive web designs](http://www.alistapart.com/articles/responsive-web-design/) in browsers that don't support CSS3 Media Queries - in particular, Internet Explorer 8 and under. It's written in such a way that it will probably patch support for other non-supporting browsers as well (more information on that soon).

If you're unfamiliar with the concepts surrounding Responsive Web Design, you can read up [here](http://www.alistapart.com/articles/responsive-web-design/) and also [here](http://filamentgroup.com/examples/responsive-images/)

[Demo page](http://scottjehl.github.com/Respond/test/test.html) (the colors change to show media queries working)


Usage Instructions
======

1. Craft your CSS with min/max-width media queries to adapt your layout from mobile (first) all the way up to desktop


<pre>
    @media screen and (min-width: 480px){
        ...styles for 480px and up go here
    }
</pre>

2. Reference the respond.min.js script (1kb min/gzipped) after all of your CSS

3. Crack open Internet Explorer and pump fists in delight


CDN/X-Domain Setup
======

Respond.js works by requesting a pristine copy of your CSS via AJAX, so if you host your stylesheets on a CDN (or a subdomain), you'll need to upload a proxy page to enable cross-domain communication.

See `cross-domain/example.html` for a demo:

- Upload `cross-domain/respond-proxy.html` to your external domain
- Upload `cross-domain/respond.proxy.gif` to your origin domain
- Reference the file(s) via `<link />` element(s):

<pre>
	&lt;!-- Respond.js proxy on external server --&gt;
	&lt;link href=&quot;http://externalcdn.com/respond-proxy.html&quot; id=&quot;respond-proxy&quot; rel=&quot;respond-proxy&quot; /&gt;
	
	&lt;!-- Respond.js redirect location on local server --&gt;
	&lt;link href=&quot;/path/to/respond.proxy.gif&quot; id=&quot;respond-redirect&quot; rel=&quot;respond-redirect&quot; /&gt;
	
	&lt;!-- Respond.js proxy script on local server --&gt;
	&lt;script src="/path/to/respond.proxy.js"&gt;&lt;/script&gt;
</pre>

Note: HUGE thanks to @doctyper for the contributions in the cross-domain proxy!


Support & Caveats
======

Some notes to keep in mind:

- This script's focus is purposely very narrow: only min-width and max-width media queries and all media types (screen, print, etc) are translated to non-supporting browsers. I wanted to keep things simple for filesize, maintenance, and performance, so I've intentionally limited support to queries that are essential to building a mobile-first responsive design. In the future, I may rework things a bit to include a hook for patching-in additional media query features - stay tuned!

- Browsers that natively support CSS3 Media Queries are opted-out of running this script as quickly as possible. In testing for support, I immediately pass browsers that support the window.matchMedia API (such as recent Chrome releases), and Internet Explorer 9+. All other browsers are subjected to a quick feature test to determine whether they support media queries or not before proceeding to run the script.

- This script relies on no other scripts or frameworks, and is optimized for mobile delivery (~1kb total filesize)

- As you might guess, this implementation is quite dumb in regards to CSS parsing rules. This is a good thing, because that allows it to run really fast, but it's looseness may also cause unexpected behavior. For example: if you enclose a whole media query in a comment intending to disable its rules, you'll probably find that those rules will end up enabled in non-media-query-supporting browsers.

- Respond.js doesn't parse CSS refrenced via @import, nor does it work with media queries within style elements, as those styles can't be re-requested for parsing.

- Due to security restrictions, some browsers may not allow this script to work on file:// urls (because it uses xmlHttpRequest). Run it on a web server.

- Currently, media attributes on link elements are supported, but only if the linked stylesheet contains no media queries. If it does contain queries, the media attribute will be ignored and the internal queries will be parsed normally.

- WARNING: Do not include @font-face rules inside a media query. This will crash IE7 and IE8. Simply place @font-face rules in the wide open, as a sibling to other media queries. Isolated test here to demostrate (note: test crashes IE 7&8): http://jsfiddle.net/scottjehl/Ejyj5/1/


How's it work?
======
Basically, the script loops through the CSS referenced in the page and runs a regular expression or two on their contents to find media queries and their associated blocks of CSS. Since at least in Internet Explorer, the content of the stylesheet is impossible to retrieve in its pre-parsed state (which in IE 8-, means its media queries are removed from the text), Respond.js re-requests the CSS files using Ajax and parses the text response from there. Be sure to configure your CSS files' caching properly so that this re-request doesn't actually go to the server.

From there, each query block is appended to the head in order via style elements, and those style elements are enabled and disabled (read: appended and removed from the DOM) depending on how their min/max width compares with the browser width. The media attribute on the style elements will match that of the query in the CSS, so it could be "screen", "projector", or whatever you want. Any relative paths contained in the CSS will be prefixed by their stylesheet's href, so image paths will direct to their proper destination

API Options?
======
Sure, a couple:

- respond.update() : rerun the parser (helpful if you added a stylesheet to the page and it needs to be translated)
- respond.mediaQueriesSupported: set to true if the browser natively supports media queries




Alternatives to this script
======
This isn't the only CSS3 Media Query polyfill script out there; but it damn well may be the fastest.

If you're looking for more robust CSS3 Media Query support, you might check out http://code.google.com/p/css3-mediaqueries-js/. In testing, I've found that script to be noticeably slow when rendering complex responsive designs (both in filesize and performance), but it really does support a lot more media query features than this script. Big hat tip to the authors! :)