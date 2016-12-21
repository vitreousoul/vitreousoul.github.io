var footerElm = $('#footer-wrap');
var mainContentElm = $('#main-content-wrap');
var footerOffsetBottom = footerElm.offset().top + footerElm.outerHeight();

if (footerOffsetBottom < $(document).height()) {
  var footerOffsetBottomDelta = window.innerHeight - footerOffsetBottom;

  mainContentElm.css({
    'minHeight': mainContentElm.outerHeight() + footerOffsetBottomDelta
  });
}
