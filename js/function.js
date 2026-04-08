(function ($) {
    "use strict";
	
	var $window = $(window);
    var $body = $("body");

    /* Preloader Effect */
    $window.on("load", () => $(".preloader").fadeOut(600));
	
	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$(window).on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}

	/* Mobile Menu Handling */
    const initialMenuItems = $("#menu > li").toArray();
    const initialMenu2Items = $("#menu2 > li").toArray();

    const handleMobileMenus = () => {
        const isMobile = $window.width() <= 768;
        const hasSlickNav = $(".slicknav_nav").length > 0;

        if (isMobile && !hasSlickNav) {
            $("#menu2").children().appendTo("#menu");
            $("#menu").slicknav({ label: "", prependTo: ".responsive-menu" });
        } else if (!isMobile && hasSlickNav) {
            $("#menu").slicknav("destroy");

            $("#menu > li").not(initialMenuItems).appendTo("#menu2");
            initialMenu2Items.forEach((item) => $(item).appendTo("#menu2"));
            initialMenuItems.forEach((item) => $(item).appendTo("#menu"));
        }
    };

	/* Run the function on page load */
    handleMobileMenus();
    
	let resizeTimeout;

	/* Re-run the function on window resize */
	$window.on("resize", function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(handleMobileMenus, 200); // Delay execution
	});

	// Show/hide the button on scroll
	window.onscroll = function () {
	const btn = document.getElementById("backToTopBtn");
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		btn.style.display = "block";
	} else {
		btn.style.display = "none";
	}
	};
	
	/* Scroll to Top */
    $(document).on("click", "a[href='#top']", function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

	/* Initialize Swiper Sliders */
    const initSwiper = (selector, options) => {
        if ($(selector).length) {
            return new Swiper(selector, options);
        }
        return null;
    };

	const swiperOptions = {
        slidesPerView: 1,
        speed: 1000,
        spaceBetween: 10,
        loop: true,
        autoplay: { delay: 5000 },
    };

    initSwiper(".hero-slider-layout .swiper", {
        ...swiperOptions,
        autoplay: { delay: 4000 },
        pagination: { el: ".hero-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });

    initSwiper(".sisf-testimonioal-slider .swiper", {
        ...swiperOptions,
        navigation: { nextEl: ".testimonioal-next", prevEl: ".testimonioal-prev" },
    });

    initSwiper(".service-single-slider .swiper", {
        ...swiperOptions,
        navigation: { nextEl: ".service-single-button-next", prevEl: ".service-single-button-prev" },
    });

    initSwiper(".ministry-single-slider .swiper", {
        ...swiperOptions,
        pagination: { el: ".swiper-pagination", clickable: true },
    });

	/* Skills Progress Bar */
    if ($(".skills-progress-bar").length) {
        $(".skills-progress-bar").waypoint(
            function () {
                $(".skillbar").each(function () {
                    $(this).find(".count-bar").animate({ width: $(this).attr("data-percent") }, 2000);
                });
            },
            { offset: "50%" }
        );
    }

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Audio JS */
	const player = new Plyr('#player');

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation */
	if ($('.text-anime-style-1').length) {
		let staggerAmount 	= 0.05,
			translateXValue = 0,
			delayValue 		= 0.5,
		   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.words, {
				duration: 1,
				delay: delayValue,
				x: 20,
				autoAlpha: 0,
				stagger: staggerAmount,
				scrollTrigger: { trigger: element, start: "top 85%" },
				});
		});		
	}
	
	if ($('.text-anime-style-2').length) {				
		let	 staggerAmount 		= 0.03,
			 translateXValue	= 20,
			 delayValue 		= 0.1,
			 easeType 			= "power2.out",
			 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%"},
				});
		});		
	}
	
	if ($('.text-anime-style-3').length) {		
		let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
		
		 animatedTextElements.forEach((element) => {
			//Reset if needed
			if (element.animation) {
				element.animation.progress(1).kill();
				element.split.revert();
			}

			element.split = new SplitText(element, {
				type: "lines,words,chars",
				linesClass: "split-line",
			});
			gsap.set(element, { perspective: 400 });

			gsap.set(element.split.chars, {
				opacity: 0,
				x: "50",
			});

			element.animation = gsap.to(element.split.chars, {
				scrollTrigger: { trigger: element,	start: "top 90%" },
				x: "0",
				y: "0",
				rotateX: "0",
				opacity: 1,
				duration: 1,
				ease: Back.easeOut,
				stagger: 0.02,
			});
		});		
	}

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	 /* Contact Form Validation */
    $("#contactForm").validator({ focus: false }).on("submit", function (event) {
        if (!event.isDefaultPrevented()) {
            event.preventDefault();
            submitForm("#contactForm", "../form-process.php", contactFormSuccess);
        }
    });

    const submitForm = (formId, url, successCallback) => {
        const formData = $(formId).serialize();
        $.post(url, formData, (response) => {
			if (typeof response === "string" && response.trim() === "success") {
				successCallback();
			} else {
				showMsg(false, response);
			}
		});
    };

    const contactFormSuccess = () => {
        $("#contactForm")[0].reset();
        showMsg(true, "Message Sent Successfully!");
    };

    const showMsg = (valid, msg) => {
        $("#msgSubmit").removeClass().addClass(valid ? "h3 text-success" : "h3 text-danger").text(msg);
    };

    /* Reservation Form Validation */
    $("#reservationForm").validator({ focus: false }).on("submit", function (event) {
        if (!event.isDefaultPrevented()) {
            event.preventDefault();
            submitForm("#reservationForm", "../reservation-form-process.php", reservationFormSuccess);
        }
    });

    const reservationFormSuccess = () => {
        $("#reservationForm")[0].reset();
        showMsg(true, "Reservation Sent Successfully!");
    };

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Text Slider Carousel JS */
	if ($('.text-slider').length) {
		const TextSlider = new Swiper('.text-slider', {
			slidesPerView: 2,
			speed: 1000,
			spaceBetween: 10,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: false,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				480: {
					slidesPerView: 1,
				},
				650: {
					slidesPerView: 1,
				},
				767: {
					slidesPerView: 1,
				},
				1024: {
					slidesPerView: 2,
				},
				1367: {
					slidesPerView: 2,
				},
				1920: {
					slidesPerView: 2,
				}
			}
		});
	
	}

	/* Restaurant Logo Slider JS */
	if ($('.restaurant-logo-slider').length) {
		const LogoSlider = new Swiper('.restaurant-logo-slider', {
				slidesPerView: 5,
				speed: 1000,
				spaceBetween: 10,
				loop: true,
				autoplay: {
					delay: 5000,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				breakpoints: {
					320: {
						slidesPerView: 1,
					},
					480: {
						slidesPerView: 2,
					},
					650: {
						slidesPerView: 3,
					},
					767: {
						slidesPerView: 4,
					},
					1024: {
						slidesPerView: 5,
					},
					1367: {
						slidesPerView: 5,
					},
					1920: {
						slidesPerView: 5,
					}
				}
		});
		
	}
    
    /* Gallery Slider JS */
	if ($('.gallery-slider').length) {
		const GallerySlider = new Swiper('.gallery-slider', {
			slidesPerView: 5,
			speed: 1000,
			spaceBetween: 10,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				480: {
					slidesPerView: 2,
				},
				650: {
					slidesPerView: 3,
				},
				767: {
					slidesPerView: 4,
				},
				1024: {
					slidesPerView: 5,
				},
				1367: {
					slidesPerView: 5,
				},
				1920: {
					slidesPerView: 5,
				}
			}
		});
	}

	/* Client Slider JS */
	if ($('.client-slider').length) {
		const ClientSlider = new Swiper('.client-slider', {
			slidesPerView: 1,
			speed: 1000,
			spaceBetween: 10,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				480: {
					slidesPerView: 2,
				},
				650: {
					slidesPerView: 3,
				},
				767: {
					slidesPerView: 4,
				},
				1024: {
					slidesPerView: 5,
				},
				1367: {
					slidesPerView: 5,
				},
				1920: {
					slidesPerView: 5,
				}
			}
		});
	}

	/* WooCommerce Quantity Buttons */
    // $(document).on("click", ".sisf-quantity-minus, .sisf-quantity-plus", function (e) {
    //     e.preventDefault();
    //     const $button = $(this);
    //     const $inputField = $button.siblings(".sisf-quantity-input");
    //     const step = parseFloat($inputField.data("step")) || 1;
    //     const max = parseFloat($inputField.data("max"));
    //     const min = parseFloat($inputField.data("min")) || 1;
    //     let inputValue = parseFloat($inputField.val()) || min;

    //     inputValue = $button.hasClass("sisf-quantity-minus") ? Math.max(min, inputValue - step) : (Number.isNaN(max) ? inputValue + step : Math.min(max, inputValue + step));

    //     $inputField.val(inputValue).trigger("change");
    // });
})(jQuery);