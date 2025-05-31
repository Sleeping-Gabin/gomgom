//swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  speed: 500,
  effect: "slide",

  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    hiddenClass: 'swiper-button-hidden',
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  on: {
    slideChangeTransitionEnd: s => {
      let slide = s.slides[s.activeIndex];
      let txt = $(slide).find(".visual-txt");
      let btn = $(slide).find(".visual-enter-btn");

      txt.stop().animate({
        top: "90px",
        opacity: 1,
      }, 200);

      btn.stop().animate({
        bottom: "120px",
        opacity: 1,
      }, 200);
    },

    slideChangeTransitionStart	: s => {
      let slide = s.slides[s.activeIndex];
      let txt = $(slide).find(".visual-txt");
      let btn = $(slide).find(".visual-enter-btn");

      txt.css("top", "120px").css("opacity", 0);
      btn.css("bottom", "90px").css("opacity", 0);
    }
  },
});


//navigation을 마우스 올렸을 때만 보이게
const visualMain = $(".visual-main");
const nextBtn = $(swiper.navigation.nextEl);
const prevBtn = $(swiper.navigation.prevEl);


visualMain.on("mouseenter", function() {
  nextBtn.removeClass('swiper-button-hidden');
  prevBtn.removeClass('swiper-button-hidden');
});

visualMain.on("mouseleave", function() {
 nextBtn.addClass('swiper-button-hidden');
  prevBtn.addClass('swiper-button-hidden');
});