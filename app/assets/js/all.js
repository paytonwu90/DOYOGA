window.addEventListener('scroll', scrollHandler); //aos 會加上 throttle
init();


function init() {
  navbarTransformer();
}
function scrollHandler(e) {
  navbarTransformer();
}
function navbarTransformer() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const navbar = document.querySelector('.navbar');
  const buttons = document.querySelectorAll('.navbar .btn');
  if (scrollTop == 0) {
    if (navbar) {
      navbar.classList.remove('py-0');
      navbar.classList.add('py-5');
    }
    buttons.forEach(btn => btn.classList.remove('btn-sm'));
  }
  if (scrollTop > 10) {
    if (navbar) {
      navbar.style.zIndex = '100';
      navbar.classList.remove('py-5');
      navbar.classList.add('py-0');
    }
    buttons.forEach(btn => btn.classList.add('btn-sm'));
  }
}


//判斷視窗大小
const Detector = (function () {
  let width;
  
  const detector = {};

  const getWidth = () => {
    width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  }

  detector.resize = () => {
    getWidth();
  }

  detector.isPhone = () => {
    return width < 768;
  }

  detector.isPad = () => {
    return width >= 768 && width < 992;
  }

  detector.isDesktop = () => {
    return width >= 992;
  }

  getWidth();

  return detector;
})();

/**
 * Adds multiple classes on node
 * @param {DOMNode} node 
 * @param {array} classes 
 */
const addClasses = (node, classes) => {
  classes && classes.forEach(className => node.classList.add(className));
}

/**
 * Removes multiple classes from node
 * @param {DOMNode} node 
 * @param {array} classes 
 */
const removeClasses = (node, classes) => {
  classes && classes.forEach(className => node.classList.remove(className));
}


//練習看看 IIFE
const reservationInit = (function () {
  if (window.location.pathname !== '/reservation_step1.html') return;
  const reservationCards = $('.reservationCard').get(); //jQuery, returns array
  const levelCards = $('.levelCard').get();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const selectedClass = urlParams.get('class');

  reservationCards.forEach(el => {
    el.addEventListener('click', e => {
      const it = el;
      const cancelSelected = it.classList.contains('active');

      reservationCards.forEach(card => {
        if (cancelSelected) {
          card.classList.remove('active', 'outline-primary-4');
          card.classList.remove('d-none');
          $('#reservationDetail')[0].classList.add('d-none')
          $('#reservationStep1_nextStepBtnContainer')[0].classList.add('d-none');
        }
        else {
          if (card === it) {
            //activate
            card.classList.add('active', 'outline-primary-4');
          }
          else {
            //deactivate
            card.classList.remove('active', 'outline-primary-4');
            if (!Detector.isDesktop()) card.classList.add('d-none');
          }
          $('#reservationDetail')[0].classList.remove('d-none');
          $('#reservationDetail')[0].scrollIntoView({ behavior: 'smooth'});
          $('#reservationStep1_nextStepBtnContainer')[0].classList.remove('d-none');

          //自動選擇第一個 level
          selectLevelCard(levelCards[0]);
          deselectLevelCard(levelCards[1]);
          deselectLevelCard(levelCards[2]);
          updateChosenClassText();
        }
      });

    });
  });

  levelCards.forEach(el => {
    el.addEventListener('click', e => {
      const it = el;
      if (it.classList.contains('active')) return;

      levelCards.forEach(card => {
        if (card === it) {
          selectLevelCard(card);
        } else {
          deselectLevelCard(card);
        }
      });

      updateChosenClassText();
    });
  });

  function selectLevelCard(card) {
    card.classList.remove('border-primary');
    card.classList.add('active', 'border-white');
    const checkIcon = card.querySelector('.fa-check-circle');
    checkIcon.classList.remove('opacity-25');
  }
  function deselectLevelCard(card) {
    card.classList.remove('active', 'border-white');
    card.classList.add('border-primary');
    const checkIcon = card.querySelector('.fa-check-circle');
    checkIcon.classList.add('opacity-25');
  }

  function updateChosenClassText() {
    let text = '';
    const activeReservationCard = reservationCards.find(card => card.classList.contains('active'));
    if (!activeReservationCard) return;
    const activeLevelCard = levelCards.find(card => card.classList.contains('active'));
    
    //text = activeReservationCard.dataset.value + '-' + activeLevelCard.dataset.value;
    text = `${activeReservationCard.dataset.value} - ${activeLevelCard.dataset.value}`;
    $('#reservation_chosenClass')[0].textContent = text;
  }

  if (selectedClass) {
    const card = document.querySelector(`[data-qs=${selectedClass}]`);
    card.click();
  }
})();



//aos pre-init
(function() {
  if (Detector.isDesktop() || Detector.isPad()) {
    //md-up
    let elements = document.querySelectorAll('[data-aos-md-up-delay]');
    elements.forEach(el => {
      if (el.dataset['aosMdUpDelay']) el.dataset['aosDelay'] = el.dataset['aosMdUpDelay'];
    });
  }
  if (Detector.isDesktop()) {
    //lg-up
    let elements = document.querySelectorAll('[data-aos-lg-up-delay]');
    elements.forEach(el => {
      if (el.dataset['aosLgUpDelay']) el.dataset['aosDelay'] = el.dataset['aosLgUpDelay'];
    });
  }
})();

AOS.init({
  duration: 1000,
  once: true
});




const swiper = new Swiper('.recommandationSwiper', {
  // Optional parameters
  slidesPerView: 1,
  //grid 不能和 loop 一起使用
  grid: {
    rows: 3,
  },
  spaceBetween: 8,
  /* autoplay: {
    delay: 5000,
  }, */
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      spaceBetween: 16,
      grid: {
        rows: 2,
        fill: 'row',
      }
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      //雖然以下跟 768 的設定都是一樣的，但如果不寫的話不知為何版面會跑掉
      spaceBetween: 16,
      grid: {
        rows: 2,
        fill: 'row',
      }
    }
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const classesSwiper = new Swiper(".classesSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 3
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 4
    }
  },
});

const teacherSwiper = new Swiper('.teacherSwiper', {
  // Optional parameters
  slidesPerView: 1,
  //grid 不能和 loop 一起使用
  grid: {
    rows: 4,
  },
  spaceBetween: 24,
  /* autoplay: {
    delay: 5000,
  }, */
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
      grid: {
        rows: 1,
      },
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      //雖然以下跟 768 的設定都是一樣的，但如果不寫的話不知為何版面會跑掉
      spaceBetween: 30,
      grid: {
        rows: 1,
      }
    }
  }
});