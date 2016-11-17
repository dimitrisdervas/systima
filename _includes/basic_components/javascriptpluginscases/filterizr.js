//Default options
var options = {
   animationDuration: 0.5, //in seconds
   filter: 'all', //Initial filter
   delay: 0, //Transition delay in ms
   delayMode: 'progressive', //'progressive' or 'alternate'
   easing: 'ease-out',
   filterOutCss: { //Filtering out animation
        "opacity": 0,
        "transform": "scale(0.75)"
   },
   filterInCss: { //Filtering in animation
        "opacity": 1,
        "transform": "scale(1)"
   },
   layout: 'sameWidth', //See layouts
   selector: '.filtr-container',
   setupControls: true 
} 

var filterizd = $('#teachers').filterizr(options);

$('.filters li').click(function() {
    $('.filters li').removeClass('active');
    $(this).addClass('active');
});