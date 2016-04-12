---
title: ΒΙΒΛΙΑ-ΒΟΗΘΗΜΑΤΑ ΕΚΔΟΣΕΙΣ ΜΠΟΥΡΝΤΑ-ΛΟΥΚΙΔΟΥ Ο.Ε.
layout: default
config:
 - section:
    data:
      htmlelement: section
    theme:
      class: textarea
   divs:
      - div:
         theme:
          class: preface
        components:
         - component: one-post
           data:
             data-type: collection
             content-type: other
             post-title: "publications-preface"
             fields:
              - field: content       
      - div:
         theme:
          class: books block
        components:
         - component: posts-list 
           data:
             data-type: data-list
             content-type: publications
             fields:
             - field: group
               class: book-group
               fields:
                - field: image
                  data:
                   images-path: /assets/images/publications/
                   image-hash: image
                   class: book-image
                - field: title
                  data:
                   element: div
                   class: book-title
                - field: author
css: |
   header {
   background: url("/systima/assets/images/blackboard.jpg") no-repeat; 
   background-size: cover; 
   }
   .books {
   background: url("/systima/assets/images/blackboard.jpg") no-repeat; 
   background-size: cover; 
   padding: 6% 4%;
   color: #fff;
   }
   .book-group {
   margin-bottom: 15%;
   }
   .book-title {
   font-weight: bold;
   @include t-h4;
   }
   /* Fallback styles  - http://codepen.io/jasondavis/pen/szbDf */
   .book-image {
   box-shadow: 0 2px 7.68px .32px rgba(0, 0, 0, 0.4),0 12px 26px 0 rgba(0, 0, 0, 0.4);
   max-width: 200px;
   }
---
{% include basic_components/page.html %}