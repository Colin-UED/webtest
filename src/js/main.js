$(document).ready(function(){
	var $lateral_menu_trigger = $('#cd-menu-trigger'),
		$content_wrapper = $('.cd-main-content'),
		$navigation = $('header');

	//open-close lateral menu clicking on the menu icon
	$lateral_menu_trigger.on('click', function(event){  //点击触发
		event.preventDefault();  //方法阻止元素发生默认的行为
		
		$lateral_menu_trigger.toggleClass('is-clicked');  //切换样式
		$navigation.toggleClass('lateral-menu-is-open');  //切换样式
		$content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$('body').toggleClass('overflow-hidden');   //第一次点击
		});
		$('#cd-lateral-nav').toggleClass('lateral-menu-is-open');  //切换样式

		if($('html').hasClass('no-csstransitions')) {
			$('body').toggleClass('overflow-hidden');   //切换样式 兼容ie
		}
	});

	//点击菜单之外触发
	$content_wrapper.on('click', function(event){
		if( !$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span') ) {  //如果触发的节点是#cd-menu-trigger, #cd-menu-trigger span
			$lateral_menu_trigger.removeClass('is-clicked');  //切换样式
			$navigation.removeClass('lateral-menu-is-open');  //切换样式
			$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');  //切换样式
			});
			$('#cd-lateral-nav').removeClass('lateral-menu-is-open');
			//check if transitions are not supported
			if($('html').hasClass('no-csstransitions')) {
				$('body').removeClass('overflow-hidden');  //切换样式
			}

		}
	});

	//打开(或关闭)横向菜单的子菜单选项。关闭所有其他打开的子菜单选项。
	$('.item-has-children').children('a').on('click', function(event){
		event.preventDefault();
		$(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
	});
});