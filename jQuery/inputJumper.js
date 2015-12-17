/* Usage:
  Define form and inputs with maxlengths:
  <form id="your-form-id">
    <input type="text" maxlength="1">
    <input type="text" maxlength="2">
    <input type="text" maxlength="3">
  </form>
  
  Target your form as such: 
  $('#your-form-id').inputJumper();
*/

$.fn.inputJumper = function() {
    var form = $(this);
    return form.find(':input').each(function() {
        $(this).on('keyup', function() {
            var max = parseInt($(this).attr('maxlength'));
            var field = form.find(':input');
            if ($(this).val().length === max) {
                field.eq(field.index(this) + 1).focus();
            }
        });
    });
};
