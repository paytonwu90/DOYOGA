window.addEventListener('scroll', scrollHandler, {passive: true}); //aos 會加上 throttle
init();


function init() {
  navbarTransformer();
}
function scrollHandler(e) {
  navbarTransformer();
}
function navbarTransformer() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const navbar = $('.navbar');
  const buttons = $('.navbar .btn');
  if (navbar.length === 0) return;
  if (scrollTop == 0) {
    navbar.removeClass('py-0').addClass('py-5');
    buttons.removeClass('btn-sm');
  }
  if (scrollTop > 10) {
    navbar.css('zIndex', 100).removeClass('py-5').addClass('py-0');
    buttons.addClass('btn-sm');
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

//表單驗證
const FormValidator = (function() {
  'use strict';

  const constraints = {
    "name": {
      presence:  {
        message: "^此欄位為必填"
      }
    },
    "age": {
      numericality: {
        onlyInteger: true,
        strict: true,
        greaterThan: 0,
        notValid: '^請填入正確年齡',
        notInteger: '^請填入正確年齡',
        notGreaterThan: '^請填入正確年齡'
      }
    },
    "email": {  
      presence:  {
        message: "^此欄位為必填"
      }, // Email 是必填欄位
      email: {
        message: "^不符合 Email 格式"
      } // 需要符合 email 格式
    },
    "phone": {
      format: {
        pattern: "09[0-9]{8}",
        message: "^請填入正確的手機格式"
      }
    }
  };

  const publicAPIs = {
    /**
     * @param {JQuery} form 
     * @returns {Object}
     */
    validateForm: function(form) {
      const errors = validate(form, constraints) || {};
      this.toggleErrors(form, errors);
      return errors;
    },

    /**
     * 
     * @param {JQuery} input 
     * @param {JQuery} form 
     * @returns {Array}
     */
    validateInput: function(input, form) {
      if (!input.prop('name')) return [];
      const errors = validate(form, constraints) || {};
      const errorForInput = errors[input.prop('name')] || [];
      this.toggleErrorsForInput(input, errorForInput);
      return errorForInput;
    },

    toggleErrors: function(form, errors = {}) {
      const inputs = $('input', form);
      const t = this;
      inputs.each(function() {
        const input = $(this);
        t.toggleErrorsForInput(input, errors[input.prop('name')]);
      });
    },

    toggleErrorsForInput: function(input, errors = []) {
      if (input.length === 0) return;
      const messageEl = findMessageElement(input);
      if (messageEl.length === 0) return;
      let msg = '';
      errors.forEach(txt => msg += (msg.length > 0 ? '<br>' : '') + txt);
      messageEl.html(msg);
    }
  };

  /**
   * find correspoding `message` element of specific input
   * @param {JQuery} el JQuery object of input element
   * @returns {JQuery} message element
   */
  function findMessageElement(el) {
    if (!el) return;
    return el.next('.message');
  }


  return publicAPIs;
})();

//練習看看 IIFE
const reservationInit = (function () {
  if (!window.location.pathname.endsWith('/reservation_step1.html')) return;
  const reservationCards = $('.reservationCard');
  const levelCards = $('.levelCard')
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const selectedClass = urlParams.get('class');

  $(window).on('click', function(e) {
    const target = $(e.target);
    if (target.hasClass('reservationCard')) {
      reservationCardClickHandler(target);
    }
    if (target.hasClass('reservationCard-btn')) {
      reservationCardClickHandler(target.closest('.reservationCard'));
    }
    if (target.hasClass('levelCard')) {
      levelCardClickHandler(target);
    }
    if (target.hasClass('levelCard-btn')) {
      levelCardClickHandler(target.closest('.levelCard'));
    }
  });

  function reservationCardClickHandler(target) {
    const cancelSelected = target.hasClass('active');
    if (cancelSelected) {
      reservationCards.each(function() {
        const card = $(this);
        card.removeClass('active outline-primary-4 d-none')
      });
      $('#reservationDetail').addClass('d-none')
      $('#reservationStep1_nextStepBtnContainer').addClass('d-none');
    }
    else {
      reservationCards.each(function() {
        const card = $(this);
        if (card.is(target)) {
          //activate
          card.addClass('active outline-primary-4');
        }
        else {
          //deactivate
          card.removeClass('active outline-primary-4');
          if (!Detector.isDesktop()) card.addClass('d-none');
        }
      });
      $('#reservationDetail').removeClass('d-none');
      $('#reservationDetail')[0].scrollIntoView({ behavior: 'smooth'});
      $('#reservationStep1_nextStepBtnContainer').removeClass('d-none');

      //自動選擇第一個 level
      selectLevelCard($(levelCards[0]));
      deselectLevelCard($(levelCards[1]));
      deselectLevelCard($(levelCards[2]));
      updateChosenClassText();
    }
  }

  function levelCardClickHandler(target) {
    if (target.hasClass('active')) return;

    levelCards.each(function() {
      let card = $(this);
      if (card.is(target)) {
        selectLevelCard(card);
      } else {
        deselectLevelCard(card);
      }
    });
    updateChosenClassText();
  }

  function selectLevelCard(card) {
    card.removeClass('border-primary');
    card.addClass('active border-white');
    const checkIcon = $('.fa-check-circle', card);
    checkIcon.removeClass('opacity-25');
  }
  function deselectLevelCard(card) {
    card.removeClass('active border-white');
    card.addClass('border-primary');
    const checkIcon = $('.fa-check-circle', card);
    checkIcon.addClass('opacity-25');
  }

  function updateChosenClassText() {
    const activeReservationCard = reservationCards.filter('.active');
    if (!activeReservationCard) return;
    const activeLevelCard = levelCards.filter('.active');
    
    const text = `${activeReservationCard.data('value')} - ${activeLevelCard.data('value')}`;
    $('#reservation_chosenClass').text(text);
    localStorage.setItem('revervationInfo', JSON.stringify({class: text}));
  }

  if (selectedClass) {
    const card = $(`[data-qs=${selectedClass}]`);
    card.trigger('click');
  }
})();

//預約表單
const formInit = (function() {
  const form = $('#reservationForm');
  if (form.length === 0) return;

  form.on('input', function(e) {
    const target = $(e.target);
    let validateErrors = [];
    if (!target.is('[type=radio]') || !target.is('[type=checkbox]') || !target.is('select')) {
      validateErrors = FormValidator.validateInput(target, form);
    }
    collectFormInfo();
  });

  form.on('submit', function(e) {
    e.preventDefault();
    const errors = FormValidator.validateForm(form);
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) {
      window.location.href = './reservation_step3.html';
    }
    else {
      //找出格式不正確的欄位，移動過去，用 animate 強調
      const firstErrorName = errorKeys[0];
      const inputEl = $(`[name=${firstErrorName}]`, form);
      const messageEl = inputEl.next('.message');
      inputEl[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageEl.on('animationend', function() {
        $(this).removeClass('animate-shakeX');
      });
      messageEl.addClass('animate-shakeX');
    }
  });

  restoreFormInfo();

  function collectFormInfo() {
    //整理表單資訊並存成 JSON
    let formInfo = {};
    let checkedItems;
    let field;

    if (localStorage.getItem('revervationInfo')) {
      try {
        formInfo = JSON.parse(localStorage.getItem('revervationInfo'));
      } catch (error) {}
    }

    checkedItems = $('[name=learnedYoga]:checked', form);
    formInfo['learnedYoga'] = checkedItems[0].id;

    checkedItems = $('#reservation_problem [type=checkbox]:checked');
    let problemArr = [];
    checkedItems.each(function() {
      problemArr.push(this.id);
    });
    formInfo['problem'] = problemArr;

    checkedItems = $('[name=excerciseTime]:checked', form);
    formInfo['excerciseTime'] = checkedItems[0].id;

    field = $('#reservation_checkinDate');
    formInfo['checkinDate'] = field.val();

    field = $('#reservation_name');
    formInfo['name'] = field.val();

    field = $('#reservation_age');
    formInfo['age'] = field.val();

    field = $('#reservation_gender');
    formInfo['gender'] = field.val();

    field = $('#reservation_email');
    formInfo['email'] = field.val();

    field = $('#reservation_phone');
    formInfo['phone'] = field.val();

    localStorage.setItem('revervationInfo', JSON.stringify(formInfo));
  }

  function restoreFormInfo() {
    const formInfoStr = localStorage.getItem('revervationInfo');
    if (!formInfoStr) return;

    const formInfo = JSON.parse(formInfoStr);
    let value;

    value = formInfo['learnedYoga'];
    $(`#${value}`).prop('checked', true);

    let problemArr = formInfo['problem'] || [];
    problemArr.forEach(id => {
      $(`#${id}`).prop('checked', true);
    });

    value = formInfo['excerciseTime'];
    $(`#${value}`).prop('checked', true);

    value = formInfo['checkinDate'];
    if (value) $('#reservation_checkinDate').val(value);

    value = formInfo['name'];
    if (value) $('#reservation_name').val(value);

    value = formInfo['age'];
    if (value) $('#reservation_age').val(value);

    value = formInfo['gender'];
    if (value) $('#reservation_gender').val(value);

    value = formInfo['email'];
    if (value) $('#reservation_email').val(value);

    value = formInfo['phone'];
    if (value) $('#reservation_phone').val(value);
  }
})();

//預約完成
(function() {
  if (!window.location.pathname.endsWith('/reservation_step3.html')) return;

  const formInfoStr = localStorage.getItem('revervationInfo');
  if (!formInfoStr) return;

  let formInfo = {};
  let value;
  try {
    formInfo = JSON.parse(formInfoStr);
  } catch (error) {}

  value = formInfo['class'];
  if (value) $('#reservationConfirm_class').text(value);

  value = formInfo['checkinDate'];
  $('#reservationConfirm_checkinDate').text(value ? value : '未填寫');

  value = formInfo['name'];
  $('#reservationConfirm_name').text(value ? value : '未填寫');

  value = formInfo['age'];
  $('#reservationConfirm_age').text(value ? value + ' 歲' : '未填寫');

  value = formInfo['gender'];
  $('#reservationConfirm_gender').text(value ? value : '未填寫');

  value = formInfo['email'];
  $('#reservationConfirm_email').text(value ? value : '未填寫');

  value = formInfo['phone'];
  $('#reservationConfirm_phone').text(value ? value : '未填寫');
})();



//aos pre-init
(function() {
  if (Detector.isDesktop() || Detector.isPad()) {
    //md-up
    let elements = $('[data-aos-md-up-delay]');
    elements.each(function() {
      const el = $(this);
      el.attr('data-aos-delay', el.attr('data-aos-md-up-delay'));
    });
  }
  if (Detector.isDesktop()) {
    //lg-up
    let elements = $('[data-aos-lg-up-delay]');
    elements.each(function() {
      const el = $(this);
      el.attr('data-aos-delay', el.attr('data-aos-lg-up-delay'));
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
  autoplay: {
    delay: 5000,
  },
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