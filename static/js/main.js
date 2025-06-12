(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);
// dynamic-region.js

function updateRegionOptions() {
    // Get selected governorate
    var governorate = document.getElementById('governorate').value;

    // Get the region dropdown
    var regionDropdown = document.getElementById('region');

    // Clear current options
    regionDropdown.innerHTML = '<option selected>المنطقة</option>';

    // Define region options based on governorate
    var regions = {
        'sweida': [
            'السويداء', 'شهبا', 'عرى', 'المزرعة', 'قنوات', 'الكفر', 'القريا', 
            'المشنف', 'عتيل', 'سهوة الخضر', 'ذيبين', 'ملح', 'الغارية', 'حبران', 
            'رضيمة اللوا', 'سالة', 'الكسيب', 'الصورة الكبيرة', 'عرمان', 
            'المجادل', 'الهيت', 'جرين', 'اللوا', 'داما', 'صماد', 'الثعلة', 
            'المجيمر', 'الطيبة', 'بوسان', 'خازمة', 'الغارية الغربية', 'خربة عواد',
            'الرحا', 'الهويا', 'الهويا الغربية', 'عرى', 'سكاكا', 'أم ضبيب', 
            'بريكة', 'عرى الغربية'
        ],
        'damascus': [
            'المزة', 'الميدان', 'الشاغور', 'المالكي', 'برزة', 'القابون', 
            'ركن الدين', 'دمر', 'جرمانا', 'قدسيا', 'كفرسوسة', 'المهاجرين', 
            'الدويلعة', 'القدم', 'باب توما', 'باب شرقي', 'الزبلطاني', 'جوبر', 
            'القصاع', 'العباسيين'
        ]
    };
    

    // Get regions for selected governorate
    var selectedRegions = regions[governorate];

    // Add new options to the region dropdown
    if (selectedRegions) {
        selectedRegions.forEach(function (region) {
            var option = document.createElement('option');
            option.text = region;
            regionDropdown.add(option);
        });
    }
}
