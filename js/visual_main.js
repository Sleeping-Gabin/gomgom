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
    slideChangeTransitionEnd: function(s) { //슬라이드 변경 후 글자 애니메이션
      let slide = s.slides[s.activeIndex];
      let txt = slide.querySelector(".visual-txt");
      let btn = slide.querySelector(".visual-enter-btn");
      
      txt.style.top = "90px";
      txt.style.opacity = "1";

      btn.style.bottom = "120px";
      btn.style.opacity = "1";
    },

    slideChangeTransitionStart	: function(s) { //글자 위치 초기화
      let slide = s.slides[s.activeIndex];
      let txt = slide.querySelector(".visual-txt");
      let btn = slide.querySelector(".visual-enter-btn");
      
      txt.style.top = "120px";
      txt.style.opacity = "0";

      btn.style.bottom = "90px";
      btn.style.opacity = "0";
    },
  },
});


//navigation을 마우스 올렸을 때만 보이게
const visualMain = document.querySelector(".visual-main");
const nextBtn = swiper.navigation.nextEl;
const prevBtn = swiper.navigation.prevEl;

visualMain.addEventListener("mouseenter", function() {
  nextBtn.classList.remove("swiper-button-hidden");
  prevBtn.classList.remove("swiper-button-hidden");
});

visualMain.addEventListener("mouseleave", function() {
  nextBtn.classList.add("swiper-button-hidden");
  prevBtn.classList.add("swiper-button-hidden");
});