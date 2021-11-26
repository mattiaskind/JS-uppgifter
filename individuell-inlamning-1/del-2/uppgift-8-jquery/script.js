$(document).ready(function () {
  $('#fade-btn').click(function () {
    $('#fade-content').fadeIn('slow');
  });

  $('#animate-container').click(function () {
    $('#move').animate({
      left: '500px',
    });
  });

  $('#hover').hover(
    function () {
      $('#hover').animate({
        'border-radius': '50%',
      });
    },
    function () {
      $('#hover').animate({
        'border-radius': '0',
      });
    }
  );

  $('#header').click(function () {
    $('#text').toggle();
  });

  //click och toggle
});
