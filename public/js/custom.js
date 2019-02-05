
$(document).ready(function() {
  $(window).resize(function() {

  $(".select-simple").select2({
		theme: "bootstrap",
		minimumResultsForSearch: Infinity,
	});

	//window.testSelAll2 = $('.testSelAll2').SumoSelect({selectAll:true});  // sumo select
	// if($('footer').length !== 0){
	// 	// console.log($('footer'));	
	// 	$('body').css({'padding-bottom':$('footer').outerHeight() + "px"});  // sticky footer
	// }

	$('.titleHidden').removeAttr('title'); // for preventing tooltip

	$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 1) {
        $(".transy-btn").addClass("yellow-bg");
    }
    else if (scroll == 0) {
        $(".transy-btn").removeClass("yellow-bg");
    }
	});

  }).resize(); // Trigger resize handlers.

	function updateScroll(){
		var element = document.getElementByClass("Select-multi-value-wrapper");
		element.scrollTop = element.scrollHeight;
	}

});//ready

