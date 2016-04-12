---
---

{% for plugin in site.data.pluginssourcefiles.jssourcefiles %}
   {% if plugin.state == 'active' %}
     {% include {{ plugin.js }} %}
   {% endif%}
{% endfor %}
