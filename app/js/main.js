(() => {
    //observer object currentState
    const currentState = {
        __car: 'mers',
        __partial: 'стандарт++',
        __selectedPart: 'стандарт++',
        subscribers: {
            any: []
        },
        subscribe(fn, ctx, type = 'any') {
            if (typeof this.subscribers[type] === 'undefined') {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn.bind(ctx));
        },
        set partial(value) {
            this.__partial = value;
            this.subscribers['any'].forEach(fn => fn(this.__partial, this.__car));
        },
        set car(value) {
            this.__car = value;
            this.__selectedPart = 'стандарт++';
            this.partial = 'стандарт++';
            this.subscribers['changeCar'].forEach(fn => fn());
        }
    };
    class Car {
        constructor(name, price) {
            this.name = name;
            this.price = price;
            this.partials = {};
            this.urls = [
                "двери",
                "задние-крылья",
                "задний-бампер",
                "капот",
                "минимальный",
                "оптика",
                "передний-бампер",
                "пороги-внутренние",
                "пороги-наружние",
                "стандарт",
                "стандарт+",
                "стандарт++",
                "стандарт+++",
                "целиком",
                "clear"
            ];
        }
        loadImg() {
            let cnt = 0;

            let onLoad = () => {
                cnt++;
                if (cnt === this.urls.length) {
                    console.log('Done');
                }
            }

            this.urls.forEach((e, idx) => {
                let img = new Image();
                img.onload = onLoad;
                img.src = `./img/cars/${this.name}/${e}.jpg`
                this.partials[e] = { img, price: this.price[idx] };
            });
        }
    }

    let mazdaPrice = [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300];
    let citPrice = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200];
    let mersPrice = [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500];

    let cars = {                              
        mers: new Car('mers', mersPrice),
        cit: new Car('cit', citPrice),
        mazda: new Car('mazda', mazdaPrice)
    };

    for (car in cars) {
        cars[car].loadImg();
    }

    let navBar = {
        elem: document.querySelector('.navbar'),
        cards: document.querySelectorAll('.card'),
        click() {
            this.elem.addEventListener('click', e => {
                let target = e.target.closest('.card');
                if (!target) {
                    return;
                }

                if (target.dataset.name !== currentState.car) {
                    currentState.car = target.dataset.name;
                    this.cards.forEach(e => e.classList.remove('active'));
                    target.classList.add('active');
                }

            });
        }
    };
    navBar.click();


    let viewBar = {
        elem: document.querySelector('.viewbar'),
        picture: document.querySelector('.picture'),
        renderImg(part, car) {
            let img = this.picture.children[0];
            let newImg = cars[car].partials[part].img;
            if (img !== newImg) {
                this.picture.replaceChild(newImg, img);
            }
        }
    };

    document.querySelector('.dropdown').addEventListener('click', e => {
        let target = e.target.tagName === "LI" ? e.target : e.target.parentElement;
        target.classList.toggle('active');
        let content = target.nextElementSibling;
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });



    let customBar = {
        elem: document.querySelector('.custombar'),
        iconBlocks: document.querySelectorAll('.custombar > div'),
        plans: {
            'минимальный': ["пороги-внутренние", "торцы-дверей", "задний-бампер", "зеркала", "фары", "ручки" ],
            'стандарт': ["часть-капота", "часть-крыльев", "передний-бампер", "зеркала", "фары", "ручки", "противотуманки"],
            'стандарт+': ["капот-полностью", "часть-крыльев", "передний-бампер", "зеркала", "фары", "ручки", "противотуманки"],
            'стандарт++': ["капот-полностью", "крылья-полностью", "передний-бампер", "зеркала", "фары", "ручки", "противотуманки"],
            'стандарт+++': ["капот-полностью", "крылья-полностью", "передний-бампер", "зеркала", "фары", "ручки", "противотуманки", "задний-бампер"]
        },
        update(part) {
            if(this.plans[part]) {
                this.iconBlocks.forEach(e => {
                    let name = e.dataset.name;
                    if(this.plans[part].some(item => item === name)) {
                        e.style.display = 'block';
                    } else {
                        e.style.display = 'none';
                    }
                });
            } else {
                this.iconBlocks.forEach(e => e.style.display = 'none');
            }
        }
    }

    let sideBar = {
        elem: document.querySelector('.sidebar'),
        listItems: [...document.querySelectorAll('.sidebar li')].filter(e => {
            return !e.classList.contains('dropdown');
        }),
        selectDefault() {
            this.listItems.forEach(e => e.classList.remove('active'));
            let item = this.elem.querySelector('[data-item="стандарт++"]');
            item.classList.add('active');
        },
        click() {
            this.elem.addEventListener('click', e => {
                let target = e.target;
                if (target.dataset.item !== undefined) {
                    this.listItems.forEach(e => e.classList.remove('active'));
                    target.classList.add('active');
                    currentState.__selectedPart = target.dataset.item;
                    customBar.update(target.dataset.item);
                }
            });
        },
        mouseover() {
            this.elem.addEventListener('mouseover', e => {
                if (e.target.dataset.item !== undefined) {
                    currentState.partial = e.target.dataset.item;
                }
            });
            this.elem.addEventListener('mouseout', e => {
                if (e.target.tagName === 'LI' && e.relatedTarget.tagName !== 'Li') {
                    viewBar.renderImg(currentState.__selectedPart, currentState.__car);
                }
            });
        }
    };
    sideBar.mouseover();
    sideBar.click();

    currentState.subscribe(viewBar.renderImg, viewBar);
    currentState.subscribe(sideBar.selectDefault, sideBar, 'changeCar');

})();
