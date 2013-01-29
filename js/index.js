// Index page scripts

function selectNavBarItem(component) 
{
	//$('ul.nav li').removeClass('active');
	//$('#' +component + 'Nav').addClass('active');
	$('#contentFrame').attr('src', component);
}
/*
$.ready( function() {
	setTimeout('reloadStylesheets', 1000);
});
*/