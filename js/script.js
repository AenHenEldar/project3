/* jslint node: true */
"use strict";

window.addEventListener('DOMContentLoaded', () => {
    //tabs
    const tabsParent = document.querySelector('.tabheader__items'),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent');
          

    function hideTabContent() {
        tabsContent.forEach((value, i) => {
            value.classList.add('hide');
            value.classList.remove('show', 'fade');
            tabs[i].classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', e => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((value, i) => {
                if(value === target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
    //timer
    const deadline = '2021-02-27';

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

    function getZero(num) {
        if(num < 10) {
            return `0${num}`;
        } 
        return num;
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

    setClock('.timer', deadline);   
    //modal
    const modal = document.querySelector('.modal'),
    modalOn = document.querySelectorAll('[data-modal]'),
    page = document.documentElement,
    proposal = setTimeout(openModal, 80000);    

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(proposal);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalOn.forEach(value => {
        value.addEventListener('click', e => {
            openModal();
        });
    });

    modal.addEventListener('click', e => {
        if(e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function getScrollEnd() {
        if((window.pageYOffset + page.clientHeight + 10) >= page.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', getScrollEnd);
        }
    }

    window.addEventListener('scroll', getScrollEnd);
    //classes
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

    // const postResource = async (url) => {
    //     const res = await fetch(url);

    //     if(!res.ok) {
    //         throw new Error(`PIZDECSUKABLY\nurl: ${url}\nstatus: ${res.status}`)
    //     }

    //     return await res.json();
    // };

    // postResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new Menu(img, altimg, title, descr, price, '.menu .container').rendMenu();
    //     });
    // });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new Menu(img, altimg, title, descr, price, '.menu .container').rendMenu();
            });
        });
    //forms
    const forms = document.querySelectorAll('form');

    const message = {
        success: 'Good!',
        fail: 'Fuck@',
        load: 'img/form/spinner.svg'
    };

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
            
            postData('http://localhost:3000/requests', json)
            .then(response => {
                console.log(response);
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
        
        openModal();

        const newContent = document.createElement('div');
        newContent.classList.add('modal__content');
        newContent.innerHTML = `
        <div data-close="" class="modal__close">×</div>
        <div class="modal__title">${message}</div>`;
        document.querySelector('.modal__dialog').append(newContent);

        setTimeout(() => {
            closeModal();
            newContent.remove();
            oldContent.classList.remove('hide');
            oldContent.classList.add('show');
        }, 4000);
    }
    //slider
    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prevSliderArrow = document.querySelector('.offer__slider-prev'),
          nextSliderArrow = document.querySelector('.offer__slider-next'),
          maxSliderNum = slides.length,
          currentSliderNum = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          slidesWidth = getComputedStyle(slidesWrapper).width,
          slidesWidthNum = +slidesWidth.replace(/\D/g, ''),
          indicators = document.createElement('ol'),
          dots = [];
          
    let sliderCounter = 1,
    offSetX = 0;
          
    document.querySelector('#total').textContent = getZero(maxSliderNum);
    currentSliderNum.textContent = getZero(sliderCounter);
    
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

        currentSliderNum.textContent = getZero(currentNum + 1);        
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
            setCurrentSlider(i);
        });
    });
    //Calc
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
});
