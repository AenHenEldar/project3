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

export default calc;