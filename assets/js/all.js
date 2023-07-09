"use strict";

window.addEventListener('scroll', scrollHandler, {
  passive: true
}); //aos 會加上 throttle

init();

function init() {
  navbarTransformer();
}

function scrollHandler(e) {
  navbarTransformer();
}

function navbarTransformer() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var navbar = $('.navbar');
  var buttons = $('.navbar .btn');
  if (navbar.length === 0) return;

  if (scrollTop == 0) {
    navbar.removeClass('py-0').addClass('py-5');
    buttons.removeClass('btn-sm');
  }

  if (scrollTop > 10) {
    navbar.css('zIndex', 100).removeClass('py-5').addClass('py-0');
    buttons.addClass('btn-sm');
  }
} //判斷視窗大小


var Detector = function () {
  var width;
  var detector = {};

  var getWidth = function getWidth() {
    width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  };

  detector.resize = function () {
    getWidth();
  };

  detector.isPhone = function () {
    return width < 768;
  };

  detector.isPad = function () {
    return width >= 768 && width < 992;
  };

  detector.isDesktop = function () {
    return width >= 992;
  };

  getWidth();
  return detector;
}(); //表單驗證


var FormValidator = function () {
  'use strict';

  var constraints = {
    "name": {
      presence: {
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
      presence: {
        message: "^此欄位為必填"
      },
      // Email 是必填欄位
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
  var publicAPIs = {
    /**
     * @param {JQuery} form 
     * @returns {Object}
     */
    validateForm: function validateForm(form) {
      var errors = validate(form, constraints) || {};
      this.toggleErrors(form, errors);
      return errors;
    },

    /**
     * 
     * @param {JQuery} input 
     * @param {JQuery} form 
     * @returns {Array}
     */
    validateInput: function validateInput(input, form) {
      if (!input.prop('name')) return [];
      var errors = validate(form, constraints) || {};
      var errorForInput = errors[input.prop('name')] || [];
      this.toggleErrorsForInput(input, errorForInput);
      return errorForInput;
    },
    toggleErrors: function toggleErrors(form) {
      var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var inputs = $('input', form);
      var t = this;
      inputs.each(function () {
        var input = $(this);
        t.toggleErrorsForInput(input, errors[input.prop('name')]);
      });
    },
    toggleErrorsForInput: function toggleErrorsForInput(input) {
      var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (input.length === 0) return;
      var messageEl = findMessageElement(input);
      if (messageEl.length === 0) return;
      var msg = '';
      errors.forEach(function (txt) {
        return msg += (msg.length > 0 ? '<br>' : '') + txt;
      });
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
}(); //練習看看 IIFE


var reservationInit = function () {
  if (!window.location.pathname.endsWith('/reservation_step1.html')) return;
  var reservationCards = $('.reservationCard');
  var levelCards = $('.levelCard');
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var selectedClass = urlParams.get('class');
  $(window).on('click', function (e) {
    var target = $(e.target);

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
    var cancelSelected = target.hasClass('active');

    if (cancelSelected) {
      reservationCards.each(function () {
        var card = $(this);
        card.removeClass('active outline-primary-4 d-none');
      });
      $('#reservationDetail').addClass('d-none');
      $('#reservationStep1_nextStepBtnContainer').addClass('d-none');
    } else {
      reservationCards.each(function () {
        var card = $(this);

        if (card.is(target)) {
          //activate
          card.addClass('active outline-primary-4');
        } else {
          //deactivate
          card.removeClass('active outline-primary-4');
          if (!Detector.isDesktop()) card.addClass('d-none');
        }
      });
      $('#reservationDetail').removeClass('d-none');
      $('#reservationDetail')[0].scrollIntoView({
        behavior: 'smooth'
      });
      $('#reservationStep1_nextStepBtnContainer').removeClass('d-none'); //自動選擇第一個 level

      selectLevelCard($(levelCards[0]));
      deselectLevelCard($(levelCards[1]));
      deselectLevelCard($(levelCards[2]));
      updateChosenClassText();
    }
  }

  function levelCardClickHandler(target) {
    if (target.hasClass('active')) return;
    levelCards.each(function () {
      var card = $(this);

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
    var checkIcon = $('.fa-check-circle', card);
    checkIcon.removeClass('opacity-25');
  }

  function deselectLevelCard(card) {
    card.removeClass('active border-white');
    card.addClass('border-primary');
    var checkIcon = $('.fa-check-circle', card);
    checkIcon.addClass('opacity-25');
  }

  function updateChosenClassText() {
    var activeReservationCard = reservationCards.filter('.active');
    if (!activeReservationCard) return;
    var activeLevelCard = levelCards.filter('.active');
    var text = "".concat(activeReservationCard.data('value'), " - ").concat(activeLevelCard.data('value'));
    $('#reservation_chosenClass').text(text);
    localStorage.setItem('revervationInfo', JSON.stringify({
      "class": text
    }));
  }

  if (selectedClass) {
    var card = $("[data-qs=".concat(selectedClass, "]"));
    card.trigger('click');
  }
}(); //預約表單


var formInit = function () {
  var form = $('#reservationForm');
  if (form.length === 0) return;
  form.on('input', function (e) {
    var target = $(e.target);
    var validateErrors = [];

    if (!target.is('[type=radio]') || !target.is('[type=checkbox]') || !target.is('select')) {
      validateErrors = FormValidator.validateInput(target, form);
    }

    collectFormInfo();
  });
  form.on('submit', function (e) {
    e.preventDefault();
    var errors = FormValidator.validateForm(form);
    var errorKeys = Object.keys(errors);

    if (errorKeys.length === 0) {
      window.location.href = './reservation_step3.html';
    } else {
      //找出格式不正確的欄位，移動過去，用 animate 強調
      var firstErrorName = errorKeys[0];
      var inputEl = $("[name=".concat(firstErrorName, "]"), form);
      var messageEl = inputEl.next('.message');
      inputEl[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      messageEl.on('animationend', function () {
        $(this).removeClass('animate-shakeX');
      });
      messageEl.addClass('animate-shakeX');
    }
  });
  restoreFormInfo();

  function collectFormInfo() {
    //整理表單資訊並存成 JSON
    var formInfo = {};
    var checkedItems;
    var field;

    if (localStorage.getItem('revervationInfo')) {
      try {
        formInfo = JSON.parse(localStorage.getItem('revervationInfo'));
      } catch (error) {}
    }

    checkedItems = $('[name=learnedYoga]:checked', form);
    formInfo['learnedYoga'] = checkedItems[0].id;
    checkedItems = $('#reservation_problem [type=checkbox]:checked');
    var problemArr = [];
    checkedItems.each(function () {
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
    var formInfoStr = localStorage.getItem('revervationInfo');
    if (!formInfoStr) return;
    var formInfo = JSON.parse(formInfoStr);
    var value;
    value = formInfo['learnedYoga'];
    $("#".concat(value)).prop('checked', true);
    var problemArr = formInfo['problem'] || [];
    problemArr.forEach(function (id) {
      $("#".concat(id)).prop('checked', true);
    });
    value = formInfo['excerciseTime'];
    $("#".concat(value)).prop('checked', true);
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
}(); //預約完成


(function () {
  if (!window.location.pathname.endsWith('/reservation_step3.html')) return;
  var formInfoStr = localStorage.getItem('revervationInfo');
  if (!formInfoStr) return;
  var formInfo = {};
  var value;

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
})(); //aos pre-init


(function () {
  if (Detector.isDesktop() || Detector.isPad()) {
    //md-up
    var elements = $('[data-aos-md-up-delay]');
    elements.each(function () {
      var el = $(this);
      el.attr('data-aos-delay', el.attr('data-aos-md-up-delay'));
    });
  }

  if (Detector.isDesktop()) {
    //lg-up
    var _elements = $('[data-aos-lg-up-delay]');

    _elements.each(function () {
      var el = $(this);
      el.attr('data-aos-delay', el.attr('data-aos-lg-up-delay'));
    });
  }
})();

AOS.init({
  duration: 1000,
  once: true
});
var swiper = new Swiper('.recommandationSwiper', {
  // Optional parameters
  slidesPerView: 1,
  //grid 不能和 loop 一起使用
  grid: {
    rows: 3
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
        fill: 'row'
      }
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      //雖然以下跟 768 的設定都是一樣的，但如果不寫的話不知為何版面會跑掉
      spaceBetween: 16,
      grid: {
        rows: 2,
        fill: 'row'
      }
    }
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});
var classesSwiper = new Swiper(".classesSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 5000
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
  }
});
var teacherSwiper = new Swiper('.teacherSwiper', {
  // Optional parameters
  slidesPerView: 1,
  //grid 不能和 loop 一起使用
  grid: {
    rows: 4
  },
  spaceBetween: 24,
  autoplay: {
    delay: 5000
  },
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
      grid: {
        rows: 1
      }
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      //雖然以下跟 768 的設定都是一樣的，但如果不寫的話不知為何版面會跑掉
      spaceBetween: 30,
      grid: {
        rows: 1
      }
    }
  }
});
//# sourceMappingURL=all.js.map
