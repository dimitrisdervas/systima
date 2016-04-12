---
---

{% for plugin in site.data.pluginssourcefiles.jsSourceFiles %}
   {% if plugin.state == 'active' %}
     {% include {{ plugin.js }} %} 
   {% endif%}
{% endfor %}

