/* jslint node: true */
"use strict";

import modal from './modules/modal';
import slider from './modules/slider';
import forms from './modules/forms';
import calc from './modules/calc';
import timer from './modules/timer';
import cards from './modules/cards';
import tabs from './modules/tabs';
import openModal from './modules/modal';

window.addEventListener('DOMContentLoaded', () => { 
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 80000);  

    modal('[data-modal]', '.modal', modalTimerId);
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
   });
    forms('form', modalTimerId);
    calc();
    timer('.timer', '2021-02-27');
    cards();
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
});
