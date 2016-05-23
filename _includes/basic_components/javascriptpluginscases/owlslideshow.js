var owl = $('#{{ component.data.wrapperDiv.theme.id }}');
owl.owlCarousel({
   {% for owlData in include.slideshowOwlData %}
         {{ owlData[0] }} : {{ owlData[1]}} {% unless forloop.last%},{% endunless%}
       {% endfor %}
    });

$('.play').on('click',function(){
    owl.trigger('autoplay.play.owl',[1000])
})
$('.pause').on('click',function(){
    owl.trigger('autoplay.stop.owl')
})

// Go to the next item
$('.next').click(function() {
    owl.trigger('next.owl.carousel');
})
// Go to the previous item
$('.previous').click(function() {
    // With optional speed parameter
    // Parameters has to be in square bracket '[]'
    owl.trigger('prev.owl.carousel', [300]);
})