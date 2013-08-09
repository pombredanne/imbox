(function($) {

	$.fn.scrollNav = function(options) {

		// Add loading hook to the body element

		$('body').addClass('sn-loading');

		var settings = {
			sections: 'h3',
			titleText: 'Scroll To',
			fixedMargin: 40,
			animated: true,
			speed: 500,
			showHeadline: true,
			showTopLink: true,
			location: 'insertBefore',
			addClass: '',
			addId: null
		};

		$.extend(settings, options);

		// Set the variables from our page elements

		var $sectionArray	= [];
		var $container		= this;
		var $sections		= $container.find(settings.sections);
		var allowScroller	= true;

		if(settings.addClass != '') {
			var $nav			= $('<nav />', {'id': settings.addId, 'class': 'scroll-nav' + ' ' + settings.addClass, 'role': 'navigation'});
		} else {
			var $nav			= $('<nav />', {'id': settings.addId, 'class': 'scroll-nav', 'role': 'navigation'});
		}

		// Find the article container and either grab it's id or give it one
		// Initial setup of the section array

		var setupContainer = function() {
			if ( settings.showTopLink === false ) { return; }

			var containerID	= $container.attr('id');
			var offset		= $container.offset().top;

			if (containerID) {
				$sectionArray.push({id: containerID, offset: offset, text: 'Top'});
			}
			else {
				$container.attr('id', 'jumpNav-0');
				$sectionArray.push({id: 'jumpNav-0', offset: offset, text: 'Top'});
			}
		};

		// Find each section and give it an id
		// Add each section and it's details to the section array

		var setupSections = function() {
			$sections.each(function(i) {
				var sectionID	= 'jumpNav-' + (i + 1);
				var $offset		= $(this).offset().top;
				var $text		= $(this).data('nav');

				$(this).attr('id', sectionID);
				$sectionArray.push( {id: sectionID, offset: $offset, text: $text} );
			});
		};

		// Populate the nav with a headline and ordered list from
		// the section array we built

		var setupNav = function() {
			var $headline	= $('<span />', {'class': 'scroll-nav-heading', text: settings.titleText});
			var $list		= $('<ol />', {'class': 'scroll-nav-list'});

			$.each($sectionArray, function(i) {

				if (i === 0) {
					console.log($(this));
					$(this).addClass('active');
					var $item = $('<li />', {'class': 'scroll-nav-item active'});

				} else {
					var $item = $('<li />', {'class': 'scroll-nav-item'});
				}
				
				var $link	= $('<a />', {'href': '#' + this.id, 'class': 'scroll-nav-link', text: this.text});

				$list.append( $item.append($link) );
			});

			if (settings.showHeadline === true) {
				$nav.append($headline).append($list);
			} else {
				$nav.append($list);
			}

		};

		// Set nav to fixed after scrolling past the header and
		// add an active class to whichever section currently in
		// view when the user clicks or scrolls

		var navScrolling = function() {
			var navOffset = $nav.offset().top;

			// Set a resize listener to change the offset values

			$(window).resize(function() {
				$.each($sectionArray, function() {
					this.offset	= $('#' + this.id).offset().top;
				});
			});

			// Set a scroll listener to update the fixed and
			// active classes

			$(window).scroll(function() {
				var winTop		= $(window).scrollTop();
				var halfVP		= $(window).height() * 0.5;

				// console.log(winTop);
				// console.log(halfVP);

				if( winTop > (navOffset - settings.fixedMargin) ) { $nav.addClass('fixed'); }
				else { $nav.removeClass('fixed'); }

				$.each($sectionArray, function() {
					// console.log("my offset:   " + $('#' + this.id).offset().top);
					// console.log("offset:   " + this.offset);
					// console.log("winTop:   " + winTop);
					// console.log("winTop - settings.fixedMargin:   " + (winTop - settings.fixedMargin));
					// console.log("winTop + halfVP:   " + (winTop + halfVP));

					if( this.offset > winTop - settings.fixedMargin &&  this.offset < (winTop + halfVP) ) {
						$nav.find('li').removeClass('active');
						$nav.find('a[href="#' + this.id + '"]').parents('li').addClass('active');
					}
				});
			});
		};

		// BUILD!!!!
		if ($container.length !== 0) {
			setupContainer();
			setupSections();
			setupNav();
		}

		// Now add the nav to our page

		if ($container.length !== 0 && $sections.length !== 0) {
			$(settings.location).prepend($nav);
		}
		else if ($container.length === 0) {
			console.log("Build failed, scrollNav could not find '" + $container.selector + "'");
		}
		else if ($sections.length === 0) {
			console.log("Build failed, scrollNav could not find any '" + settings.sections + "'s inside of '" + $container.selector + "'");
		}

		// Add Scrolling //

		navScrolling();

		/* Animate Scrolling on click*/

		$('.scroll-nav-link').click(function() {
			var elementClicked	= $(this).attr("href");
			var destination		= $(elementClicked).offset().top;
			allowScroller		= false;

			// active on menus
			$('.scroll-nav-item').removeClass('active');
			$(this).parent().addClass('active');

			// active on items
			$sections.removeClass('active');
			$(elementClicked).addClass('active');

			if (settings.animated === true) {
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-40 }, settings.speed );
				allowScroller	= true;
				return false;
			} else {
				allowScroller	= true;
			}
		});

		/* End Animated Scrolling */

		// Remove loading hook and add a loaded hook to the body

		$('body').removeClass('sn-loading').addClass('sn-active');

	};
})(jQuery);