---
---

{% for plugin in site.data.pluginsSourceFiles.jsSourceFiles %}
   {% if plugin.state == 'active' %}
     {% include {{ plugin.js }} %} 
   {% endif%}
{% endfor %}

