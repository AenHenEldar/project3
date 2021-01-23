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

    const postResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`PIZDECSUKABLY\nurl: ${url}\nstatus: ${res.status}`)
        }

        return await res.json();
    };

    postResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
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
});
