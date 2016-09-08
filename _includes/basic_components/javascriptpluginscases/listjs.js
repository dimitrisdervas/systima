// Add the name of the classes to serach within for words
// http://codepen.io/jamesbarnett/pen/kcwzq
var options = {
  valueNames: [ 

     {% for element in include.listjsData.filters %}
        {% if element.element == 'all' or element.element == 'none'%}
            {% else %}
            '{{ element.element }}'
            {% unless forloop.last %},{% endunless %}
          {% endif %}
      {% endfor %}

  ]
};
   // ID of the container <div> - Assign the list to Listjs 
   var featureList = new List('testlistsjs', options);  
   // copied from here
   // http://pastebin.com/UPB095pk also in test.html
   // Create a listsjs Filter for each category

{% for element in include.listjsData.filters %}

  // Check for filter All or None
      {% if element.element == 'all' or element.element == 'none'%}
       {% for filter in element.categories %} 
            $('#filter-{{ filter.filter | slugify }}').click(function() {
                  featureList.filter();
               });
        {% endfor %}  
      {% else %}
      
         {% for filter in element.categories %} 
                   $('#filter-{{ filter.filter | slugify }}').click(function() {
                      featureList.filter(function(item) {
                         if (item.values().{{ element.element }} == "{{ filter.filter }}") {
                            return true;
                         } else {
                            return false;
                         }
                      });
                      return false;
                   });
             {% endfor %}  
       
     {% endif %}         
                    
  {% endfor %}
  
  
         
