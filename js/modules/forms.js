import {openModal, closeModal} from './modal';
import {postData} from '../services/services';

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
            
            postData('http://localhost:3000/requests', json)
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
        
        openModal('.modal', modalTimerId);

        const newContent = document.createElement('div');
        newContent.classList.add('modal__content');
        newContent.innerHTML = `
        <div data-close="" class="modal__close">×</div>
        <div class="modal__title">${message}</div>`;
        document.querySelector('.modal__dialog').append(newContent);

        setTimeout(() => {
            closeModal('.modal');
            newContent.remove();
            oldContent.classList.remove('hide');
            oldContent.classList.add('show');
        }, 4000);
    }
}

export default forms;