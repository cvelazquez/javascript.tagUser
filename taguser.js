/**
 * tagUser jQuery Plugin
 * Designed for twitter bootstrap 3.x
 *
 * Dependencies:
 *	- jQuery 1.11.0 (jquery.com)
 *	- UnderscoreJS (underscorejs.org) // Just to search a value in an array
 *
 * Notes:
 *	- Every tagged user will append a hidden input with
 *	  the name `data[taggerUser][]` (An array will be send)
 *	- Style elements using CSS
 *
 * @author Christian V.
 * @version 0.1
 * @todo Remove UnderscoreJS dependency
 * @todo Add support for remote results instead of passing a usersCollection
 **/
(function($){
	var _userList;
	var _placeCaretAtEnd = function(el) {
		el.focus();
		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(false);
			textRange.select();
		}
	}

	var _addTag = function(form, parentDOM, userId, userLabel){
		var spanInput = form.append('<input type="hidden" class="taggedUserInput" id="taggedUserInput'+userId+'" name="data[taggedUser][]" value="'+userId+'">').find('#taggedUserInput'+userId);
		var comment = parentDOM.html();
		comment = comment.replace(/&nbsp;/g, ' ').split(' ').slice(0,-1);
		comment.push("<span contentEditable='false' class='taggedUser' data-target='#taggedUserInput"+userId+"'>"+userLabel+"</span>&nbsp;");
		parentDOM.html(comment.join(" "));
		parentDOM.focus();
	}

/**
 * @param object usersCollection key-value object
 **/
	$.fn.tagUser = function(usersCollection){
		if ( !document.getElementById('ulTagUserUnorderedList') ) {
			var userList = document.createElement('ul');
			userList.setAttribute('id', 'ulTagUserUnorderedList');
			userList.style.display = 'none';
			userList.style.position = 'absolute';
			userList.className = 'list-unstyled';
			$('body').append(userList);
			_userList = $('#ulTagUserUnorderedList');

			/** Click on suggestion to autocomplete **/
			$(document).off('click', '#ulTagUserUnorderedList');
			$(document).on({
				click: function(){
					var userName = $(this);
					var _this = _userList.data('element');
					var form = _this.closest('form');
					_addTag(form, _this, userName.data('id'), userName.text());
					var _v = _userList.data('_v');
					_v.val(_this.text());
					_userList.hide();

				}
			}, '#ulTagUserUnorderedList li');
		}

		var _this = jQuery(this);
		_this.each(function(k, v){
			var _v = $(v);
			var size = {w:_v.outerWidth(), h:_v.outerHeight()};
			var obj = _v.hide().parent().append('<div class="input textarea contentEditable" placeholder="'+_v.attr('placeholder')+'" contentEditable="true" style="width:'+size.w+'px;min-height:'+size.h+'px;"></div>').find('[contentEditable]');
			var hasResults = false;
			var form = _v.closest('form');
			if ( !form ) {
				form = _v.parent();
			}
			obj.keyup(function(e){
				var _this = $(this);
				var userName = _this.html().replace(/&nbsp;/g, " ").split(' ').slice(-1)[0];
				hasResults = false;
				_userList.empty().data('element', _this).data('_v', _v);
				if ( userName.search('@') != -1 && userName.length > 1 ) {
					var name = userName.substr(1);
					var found = '';
					$.each(usersCollection, function(index, value){
						if ( value.search(new RegExp(name,"i")) != -1 ) {
							found += '<li data-id="'+index+'" class="autocompleteTagUser">'+value+'</li>';
						}
					});
					if ( found.length > 1 ) {
						hasResults = true;
						var position = obj.offset();
						_userList.html(found).css({
							left: position.left,
							top: position.top+size.h,
						}).width(size.w).show();
					} else {
						_userList.hide();
					}
				} else {
					_userList.hide();
				}
				_v.val(obj.text());
				var activeTaggedUsers = [];
				obj.find('span.taggedUser').each(function(){
					activeTaggedUsers.push($(this).data('target').replace('#', ''));
				});

				form.find('input.taggedUserInput').each(function(){
					if ( _.indexOf(activeTaggedUsers, $(this).attr('id')) == -1 ) {
						$(this).remove();
					}
				});
			}).keydown(function(e){
				if ( e.ctrlKey && (e.keyCode == 13 || e.which == 13) ) { // Submit parent form by pressing CTRL+ENTER
					e.preventDefault();
					if ( 'submit' in form ) {
						form.submit();
					}
				} else if ( e.keyCode == 9 || e.which == 9 ) { // Autocomplete by pressing TAB key
					if ( hasResults ) {
						e.preventDefault();
						var _this = $(this);
						var userName = _userList.find('li:eq(0)');
						_addTag(form, _this, userName.data('id'), userName.text());
					}
					_userList.hide();
				}
			}).focus(function(){
				_placeCaretAtEnd(this);
			});

			_v.change(function(){
				var _this = $(this);
				obj.text(_this.val());
			});
		});
	}
})(jQuery);
