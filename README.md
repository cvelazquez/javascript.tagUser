javascript.tagUser
==================

jQuery Plugin to tag users in comments (suggestions will appear after an @). Designed for twitter bootstrap 3.x

Example:

```javascript
var users = {
	1:'First user',
	3:'Another user',
};

$(document).on('ready', function(){
	$('#myForm textarea').tagUser(users);
});
```
