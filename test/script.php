<?php

function theme_prefix_enqueue_script() {
   wp_add_inline_script( 'getnoticed-main', "(function($){
        $('.categorynav').find('a').each(function(i, link) { 
            if ($(link).attr('href') === window.location.href) {
                $(link).addClass('current_page'); 
            }
        });
    }(jQuery));");
}
add_action( 'wp_enqueue_scripts', 'theme_prefix_enqueue_script' );