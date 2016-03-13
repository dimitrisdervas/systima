var feed = new Instafeed({
   get: 'tagged',
   tagName: '{{ site.data.instagram.tagName }}',
   clientId: '{{ site.data.instagram.clientId }}',
   template: '{{ site.data.instagram.templateImg }}'
});
feed.run();
