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

export default cards;