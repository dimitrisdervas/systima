window.Parsley.on('field:error', function() {
  /* This global callback will be called for any field that fails validation. */
/*   console.log('Validation failed for: ', this.$element); */
  $(this.$element).addClass('invalid')
});