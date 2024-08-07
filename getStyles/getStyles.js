const getStylesCSS = document.createElement("link");
getStylesCSS.rel = "stylesheet";
getStylesCSS.href = "/getStyles/getStyles.css";
document.head.appendChild(getStylesCSS);

let breakpoints = {
	mobile: 2,
	sm: 540,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536,
};

const classesElements = [];
const classes = [];
const smClasses = [];
const mdClasses = [];
const lgClasses = [];
const xlClasses = [];
const xxlClasses = [];
let currentBreakpoint = null;
let activeBPIndex;
let windowWidth;
let cssFile;
let cssText;
let cssBlocks;
const classPrefixes = ["sm", "md", "lg", "xl", "xxl"];
let containerStyles;

function typewriterOnLoad(element, variationArray) {
	function typeText(index) {
		if (index < variationArray.length) {
			element.text("");
			const variationInLetters = variationArray[index].split("");
			displayLetters(0);
			function displayLetters(j) {
				if (j < variationInLetters.length) {
					setTimeout(() => {
						element.text(element.text() + variationInLetters[j]);
						displayLetters(j + 1);
					}, 100);
				} else {
					setTimeout(
						() => typeText((index + 1) % variationArray.length),
						1000,
					);
				}
			}
		}
	}
	typeText(0);
}
function typewriterOnHover(element, variationArray) {
	let hover = false;
	function typeText(index) {
		if (index < variationArray.length && hover) {
			element.text("");
			const variationInLetters = variationArray[index].split("");
			displayLetters(0);
			function displayLetters(j) {
				if (j < variationInLetters.length && hover) {
					setTimeout(() => {
						element.text(element.text() + variationInLetters[j]);
						displayLetters(j + 1);
					}, 200);
				} else if (hover) {
					setTimeout(
						() => typeText((index + 1) % variationArray.length),
						1000,
					);
				}
			}
		}
	}
	element.mouseenter(function () {
		hover = true;
		typeText(1);
	});
	element.mouseleave(function () {
		hover = false;
		setTimeout(() => {
			element.text("");
			element.text(variationArray[0]);
		}, 200);
	});
}
function typewriterOnClick(element, variationArray) {
	let hover = false;
	function typeText(index) {
		if (index < variationArray.length && hover) {
			element.text("");
			const variationInLetters = variationArray[index].split("");
			displayLetters(0);
			function displayLetters(j) {
				if (j < variationInLetters.length && hover) {
					setTimeout(() => {
						element.text(element.text() + variationInLetters[j]);
						displayLetters(j + 1);
					}, 200);
				} else if (hover) {
					setTimeout(
						() => typeText((index + 1) % variationArray.length),
						1000,
					);
				}
			}
		}
	}
	element.click(function () {
		if (hover) {
			hover = false;
			setTimeout(() => {
				element.text("");
				element.text(variationArray[0]);
			}, 200);
		} else {
			hover = true;
			typeText(1);
			console.log("click");
		}
	});
}
function typewriterOnScroll(element, variationArray) {
	const entryPoint = $(window).height();
	const exitPoint = $("header").outerHeight(true) + element.outerHeight(true);
	const elementHeight = element.outerHeight(true);
	$(window).scroll(function () {
		write();
	});
	function write() {
		const elementTop = element.offset().top - $(window).scrollTop();
		const variationInLetters = variationArray[0].split("");
		const length = variationInLetters.length;
		if (
			elementTop <= entryPoint - elementHeight &&
			elementTop >= exitPoint
		) {
			const percentageInView =
				1 -
				Math.round(
					((elementTop - exitPoint) / (entryPoint - exitPoint)) *
						10000,
				) /
					10000;
			const lettersToShow = Math.round(percentageInView * length);
			element.text("");
			for (let i = 0; i < lettersToShow; i++) {
				element.text(element.text() + variationInLetters[i]);
			}
		}
	}
	write();
}
function typewriterOnVisible(element, variationArray) {}

$(document).ready(async function () {
	AOS.init();
	cssFile = await fetch("/getStyles/getStyles.css");
	cssText = await cssFile.text();
	cssBlocks = cssText.split("}");
	// await loadAll();
	await checkBreakpoints();
	await getClasses();
	await getBreakpoint();
	// check if any element has effect attribute
	const effectList = [];
	$("*").each(function () {
		if ($(this).attr("effectJS") !== undefined) {
			effectList.push($(this));
		}
	});
	if (effectList.length !== 0) {
		// console.log(effectList);
		effectList.forEach((element) => {
			const effectName = element.attr("effectJS").toLowerCase();
			element.css("min-height", element.outerHeight(true) + "px");
			if (effectName === "typewriter") {
				const startAt = element.attr("startAt") || "load";
				const variation = element.attr("variation") || element.text();
				const variationArray = [];
				if (variation.includes(";")) {
					variationArray.push(
						...variation.split(";").map((str) => str.trim()),
					);
				} else {
					variationArray.push(element.text());
				}
				if (startAt === "load") {
					typewriterOnLoad(element, variationArray);
				} else if (startAt === "hover") {
					typewriterOnHover(element, variationArray);
				} else if (startAt === "click") {
					typewriterOnClick(element, variationArray);
				} else if (startAt === "scroll") {
					variationArray.length = 0;
					variationArray.push(element.text());
					typewriterOnScroll(element, variationArray);
				} else if (startAt === "visible") {
					typewriterOnVisible(element, variationArray);
				}
			} else if (effectName === "increment") {
				const limitStart = parseInt(element.attr("limitStart")) || 0;
				const limitEnd = parseInt(element.attr("limitEnd"));
				function increment() {
					const duration = 3000;
					const steps = Math.abs(limitEnd - limitStart);
					const interval = duration / steps;
					let currentValue = limitStart;
					if (isNaN(limitEnd)) {
						console.error(
							"Invalid limitEnd:",
							element.attr("limitEnd"),
						);
						return;
					}
					const incrementValue = limitStart < limitEnd ? 1 : -1;
					const intervalId = setInterval(() => {
						currentValue += incrementValue;
						element.text(Math.round(currentValue));
						if (
							(limitStart < limitEnd &&
								currentValue >= limitEnd) ||
							(limitStart > limitEnd && currentValue <= limitEnd)
						) {
							element.text(limitEnd);
							clearInterval(intervalId);
						}
					}, interval);
				}
				increment();
			}
		});
	}
});

async function checkBreakpoints() {
	const metaTag = document.querySelector("meta[name=getStyles]");
	if (metaTag && metaTag.getAttribute("sm") !== "") {
		breakpoints.sm = Number(metaTag.getAttribute("sm"));
	}
	if (metaTag && metaTag.getAttribute("md") !== "") {
		breakpoints.md = Number(metaTag.getAttribute("md"));
	}
	if (metaTag && metaTag.getAttribute("lg") !== "") {
		breakpoints.lg = Number(metaTag.getAttribute("lg"));
	}
	if (metaTag && metaTag.getAttribute("xl") !== "") {
		breakpoints.xl = Number(metaTag.getAttribute("xl"));
	}
	if (metaTag && metaTag.getAttribute("xxl") !== "") {
		breakpoints.xxl = Number(metaTag.getAttribute("xxl"));
	}
	const containerClassStyle = `@media (min-width: ${breakpoints.sm}px) {
		:root {
			font-size: 16px;
		}
		.container {
			margin-inline: calc((100vw - ${breakpoints.sm}px) / 2);
		}
		.container-fluid {
			padding-inline: calc((100vw - ${breakpoints.sm}px) / 2);
		}
	}
	
	@media (min-width: ${breakpoints.md}px) {
		.container, .md-container {
			margin-inline: calc((100vw - ${breakpoints.md}px) / 2);
		}
		.container-fluid, .md-container-fluid {
			padding-inline: calc((100vw - ${breakpoints.md}px) / 2);
		}
	}
	
	@media (min-width: ${breakpoints.lg}px) {
		.container, .md-container, .lg-container {
			margin-inline: calc((100vw - ${breakpoints.lg}px) / 2);
		}
		.container-fluid, .md-container-fluid, .lg-container-fluid {
			padding-inline: calc((100vw - ${breakpoints.lg}px) / 2);
		}
	}
	
	@media (min-width: ${breakpoints.xl}px) {
		.container, .md-container, .lg-container, .xl-container {
			margin-inline: calc((100vw - ${breakpoints.xl}px) / 2);
		}
		.container-fluid, .md-container-fluid, .lg-container-fluid, .xl-container-fluid {
			padding-inline: calc((100vw - ${breakpoints.xl}px) / 2);
		}
	}
	
	@media (min-width: ${breakpoints.xxl}px) {
		.container, .md-container, .lg-container, .xl-container, .xxl-container {
			margin-inline: calc((100vw - ${breakpoints.xxl}px) / 2);
		}
		.container-fluid, .md-container-fluid, .lg-container-fluid, .xl-container-fluid, .xxl-container-fluid {
			padding-inline: calc((100vw - ${breakpoints.xxl}px) / 2);
		}
	}
	`;
	containerStyles = containerClassStyle;
	const containerClass = document.createElement("style");
	containerClass.innerHTML = containerClassStyle;
	document.head.appendChild(containerClass);
}

async function loadAll() {
	const smStyle = [];
	const mdStyle = [];
	const lgStyle = [];
	const xlStyle = [];
	const xxlStyle = [];
	cssBlocks.forEach((block) => {
		block = block.trim();
		block += `}`;
		if (block.startsWith(".")){
			// console.log(block);
			smStyle.push(block.replace(".", ".sm-").replace(".hover", ".sm-hover"));
			mdStyle.push(block.replace(".", ".md-").replace(".hover", ".md-hover"));
			lgStyle.push(block.replace(".", ".lg-").replace(".hover", ".lg-hover"));
			xlStyle.push(block.replace(".", ".xl-").replace(".hover", ".xl-hover"));
			xxlStyle.push(block.replace(".", ".xxl-").replace(".hover", ".xxl-hover"));
		}
	});
	const smStyleTag = document.createElement("style");
	smStyleTag.innerHTML = `@media (min-width: ${breakpoints.sm}px) {\n${smStyle.join("\n")} \n}`;
	document.head.appendChild(smStyleTag);
	const mdStyleTag = document.createElement("style");
	mdStyleTag.innerHTML = `@media (min-width: ${breakpoints.md}px) {\n${mdStyle.join("\n")} \n}`;
	document.head.appendChild(mdStyleTag);
	const lgStyleTag = document.createElement("style");
	lgStyleTag.innerHTML = `@media (min-width: ${breakpoints.lg}px) {\n${lgStyle.join("\n")} \n}`;
	document.head.appendChild(lgStyleTag);
	const xlStyleTag = document.createElement("style");
	xlStyleTag.innerHTML = `@media (min-width: ${breakpoints.xl}px) {\n${xlStyle.join("\n")} \n}`;
	document.head.appendChild(xlStyleTag);
	const xxlStyleTag = document.createElement("style");
	xxlStyleTag.innerHTML = `@media (min-width: ${breakpoints.xxl}px) {\n${xxlStyle.join("\n")} \n}`;
	document.head.appendChild(xxlStyleTag);
}

// // TODO- trigger getBreakpoint() on window resize
// $(window).on(
// 	"resize",
// 	debounce(function () {
// 		getBreakpoint();
// 	}, 250),
// );

// // TODO- Debounce the getBreakpoint() function
// function debounce(func, delay) {
// 	let timeoutId;
// 	return function () {
// 		const context = this;
// 		const args = arguments;
// 		clearTimeout(timeoutId);
// 		timeoutId = setTimeout(() => {
// 			func.apply(context, args);
// 		}, delay);
// 	};
// }

// TODO- List all classes
async function getClasses() {
	classesElements.length = 0;
	classes.length = 0;
	smClasses.length = 0;
	mdClasses.length = 0;
	lgClasses.length = 0;
	xlClasses.length = 0;
	xxlClasses.length = 0;
	$("*").each(function () {
		if (
			$(this).attr("class") !== undefined &&
			$(this).attr("class") !== ""
		) {
			classesElements.push($(this));
		}
	});
	classesElements.forEach((element) => {
		const elementClasses = element.attr("class").split(" ");
		elementClasses.forEach((elementClass) => {
			if (
				!classes.includes(elementClass) &&
				elementClass !== ""
			) {
				elementClass.replace("sm-", "")
				.replace("md-", "")
				.replace("lg-", "")
				.replace("xl-", "")
				.replace("xxl-", "");
				classes.push(elementClass);
			}
			if (elementClass.startsWith("sm-") && elementClass !== "sm-") {
				elementClass = elementClass.replace("sm-", "");
				if (smClasses.includes(elementClass)) {
				} else {
					smClasses.push(elementClass);
				}
			}
			if (elementClass.startsWith("md-") && elementClass !== "md-") {
				elementClass = elementClass.replace("md-", "");
				if (mdClasses.includes(elementClass)) {
				} else {
					mdClasses.push(elementClass);
				}
			}
			if (elementClass.startsWith("lg-") && elementClass !== "lg-") {
				elementClass = elementClass.replace("lg-", "");
				if (lgClasses.includes(elementClass)) {
				} else {
					lgClasses.push(elementClass);
				}
			}
			if (elementClass.startsWith("xl-") && elementClass !== "xl-") {
				elementClass = elementClass.replace("xl-", "");
				if (xlClasses.includes(elementClass)) {
				} else {
					xlClasses.push(elementClass);
				}
			}
			if (elementClass.startsWith("xxl-") && elementClass !== "xxl-") {
				elementClass = elementClass.replace("xxl-", "");
				if (xxlClasses.includes(elementClass)) {
				} else {
					xxlClasses.push(elementClass);
				}
			}
		});
	});
	// console.log("Activated breakpoints-", breakpoints);
	await getCSS();
}

// TODO- Get current breakpoint
async function getBreakpoint() {
	windowWidth = document.documentElement.clientWidth;
	// console.log(`Window width: ${windowWidth}`);
	let newBreakpoint = null;
	if (windowWidth < breakpoints.sm) {
		newBreakpoint = "mobile";
	} else {
		for (const breakpoint in breakpoints) {
			if (windowWidth >= breakpoints[breakpoint]) {
				newBreakpoint = breakpoint;
				currentBreakpoint = newBreakpoint;
			} else {
				break;
			}
		}
	}
	activeBPIndex = classPrefixes.indexOf(newBreakpoint);
}

async function getCSS() {
	if (smClasses.length !== 0) {
		await getStyle(smClasses, "sm");
	}
	if (mdClasses.length !== 0) {
		await getStyle(mdClasses, "md");
	}
	if (lgClasses.length !== 0) {
		await getStyle(lgClasses, "lg");
	}
	if (xlClasses.length !== 0) {
		await getStyle(xlClasses, "xl");
	}
	if (xxlClasses.length !== 0) {
		await getStyle(xxlClasses, "xxl");
	}
}

async function getStyle(array, breakpoint) {
	const styleString = [];
	for (let i = 0; i < array.length; i++) {
		const className = array[i];
		if (className === "container") {
			continue;
		}
		const style = await getStyleFromCSS(className);
		if (style !== null) {
			const newStyle = style.replace(
				`.${className}`,
				`.${breakpoint}-${className}`,
			);
			styleString.push(newStyle);
		}
	}
	const styleTag = document.createElement("style");
	styleTag.innerHTML = `@media (min-width: ${
		breakpoints[breakpoint]
	}px) {\n${styleString.join("\n")} \n}`;
	document.head.appendChild(styleTag);
}

async function getStyleFromCSS(className) {
	return new Promise((resolve, reject) => {
		cssBlocks.forEach((block) => {
			if (block.includes(`.${className}`)) {
				if (className.includes("hover")) {
					const notRequired =
						className.replace(".hover-", "").trim() + ",";
					block = block.replace(notRequired, "");
				} else {
					block = block
						.replace(`.hover-${className}:hover`, "")
						.replace(",", "");
				}
				block += `}`;
				block = block.trim();
				resolve(block);
			}
		});
		reject(null);
	});
}



!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AOS=t():e.AOS=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="dist/",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),a=(o(r),n(6)),u=o(a),c=n(7),f=o(c),s=n(8),d=o(s),l=n(9),p=o(l),m=n(10),b=o(m),v=n(11),y=o(v),g=n(14),h=o(g),w=[],k=!1,x=document.all&&!window.atob,j={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},O=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e&&(k=!0),k)return w=(0,y.default)(w,j),(0,b.default)(w,j.once),w},_=function(){w=(0,h.default)(),O()},S=function(){w.forEach(function(e,t){e.node.removeAttribute("effect"),e.node.removeAttribute("effect-easing"),e.node.removeAttribute("effect-duration"),e.node.removeAttribute("effect-delay")})},z=function(e){return e===!0||"mobile"===e&&p.default.mobile()||"phone"===e&&p.default.phone()||"tablet"===e&&p.default.tablet()||"function"==typeof e&&e()===!0},A=function(e){return j=i(j,e),w=(0,h.default)(),z(j.disable)||x?S():(document.querySelector("body").setAttribute("effect-easing",j.easing),document.querySelector("body").setAttribute("effect-duration",j.duration),document.querySelector("body").setAttribute("effect-delay",j.delay),"DOMContentLoaded"===j.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?O(!0):"load"===j.startEvent?window.addEventListener(j.startEvent,function(){O(!0)}):document.addEventListener(j.startEvent,function(){O(!0)}),window.addEventListener("resize",(0,f.default)(O,j.debounceDelay,!0)),window.addEventListener("orientationchange",(0,f.default)(O,j.debounceDelay,!0)),window.addEventListener("scroll",(0,u.default)(function(){(0,b.default)(w,j.once)},j.throttleDelay)),j.disableMutationObserver||(0,d.default)("[effect]",_),w)};e.exports={init:A,refresh:O,refreshHard:_}},function(e,t){},,,,,function(e,t){(function(t){"use strict";function n(e,t,n){function o(t){var n=b,o=v;return b=v=void 0,k=t,g=e.apply(o,n)}function r(e){return k=e,h=setTimeout(s,t),_?o(e):g}function a(e){var n=e-w,o=e-k,i=t-n;return S?j(i,y-o):i}function c(e){var n=e-w,o=e-k;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=O();return c(e)?d(e):void(h=setTimeout(s,a(e)))}function d(e){return h=void 0,z&&b?o(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),k=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(O())}function m(){var e=O(),n=c(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),o(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,k=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(f);return t=u(t)||0,i(n)&&(_=!!n.leading,S="maxWait"in n,y=S?x(u(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e,t,o){var r=!0,a=!0;if("function"!=typeof e)throw new TypeError(f);return i(o)&&(r="leading"in o?!!o.leading:r,a="trailing"in o?!!o.trailing:a),n(e,t,{leading:r,maxWait:t,trailing:a})}function i(e){var t="undefined"==typeof e?"undefined":c(e);return!!e&&("object"==t||"function"==t)}function r(e){return!!e&&"object"==("undefined"==typeof e?"undefined":c(e))}function a(e){return"symbol"==("undefined"==typeof e?"undefined":c(e))||r(e)&&k.call(e)==d}function u(e){if("number"==typeof e)return e;if(a(e))return s;if(i(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=i(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(l,"");var n=m.test(e);return n||b.test(e)?v(e.slice(2),n?2:8):p.test(e)?s:+e}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f="Expected a function",s=NaN,d="[object Symbol]",l=/^\s+|\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,b=/^0o[0-7]+$/i,v=parseInt,y="object"==("undefined"==typeof t?"undefined":c(t))&&t&&t.Object===Object&&t,g="object"==("undefined"==typeof self?"undefined":c(self))&&self&&self.Object===Object&&self,h=y||g||Function("return this")(),w=Object.prototype,k=w.toString,x=Math.max,j=Math.min,O=function(){return h.Date.now()};e.exports=o}).call(t,function(){return this}())},function(e,t){(function(t){"use strict";function n(e,t,n){function i(t){var n=b,o=v;return b=v=void 0,O=t,g=e.apply(o,n)}function r(e){return O=e,h=setTimeout(s,t),_?i(e):g}function u(e){var n=e-w,o=e-O,i=t-n;return S?x(i,y-o):i}function f(e){var n=e-w,o=e-O;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=j();return f(e)?d(e):void(h=setTimeout(s,u(e)))}function d(e){return h=void 0,z&&b?i(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),O=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(j())}function m(){var e=j(),n=f(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),i(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,O=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(c);return t=a(t)||0,o(n)&&(_=!!n.leading,S="maxWait"in n,y=S?k(a(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e){var t="undefined"==typeof e?"undefined":u(e);return!!e&&("object"==t||"function"==t)}function i(e){return!!e&&"object"==("undefined"==typeof e?"undefined":u(e))}function r(e){return"symbol"==("undefined"==typeof e?"undefined":u(e))||i(e)&&w.call(e)==s}function a(e){if("number"==typeof e)return e;if(r(e))return f;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(d,"");var n=p.test(e);return n||m.test(e)?b(e.slice(2),n?2:8):l.test(e)?f:+e}var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c="Expected a function",f=NaN,s="[object Symbol]",d=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,m=/^0o[0-7]+$/i,b=parseInt,v="object"==("undefined"==typeof t?"undefined":u(t))&&t&&t.Object===Object&&t,y="object"==("undefined"==typeof self?"undefined":u(self))&&self&&self.Object===Object&&self,g=v||y||Function("return this")(),h=Object.prototype,w=h.toString,k=Math.max,x=Math.min,j=function(){return g.Date.now()};e.exports=n}).call(t,function(){return this}())},function(e,t){"use strict";function n(e,t){var n=new r(o);a=t,n.observe(i.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function o(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),n=Array.prototype.slice.call(e.removedNodes),o=t.concat(n).filter(function(e){return e.hasAttribute&&e.hasAttribute("effect")}).length;o&&a()})}Object.defineProperty(t,"__esModule",{value:!0});var i=window.document,r=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,a=function(){};t.default=n},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,a=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,u=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,f=function(){function e(){n(this,e)}return i(e,[{key:"phone",value:function(){var e=o();return!(!r.test(e)&&!a.test(e.substr(0,4)))}},{key:"mobile",value:function(){var e=o();return!(!u.test(e)&&!c.test(e.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();t.default=new f},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t,n){var o=e.node.getAttribute("effect-once");t>e.position?e.node.classList.add("animate"):"undefined"!=typeof o&&("false"===o||!n&&"true"!==o)&&e.node.classList.remove("animate")},o=function(e,t){var o=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,r){n(e,i+o,t)})};t.default=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(12),r=o(i),a=function(e,t){return e.forEach(function(e,n){e.node.classList.add("aos-init"),e.position=(0,r.default)(e.node,t.offset)}),e};t.default=a},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(13),r=o(i),a=function(e,t){var n=0,o=0,i=window.innerHeight,a={offset:e.getAttribute("effect-offset"),anchor:e.getAttribute("effect-anchor"),anchorPlacement:e.getAttribute("effect-anchor-placement")};switch(a.offset&&!isNaN(a.offset)&&(o=parseInt(a.offset)),a.anchor&&document.querySelectorAll(a.anchor)&&(e=document.querySelectorAll(a.anchor)[0]),n=(0,r.default)(e).top,a.anchorPlacement){case"top-bottom":break;case"center-bottom":n+=e.offsetHeight/2;break;case"bottom-bottom":n+=e.offsetHeight;break;case"top-center":n+=i/2;break;case"bottom-center":n+=i/2+e.offsetHeight;break;case"center-center":n+=i/2+e.offsetHeight/2;break;case"top-top":n+=i;break;case"bottom-top":n+=e.offsetHeight+i;break;case"center-top":n+=e.offsetHeight/2+i}return a.anchorPlacement||a.offset||isNaN(t)||(o=t),n+o};t.default=a},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}};t.default=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e=e||document.querySelectorAll("[effect]"),Array.prototype.map.call(e,function(e){return{node:e}})};t.default=n}])});
