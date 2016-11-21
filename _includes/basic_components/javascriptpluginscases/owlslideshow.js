var owl = $('#{{ component.data.wrapperDiv.theme.id }}');
owl.owlCarousel({
   {% for owlData in include.slideshowOwlData %}
         {{ owlData[0] }} : {{ owlData[1]}} {% unless forloop.last%},{% endunless%}
       {% endfor %}
    })
