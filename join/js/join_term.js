const chkAll = document.getElementById("chk-all");
const chkboxs = document.querySelectorAll(".join-term-form input[type='checkbox']:not(#chk-all)");
const requiredChks = Array(...chkboxs).filter(chk => chk.required);

const chkMarketingAll = document.getElementById("chk-marketing-all");
const chkMarketings = document.querySelectorAll(".marketing-sub-box input[type='checkbox'");

chkAll.addEventListener("click", () => {
  let checked = chkAll.checked;
  chkboxs.forEach(chkbox => chkbox.checked = checked);
});

chkboxs.forEach(chkbox => {
  chkbox.addEventListener("change", () => {
    if (!chkbox.checked) {
      chkAll.checked = false;
    }
    else {        
      chkAll.checked = Array(...chkboxs).every(chk => chk.checked);
    }
  });
});

chkMarketingAll.addEventListener("click", () => {
  let checked = chkMarketingAll.checked;
  chkMarketings.forEach(chkbox => chkbox.checked = checked);
});

chkMarketings.forEach(chkbox => {
  chkbox.addEventListener("change", () => {
    if (!chkbox.checked) {
      chkMarketingAll.checked = false;
    }
    else {
      let allChecked = Array(...chkMarketings).every(chk => chk.checked);
      
      if (allChecked) {
        chkMarketingAll.checked = true;
        chkAll.checked = Array(...requiredChks).every(chk => chk.checked);
      }
    }
  });
});