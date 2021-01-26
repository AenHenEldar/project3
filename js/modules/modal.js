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

export default modal;

export {openModal, closeModal};