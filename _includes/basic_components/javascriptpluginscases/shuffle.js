var Shuffle = window.shuffle;
var element = document.getElementById('teachers');


var shuffle = new Shuffle(element, {
  itemSelector: '.teacher-group',
});

/* initialize shuffle plugin */
var $grid = $('#teachers');
 

$('#filter a').click(function (e) {
e.preventDefault();
 
// set active class
$('#filter a').removeClass('active');
$(this).addClass('active');
 
// get group name from clicked item
var groupName = $(this).attr('data-group');