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
});
