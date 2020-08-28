
$(document).ready(function(){

  $('#carousel-thumb').on('slide.bs.carousel', function () {
    $("#carousel-info-label").hide();
  })

  $('#carousel-thumb').on('slid.bs.carousel', function () {
    $("#carousel-info-label").show();
  })
});
