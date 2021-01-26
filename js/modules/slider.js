import {getZero} from './timer';

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
          
    document.querySelector(totalCounter).textContent = getZero(maxSliderNum);
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
            sliderCounter = i + 1;
            setCurrentSlider(i);
        });
    });
}

export default slider;