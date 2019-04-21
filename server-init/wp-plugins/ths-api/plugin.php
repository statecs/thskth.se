<?php
/*
 * Plugin Name: THS API
 * Plugin URI:
 * Description: JSON endpoint and shortcode for THS Website
 * Version: 1.1
 * Author: statecs
 * Author URI: http://statecreative.se
 * License: MIT
 */

/*
 *
 *  FILE STRUCTURE:
 *
 *  1. WP-API
 *  2. CUSTOM ENDPOINTS
 *  3. ADD \ REGISTER MENUS
 *  4. ADD PAGE TEMPLATES
 *  5. ADD \ REMOVE ACTIONS
 *  6. ADD REQUIRED PLUGINS
*/




/* function foo_register_alt_version_features($features) {
        $features['custom-fields'] = array();
    return $features;
}

add_filter('bu_alt_versions_feature_support', 'foo_register_alt_version_features');*/

// 2. Include field type for ACF5
// $version = 5 and can be ignored until ACF6 exists
/* function include_field_types_unique_id( $version ) {
  include_once(__DIR__.'/inc/acf-unique_id-v5.php');
}

add_action('acf/include_field_types', 'include_field_types_unique_id');*/


/* include static class */
/* include_once( __DIR__.'/inc/class-ths-postypes.php' );
/* add_shortcode('dummy', array( 'THS_Shortcode', 'seances') );
add_filter('get_the_excerpt', 'do_shortcode', 99);*/

add_filter( 'rest_url_prefix', function( $prefix ) { return 'api'; } );

/**
* 1. WP API
*/

/* include static class */
include_once( __DIR__.'/inc/class-ths-api.php' );


/**
* 2. CUSTOM ENDPOINTS
*/
    
function ths_get_author_meta($object, $field_name, $request) {
        
        $user_data = get_userdata($object['author']); // get user data from author ID.
        
        $array_data = (array)($user_data->data); // object to array conversion.
        
        // prevent user enumeration.
        unset($array_data['user_login']);
        unset($array_data['user_pass']);
        unset($array_data['user_activation_key']);
        
        return array_filter($array_data);
        
    }
    
function ths_register_author_meta_rest_field() {
        
        register_rest_field('page', 'author', array(
                'get_callback'    => 'ths_get_author_meta',
                'update_callback' => null,
                'schema'          => null,
        ));
        
        register_rest_field('post', 'author', array(
                'get_callback'    => 'ths_get_author_meta',
                'update_callback' => null,
                'schema'          => null,
        ));
        
        
    }
    
add_action('rest_api_init', 'ths_register_author_meta_rest_field');

add_action( 'rest_api_init', function () {
    register_rest_route( 'wp/v2', '/social/(?P<type>\S+)', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => array('THS_API', 'get_social_posts'),
        'args'     => array(
            'type' => array( 'required' => true )
        ),
    ));
});

 /* ------------
  3. ADD \ REGISTER MENUS
 --------------- */
    register_nav_menus( array(
        'header_menu' => 'Main Menu',
        'footer_menu' => 'Footer Menu',
        'chapters_menu' => 'Chapters Menu',
    ) );



/* Remove link to Rest API in the HTTP header */
remove_action( 'template_redirect', 'rest_output_link_header', 11, 0 );


// Match location rule and show ACFs
/*add_filter('acf/location/rule_match/cpt', 'acf_location_rules_match_cpt', 10, 3);
function acf_location_rules_match_cpt( $match, $rule, $options ){
  global $post;
  if(isset($options['cpt'])){
    $current_post_template = $options['cpt'];   
  }else{
    $current_post_template = get_post_meta($post->ID,'_post_template',true);
  }
  $selected_post_template = $rule['value'];
  if($rule['operator'] == "=="){
    $match = ( $current_post_template == $selected_post_template );
  }elseif($rule['operator'] == "!="){
    $match = ( $current_post_template != $selected_post_template );
  }
  return $match;
}

// Match location rule and show ACFs
add_filter('acf/location/rule_match/cpa', 'acf_location_rules_match_cpa', 10, 3);
function acf_location_rules_match_cpa( $match, $rule, $options ){
  global $post;
  if(isset($options['cpa'])){
    $current_post_template = $options['cpa'];   
  }else{
    $current_post_template = get_post_meta($post->ID,'_wp_page_template',true);
  }
  $selected_post_template = $rule['value'];
  if($rule['operator'] == "=="){
    $match = ( $current_post_template == $selected_post_template );
  }elseif($rule['operator'] == "!="){
    $match = ( $current_post_template != $selected_post_template );
  }
  return $match;
}*/

/**
 * Add automatic image sizes
 */
if ( function_exists( 'add_image_size' ) ) { 
      add_image_size( 'image640', 640, 640, true ); //(cropped)
      add_image_size( 'image960', 960, 400, false ); //(scaled)
      add_image_size( 'image1280', 1280, 400, false ); //(scaled)
      add_image_size( 'image1600', 1600, 550, false ); //(scaled)
       add_image_size( 'image1920', 1920, 550, false ); //(scaled)
}


function half_shortcode( $atts, $content = null ) {
  $a = shortcode_atts( array(
    'class' => 'o-half left-o',
  ), $atts );

  return '<div class="' . esc_attr($a['class']) . '">' . do_shortcode($content) . '</div>';
}
add_shortcode('o-half', 'half_shortcode');

function collapse_shortcode( $atts, $content = null ) {
 
    $output = '';
 
    $pull_quote_atts = shortcode_atts( array(
        'quote' => 'My Quote',
    ), $atts );
 
     $output .= '<section><article> <input class="toggle-box" type="checkbox" id="' . $pull_quote_atts[ 'quote' ]  . '">';
    $output .=  '<div class="bg-c"><label class="bg-c1" for="' . $pull_quote_atts[ 'quote' ]  . '">' . $pull_quote_atts[ 'quote' ]  . '</label><div class="content-c">';
    $output .= '' . do_shortcode($content) . '';
    $output .= '</div></div></article></section>';
    return $output;
 
}
add_shortcode( 'collapse-quote', 'collapse_shortcode' );

function sub_collapse_shortcode( $atts, $content = null ) {
 
    $output = '';
 
    $pull_quote_atts = shortcode_atts( array(
        'quote' => 'My Quote',
    ), $atts );
 
    $output .= '<article><input class="toggle-box-2" type="checkbox" id="' . $pull_quote_atts[ 'quote' ]  . '">';
    $output .=  '<div class="bg-c"><label class="bg-c2" for="' . $pull_quote_atts[ 'quote' ]  . '">' . $pull_quote_atts[ 'quote' ]  . '</label><div class="content-c">';
    $output .= '' . do_shortcode($content) . '';
    $output .= '</div></div></article>';
 
    return $output;
 
}
add_shortcode( 'sub-collapse-quote', 'sub_collapse_shortcode' );

  

/* ------------
    6. ADD REQUIRED PLUGINS
--------------- */
    function required_plugins() {
        $plugin_error_message = array();
        include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        // Require the WP Rest API V2 Plugin
        if(!is_plugin_active( 'rest-api/plugin.php' )) {
            $plugin_error_message[] = 'This theme requires you to install the WP Rest API V2 plugin, <a href="https://wordpress.org/plugins/rest-api/">download it from here</a>.';
        }
        // Require the WP API Menus Plugin
        if(!is_plugin_active( 'wp-api-menus/wp-api-menus.php' )) {
            $plugin_error_message[] = 'This theme requires you to install the WP API Menus plugin, <a href="http://wordpress.org/plugins/wp-api-menus/">download it from here</a>.';
        }
        if(count($plugin_error_message) > 0) {
            echo '<div id="message" class="error">';
            foreach($plugin_error_message as $message) {
                echo '<p><strong>'.$message.'</strong></p>';
            }
            echo '</div>';
        }
    }

        add_filter( 'auto_core_update_send_email', 'wpb_stop_auto_update_emails', 10, 4 );
 
function wpb_stop_update_emails( $send, $type, $core_update, $result ) {
  
  if ( ! empty( $type ) && $type == 'success' ) {
    return false;
  }
    return true;
  }

update_option( 'link_manager_enabled', 0 );

    add_action( 'rest_api_init', function() {
               
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function( $value ) {
    $origin = get_http_origin();
    
               if ( $origin ) {
               header('Cache-Control: public, max-age=86400');
               header('access-control-allow-origin: *');
               header( 'Access-Control-Allow-Methods: GET' );
               
               
               }
               header('Cache-Control: public, max-age=86400');
               header('access-control-allow-origin: *');
               header( 'Access-Control-Allow-Methods: GET' );
               
               return $value;
                          
               });
}, 15 );



    add_action('after_setup_theme','remove_core_updates');
    function remove_core_updates()
    {
        if(! current_user_can('update_core')){return;}
        add_action('init', create_function('$a',"remove_action( 'init', 'wp_version_check' );"),2);
        add_filter('pre_option_update_core','__return_null');
        add_filter('pre_site_transient_update_core','__return_null');
    }

    /*
     * Creating a notification_post_type to create our CPT
     */
    
    add_action( 'init', 'notification_post_type', 0 );
    function notification_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Notifications', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Notifications', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Notifications', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Notifications', 'twentythirteen' ),
                        'all_items'           => __( 'All Notifications', 'twentythirteen' ),
                        'view_item'           => __( 'View Notification', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Notification', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Notification', 'twentythirteen' ),
                        'update_item'         => __( 'Update Notification', 'twentythirteen' ),
                        'search_items'        => __( 'Search Notifications', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'notification', 'twentythirteen' ),
                      'description'         => __( 'Notifications', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "notification", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-info',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 2,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'notification', $args );
        
    }
    
    
    /*
     * Creating a restrictions_post_type to create our CPT
     */
    
    add_action( 'init', 'restrictions_post_type', 0 );
    function restrictions_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Restrictions', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Restrictions', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Restrictions', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Restrictions', 'twentythirteen' ),
                        'all_items'           => __( 'All Restrictions', 'twentythirteen' ),
                        'view_item'           => __( 'View Restriction', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Restriction', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Restrictions', 'twentythirteen' ),
                        'update_item'         => __( 'Update Restriction', 'twentythirteen' ),
                        'search_items'        => __( 'Search Restrictions', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'restriction', 'twentythirteen' ),
                      'description'         => __( 'Restrictions', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "restriction", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-hidden',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 3,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'restriction', $args );
        
    }

   
    /*
     * Creating a association_post_type to create our CPT
     */
    
    add_action( 'init', 'association_post_type', 0 );
    function association_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Associations', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Association', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Associations', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Associations', 'twentythirteen' ),
                        'all_items'           => __( 'All Associations', 'twentythirteen' ),
                        'view_item'           => __( 'View Association', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Association', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Association', 'twentythirteen' ),
                        'update_item'         => __( 'Update Association', 'twentythirteen' ),
                        'search_items'        => __( 'Search Associations', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'association', 'twentythirteen' ),
                      'description'         => __( 'Associations', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "association", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-admin-site',
                      'with_front'          => false,
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'menu_position'       => 10,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'association', $args );
        
    }
    
    /*
     * Creating a chapter_post_type to create our CPT
     */
    
    add_action( 'init', 'chapter_post_type', 0 );
    function chapter_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Chapters', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Chapter', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Chapters', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Chapters', 'twentythirteen' ),
                        'all_items'           => __( 'All Chapters', 'twentythirteen' ),
                        'view_item'           => __( 'View Chapter', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Chapter', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Chapter', 'twentythirteen' ),
                        'update_item'         => __( 'Update Chapter', 'twentythirteen' ),
                        'search_items'        => __( 'Search Chapters', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'chapter', 'twentythirteen' ),
                      'description'         => __( 'Chapters', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "chapter", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-admin-site',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'menu_position'       => 11,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'chapter', $args );
        
    }
    

    /*
     * Creating a other_post_type to create our CPT
     */
    
    add_action( 'init', 'other_post_type', 0 );
    function other_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Others', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Others', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Others', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Others', 'twentythirteen' ),
                        'all_items'           => __( 'All Others', 'twentythirteen' ),
                        'view_item'           => __( 'View Other', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Other', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Others', 'twentythirteen' ),
                        'update_item'         => __( 'Update Other', 'twentythirteen' ),
                        'search_items'        => __( 'Search Others', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'other', 'twentythirteen' ),
                      'description'         => __( 'Others', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "other", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-admin-site',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 12,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'other', $args );
        
    }
    
    /*
     * Creating a documents_post_type to create our CPT
     */
    
    add_action( 'init', 'documents_post_type', 0 );
    function documents_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Documents', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Documents', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Documents', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Documents', 'twentythirteen' ),
                        'all_items'           => __( 'All Documents', 'twentythirteen' ),
                        'view_item'           => __( 'View Document', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Document', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Document', 'twentythirteen' ),
                        'update_item'         => __( 'Update Document', 'twentythirteen' ),
                        'search_items'        => __( 'Search Documents', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'document', 'twentythirteen' ),
                      'description'         => __( 'Documents', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "documents", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-category',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'menu_position'       => 4,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'documents', $args );
        
    }
    
    
    /*
     * Creating a restaurant_post_type to create our CPT
     */
    
    add_action( 'init', 'restaurant_post_type', 0 );
    function restaurant_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Restaurants', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Restaurants', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Restaurants', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Restaurants', 'twentythirteen' ),
                        'all_items'           => __( 'All Restaurants', 'twentythirteen' ),
                        'view_item'           => __( 'View Restaurant', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Restaurant', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Restaurant', 'twentythirteen' ),
                        'update_item'         => __( 'Update Restaurant', 'twentythirteen' ),
                        'search_items'        => __( 'Search Restaurants', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'restaurant', 'twentythirteen' ),
                      'description'         => __( 'Restaurant', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "restaurant", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-carrot',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 4,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'restaurant', $args );
        
    }
    

    

    /*
     * Creating a card_post_type to create our CPT
     */
    
    add_action( 'init', 'card_post_type', 0 );
    function card_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Cards', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Cards', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Cards', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Cards', 'twentythirteen' ),
                        'all_items'           => __( 'All Cards', 'twentythirteen' ),
                        'view_item'           => __( 'View Card', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Card', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Card', 'twentythirteen' ),
                        'update_item'         => __( 'Update Card', 'twentythirteen' ),
                        'search_items'        => __( 'Search Cards', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'card', 'twentythirteen' ),
                      'description'         => __( 'Cards', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres', 'user_interest'),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "cards", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-layout',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 5,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'cards', $args );
        
    }
    
    
    /*
     * Creating a faq_post_type to create our CPT
     */
    
    add_action( 'init', 'faq_post_type', 0 );
    function faq_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'FAQs', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'FAQs', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'FAQs', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent FAQs', 'twentythirteen' ),
                        'all_items'           => __( 'All FAQs', 'twentythirteen' ),
                        'view_item'           => __( 'View FAQ', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New FAQ', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit FAQ', 'twentythirteen' ),
                        'update_item'         => __( 'Update FAQ', 'twentythirteen' ),
                        'search_items'        => __( 'Search FAQs', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'faq', 'twentythirteen' ),
                      'description'         => __( 'FAQs', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "ths-faqs", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-editor-help',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 9,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'ths-faqs', $args );
        
    }


    /*
     * Creating a slides_post_type to create our CPT
     */
    
    add_action( 'init', 'slides_post_type', 0 );
    function slides_post_type() {
        
        // Set UI labels for Custom Post Type
        $labels = array(
                        'name'                => _x( 'Slides', 'Post Type General Name', 'twentythirteen' ),
                        'singular_name'       => _x( 'Slides', 'Post Type Singular Name', 'twentythirteen' ),
                        'menu_name'           => __( 'Slides', 'twentythirteen' ),
                        'parent_item_colon'   => __( 'Parent Slides', 'twentythirteen' ),
                        'all_items'           => __( 'All Slides', 'twentythirteen' ),
                        'view_item'           => __( 'View Slide', 'twentythirteen' ),
                        'add_new_item'        => __( 'Add New Slide', 'twentythirteen' ),
                        'add_new'             => __( 'Add New', 'twentythirteen' ),
                        'edit_item'           => __( 'Edit Slide', 'twentythirteen' ),
                        'update_item'         => __( 'Update Slide', 'twentythirteen' ),
                        'search_items'        => __( 'Search Slides', 'twentythirteen' ),
                        'not_found'           => __( 'Not Found', 'twentythirteen' ),
                        'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
                        );
        
        // Set other options for Custom Post Type
        
        $args = array(
                      'label'               => __( 'slides', 'twentythirteen' ),
                      'description'         => __( 'Slides', 'twentythirteen' ),
                      'labels'              => $labels,
                      // Features this CPT supports in Post Editor
                      'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
                      // You can associate this CPT with a taxonomy or custom taxonomy.
                      'taxonomies'          => array( 'genres' ),
                      // You can create a custom slug
                      'rewrite'             => array( "slug" => "slides", "with_front" => false ),
                      /* A hierarchical CPT is like Pages and can have
                       * Parent and child items. A non-hierarchical CPT
                       * is like Posts.
                       */
                      'publicly_queryable'  => true,
                      'public'              => true,
                      'menu_icon'           => 'dashicons-images-alt2',
                      'show_ui'             => true,
                      'show_in_menu'        => true,
                      'show_in_nav_menus'   => true,
                      'show_in_admin_bar'   => true,
                      'show_in_rest'        => true,
                      'menu_position'       => 6,
                      'can_export'          => true,
                      'has_archive'         => true,
                      'exclude_from_search' => false,
                      'publicly_queryable'  => true,
                      'capability_type'     => 'page',
                      );
        
        // Registering your Custom Post Type
        register_post_type( 'slides', $args );
        
    }
    

   
    
    add_action('init', 'user_interest_register_taxonomy');
    function user_interest_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'User Interests',
                      'show_in_rest' => true,
                   
                      );
        register_taxonomy( 'user_interest', array( 'cards' ), $args );
    }
    
    add_action('init', 'faq_category_register_taxonomy');
    function faq_category_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'FAQ Categories',
                      'show_in_rest' => true,
                      
                      );
        register_taxonomy( 'faq_category', array( 'ths-faqs' ), $args );
    }


    add_action('init', 'ths_associations_register_taxonomy');
    function ths_associations_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'Categories',
                      'show_in_rest' => true,
                      
                      );
        register_taxonomy( 'ths_associations', array( 'association' ), $args );
    }
    

    add_action('init', 'ths_chapters_register_taxonomy');
    function ths_chapters_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'Categories',
                      'show_in_rest' => true,
                      
                      );
        register_taxonomy( 'chapters', array( 'chapter' ), $args );
    }
    
    
    add_action('init', 'ths_others_register_taxonomy');
    function ths_others_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'Categories',
                      'show_in_rest' => true,
                      
                      );
        register_taxonomy( 'others', array( 'other' ), $args );
    }
    
    add_action('init', 'documents_register_taxonomy');
    function documents_register_taxonomy() {
        $args = array(
                      'hierarchical' => true,
                      'label' => 'Categories',
                      'show_in_rest' => true,
                      
                      );
        register_taxonomy( 'categories', array( 'documents' ), $args );
    }
    

    function sa_sanitize_spanish_chars($filename) {
        $ext = end(explode('.',$filename));
        $sanitized = preg_replace('/[^a-zA-Z0-9-_.]/','', substr($filename, 0, -(strlen($ext)+1)));
        $sanitized = str_replace('.','-', $sanitized);
        return strtolower($sanitized.'.'.$ext);
    }
    
    add_filter('sanitize_file_name', 'sa_sanitize_spanish_chars', 10);

    function my_rest_prepare_post( $data, $post, $request ) {
        $_data = $data->data;
        $thumbnail_id = get_post_thumbnail_id( $post->ID );
        $thumbnail = wp_get_attachment_image_src( $thumbnail_id, 'full' );
        $_data['featured_image_url'] = $thumbnail[0];
        $data->data = $_data;
        return $data;
    }
    add_filter( 'rest_prepare_post', 'my_rest_prepare_post', 10, 3 );
