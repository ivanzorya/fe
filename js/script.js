'use strict'

window.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabHeader = document.querySelector('.tabheader'),
        tabHeaderItems = tabHeader.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent');

    const hideContent = () =>
    {
        tabContent.forEach(content => {
            content.classList.remove('show', 'fade');
            content.classList.add('hide');
        });
    };

    const activeContent = () => {
      for (let i = 0; i < tabContent.length; i++) {
          if (tabHeaderItems[i].classList.contains('tabheader__item_active')) {
              tabContent[i].classList.remove('hide');
              tabContent[i].classList.add('show', 'fade');
          }
      }
    };

    hideContent();
    activeContent();

    tabHeaderItems.forEach(item => {
       item.addEventListener('click', (event) => {
           tabHeaderItems.forEach( item => {
               item.classList.remove('tabheader__item_active');
           });
           item.classList.add('tabheader__item_active');
           hideContent();
           activeContent();
       }) ;
    });

    // Timer
    let days = document.querySelector('#days'),
        hours = document.querySelector('#hours'),
        minutes = document.querySelector('#minutes'),
        seconds = document.querySelector('#seconds');

    const changeAllTime = () => {
        const endDate = new Date('2021-10-29'),
            startDate = new Date(),
            deltaTime = endDate - startDate;

        if (deltaTime <= 0) {
            return;
        }

        const daysToEnd = Math.floor(deltaTime / 1000 / 60 / 60 / 24),
            hoursToEnd = Math.floor(deltaTime / 1000 / 60 / 60 % 24),
            minutesToEnd = Math.floor(deltaTime / 1000 / 60 % 60),
            secondsToEnd = Math.floor(deltaTime / 1000 % 60);


        const changeTime = (item, value) => {
            item.innerHTML = value;
        }

        changeTime(days, daysToEnd);
        changeTime(hours, hoursToEnd);
        changeTime(minutes, minutesToEnd);
        changeTime(seconds, secondsToEnd);
    }
    changeAllTime();

    setInterval(changeAllTime, 1000);

    // Modal
    const modalBtns = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');


    const openModal = () => {
        modalWindow.classList.remove('hide');
        modalWindow.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    modalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    const closeModal = () => {
        modalWindow.classList.remove('show');
        modalWindow.classList.add('hide');
        document.body.style.overflow = '';
    }

    modalWindow.addEventListener('click', (event) => {
       if (event.target === modalWindow || event.target.getAttribute('data-close') === '') {
           closeModal();
       }
    });

    document.addEventListener('keydown', (event) => {
       if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
           closeModal();
       }
    });

    const modalTimer = setTimeout(openModal, 40000);

    const showModalByScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Day menu
    const menuField = document.querySelector('.menu__field'),
        menuFieldCont = menuField.querySelector('.container'),
        menuItems = menuFieldCont.querySelectorAll('.menu__item');

    menuItems.forEach(item => {
       item.remove();
    });

    class newMenuItem {
        constructor(imageScr, imageAlt, subtitle, description, price, ...classes) {
            this.imageScr = imageScr;
            this.imageAlt = imageAlt;
            this.subtitle = subtitle;
            this.description = description;
            this.price = price;
            this.classes = classes
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes.push('menu__item');
            }
            this.classes.forEach(className => element.classList.add(className))
            element.innerHTML = `
                    <img src="${this.imageScr}" alt="${this.imageAlt}">
                    <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> p/день</div>
                    </div>
                `;
            return element
        };
    }

    axios.get("http://localhost:3000/menu")
        .then(response => {
            response.data.forEach(({img, altimg, title, descr, price}) => {
                const newItem = new newMenuItem(img, altimg, title, descr, price);
                menuFieldCont.append(newItem.render());
            })
        });

// Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Ok',
        failure: 'Bad request'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests", json)
            .then(data => {
                console.table(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

        });
    }

    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);

    }

    // Slider
    const offerSlides = document.querySelectorAll('.offer__slide'),
        offerSlider = document.querySelector('.offer__slider'),
        currentNumber = document.querySelector('#current'),
        totalNumber = document.querySelector('#total'),
        offerSlidePrev = document.querySelector('.offer__slider-prev'),
        offerSlideNext = document.querySelector('.offer__slider-next'),
        sliderWrapper = document.querySelector('.offer__slider-wrapper'),
        sliderField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(sliderWrapper).width;
        
    let slideIndex = 1;
    let offset = 0;
    currentNumber.innerHTML = slideIndex < 10 ? `0${slideIndex}` :  slideIndex;
    totalNumber.innerHTML = offerSlides.length < 10 ? `0${offerSlides.length}` :  offerSlides.length;

    sliderField.style.width = 100 * offerSlides.length + "%";
    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    offerSlides.forEach(slide => {
        slide.style.width = width;
    });

    offerSlider.style.position = 'relative';
    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
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
    offerSlider.append(indicators);

    for (let i = 0; i < offerSlides.length; i++ ) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
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
        if (i == 0) { dot.style.opacity = 1;} 

        indicators.append(dot);
        dots.push(dot);
    }

    offerSlideNext.addEventListener('click', () => {
        if (offset == +width.replace(/\D/g, '') * (offerSlides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.replace(/\D/g, '');
        }
        slideIndex++
        slideIndex = slideIndex <= offerSlides.length ? slideIndex : 1;
        currentNumber.innerHTML = slideIndex < 10 ? `0${slideIndex}` :  slideIndex;

        sliderField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    offerSlidePrev.addEventListener('click', () => {
        if (offset == 0 ) {
            offset = +width.replace(/\D/g, '') * (offerSlides.length - 1);
        } else {
            offset -= +width.replace(/\D/g, '');
        }
        slideIndex--
        slideIndex = slideIndex > 0 ? slideIndex : offerSlides.length;
        currentNumber.innerHTML = slideIndex < 10 ? `0${slideIndex}` :  slideIndex;

        sliderField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    const clickDot = (event) => {
        const index = event.target.getAttribute('data-slide-to');
        offset = +width.replace(/\D/g, '') * (index - 1);
        slideIndex = index;
        currentNumber.innerHTML = slideIndex < 10 ? `0${slideIndex}` :  slideIndex;
        sliderField.style.transform = `translateX(-${offset}px)`;
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    };

    dots.forEach( dot => dot.addEventListener("click", clickDot));

});