/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function calc() {
    const totalCal = document.querySelector('.calculating__result span');

    let sex = localStorage.getItem('sex') ? localStorage.getItem('sex') : 'female', 
    height = localStorage.getItem('height'), 
    weight = localStorage.getItem('weight'), 
    age = localStorage.getItem('age'), 
    ratio = localStorage.getItem('ratio') ? localStorage.getItem('ratio') : 1.375;

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector),
              inputH = document.querySelector('#height'),
              inputW = document.querySelector('#weight'),
              inputA = document.querySelector('#age');

        if(height) {
            inputH.value = height;
        }
        if(weight) {
            inputW.value = weight;
        }
        if(age) {
            inputA.value = age;
        }

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.id === sex) {
                elem.classList.add(activeClass);
            } else if(elem.getAttribute('data-ratio') === ratio) {
                elem.classList.add(activeClass);
            }
        });


    }

    initLocalSettings('#gender .calculating__choose-item', 'calculating__choose-item_active');
    initLocalSettings('[data-ratio]', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            totalCal.textContent = '____';
        } else {
            if(sex == 'male') {
                totalCal.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
            } else if(sex == 'female') {
                totalCal.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
            }

            localStorage.setItem('sex', sex);
            localStorage.setItem('height', height);
            localStorage.setItem('weight', weight);
            localStorage.setItem('age', age);
            localStorage.setItem('ratio', ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, active) {
        const btns = document.querySelectorAll(selector);

        btns.forEach(btn => {
            btn.addEventListener('click', e => {
                btns.forEach(b => {
                    b.classList.remove(active);
                });
                btn.classList.add(active);

                if(btn.getAttribute('data-ratio')) {
                    ratio = btn.getAttribute('data-ratio');
                } else {
                    sex = btn.id;
                }

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender .calculating__choose-item', 'calculating__choose-item_active');
    getStaticInformation('[data-ratio]', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', e => {
            if(input.value.match(/\D/)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.id) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function cards() {
    class Menu {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 28.25;
            this.convertToUAH();
            this.parent = document.querySelector(parent);
            this.classes = classes;
        }

        convertToUAH() {
            this.price *= this.transfer;
        }

        rendMenu() {
            const elem = document.createElement('div');

            if(this.classes.length === 0) {
                elem.classList.add('menu__item');
            } else {
                this.classes.forEach(className => elem.classList.add(className));
            }

            elem.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>`;
            this.parent.append(elem);
        }
    }

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new Menu(img, altimg, title, descr, price, '.menu .container').rendMenu();
            });
        });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function forms(formSelector, modalTimerId) {
    const forms = document.querySelectorAll(formSelector);

    const message = {
        success: 'Good!',
        fail: 'Fuck@',
        load: 'img/form/spinner.svg'
    };

    function bindPostData(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusMessage = document.createElement('img');

            statusMessage.src = message.load;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;`;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form),
                  json = JSON.stringify(Object.fromEntries(formData.entries()));
            
            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
            .then(response => {
                showMessageModal(message.success);
                statusMessage.remove();
            })
            .catch(() => showMessageModal(message.fail))
            .finally(() => form.reset());
        });
    }

    forms.forEach(value => {
        bindPostData(value);
    });

    function showMessageModal(message) {
        const oldContent = document.querySelector('.modal__content');

        oldContent.classList.add('hide');
        
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimerId);

        const newContent = document.createElement('div');
        newContent.classList.add('modal__content');
        newContent.innerHTML = `
        <div data-close="" class="modal__close">×</div>
        <div class="modal__title">${message}</div>`;
        document.querySelector('.modal__dialog').append(newContent);

        setTimeout(() => {
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
            newContent.remove();
            oldContent.classList.remove('hide');
            oldContent.classList.add('show');
        }, 4000);
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "openModal": () => /* binding */ openModal,
/* harmony export */   "closeModal": () => /* binding */ closeModal
/* harmony export */ });
function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    if(modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector),
    modalOn = document.querySelectorAll(triggerSelector),
    page = document.documentElement;
      

    modalOn.forEach(value => {
        value.addEventListener('click', e => {
            openModal(modalSelector, modalTimerId);
        });
    });

    modal.addEventListener('click', e => {
        if(e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', e => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function getScrollEnd() {
        if((window.pageYOffset + page.clientHeight + 10) >= page.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', getScrollEnd);
        }
    }

    window.addEventListener('scroll', getScrollEnd);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timer */ "./js/modules/timer.js");


function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    const slides = document.querySelectorAll(slide),
          slider = document.querySelector(container),
          prevSliderArrow = document.querySelector(prevArrow),
          nextSliderArrow = document.querySelector(nextArrow),
          maxSliderNum = slides.length,
          currentSliderNum = document.querySelector(currentCounter),
          slidesWrapper = document.querySelector(wrapper),
          slidesField = document.querySelector(field),
          slidesWidth = getComputedStyle(slidesWrapper).width,
          slidesWidthNum = +slidesWidth.replace(/\D/g, ''),
          indicators = document.createElement('ol'),
          dots = [];
          
    let sliderCounter = 1,
    offSetX = 0;
          
    document.querySelector(totalCounter).textContent = (0,_timer__WEBPACK_IMPORTED_MODULE_0__.getZero)(maxSliderNum);
    currentSliderNum.textContent = (0,_timer__WEBPACK_IMPORTED_MODULE_0__.getZero)(sliderCounter);
    
    slidesField.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: 0.5s all;
    `;
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach((elem, i) => {
        elem.style.width = slidesWidth;

        const dot = document.createElement('li');
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        indicators.append(dot);
        dots.push(dot);
        if(i === 0) {
            dot.style.opacity = 1;
        }
    });

    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);
    slider.style.position = 'relative';

    function setCurrentSlider(currentNum) {
        offSetX = -currentNum * slidesWidthNum;

        currentSliderNum.textContent = (0,_timer__WEBPACK_IMPORTED_MODULE_0__.getZero)(currentNum + 1);        
        slidesField.style.transform = `translateX(${offSetX}px)`;  

        dots.forEach(elem => {
            elem.style.opacity = 0.5;
        });
        dots[currentNum].style.opacity = 1;
    }

    nextSliderArrow.addEventListener('click', e => {
        sliderCounter++;
        if(sliderCounter > maxSliderNum) {
            sliderCounter = 1;
        }

        setCurrentSlider(sliderCounter - 1);
    });

    prevSliderArrow.addEventListener('click', e => {
        sliderCounter--;
        if(sliderCounter < 1) {
            sliderCounter = maxSliderNum;
        }

        setCurrentSlider(sliderCounter - 1);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', e => {
            sliderCounter = i + 1;
            setCurrentSlider(i);
        });
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    const tabsParent = document.querySelector(tabsParentSelector),
          tabs = document.querySelectorAll(tabsSelector),
          tabsContent = document.querySelectorAll(tabsContentSelector);
          

    function hideTabContent() {
        tabsContent.forEach((value, i) => {
            value.classList.add('hide');
            value.classList.remove('show', 'fade');
            tabs[i].classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', e => {
        const target = e.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((value, i) => {
                if(value === target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "getZero": () => /* binding */ getZero
/* harmony export */ });
function getZero(num) {
    if(num < 10) {
        return `0${num}`;
    } 
    return num;
}

function timer(id, deadline) {

    function setTimeReminder(endtime) {
        const total = new Date(endtime) - new Date(),
        seconds = Math.floor( (total/1000) % 60 ),
        minutes = Math.floor( (total/1000/60) % 60 ),
        hours = Math.floor( (total/(1000*60*60)) % 24 ),
        days = Math.floor( total/(1000*60*60*24) );

        return {
            total,
            seconds,
            minutes,
            hours,
            days
        };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() {
            const t = setTimeReminder(endtime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(id, deadline);  
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);


/***/ }),

/***/ "./js/script.js":
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* jslint node: true */











window.addEventListener('DOMContentLoaded', () => { 
    const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_0__.default)('.modal', modalTimerId), 80000);  

    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_0__.default)('[data-modal]', '.modal', modalTimerId);
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_1__.default)({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
   });
    (0,_modules_forms__WEBPACK_IMPORTED_MODULE_2__.default)('form', modalTimerId);
    (0,_modules_calc__WEBPACK_IMPORTED_MODULE_3__.default)();
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_4__.default)('.timer', '2021-02-27');
    (0,_modules_cards__WEBPACK_IMPORTED_MODULE_5__.default)();
    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_6__.default)('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
});


/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postData": () => /* binding */ postData
/* harmony export */ });
const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json();
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./js/script.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=bundle.js.map