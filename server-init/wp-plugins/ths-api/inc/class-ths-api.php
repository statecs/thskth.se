<?php
/**
* Class THS_API
*
* @author statecs
*/

class THS_API  {

  /**
  * Get a collection of items
  *
  * @param WP_REST_Request $request Full data about the request.
  * @return WP_Error|WP_REST_Response
  */
  
  public static function get_posts_from_url(  WP_REST_Request $request ) {

    //$params = $request->get_params();

    $url = $request['url'];

    $postid = url_to_postid( $url );

    $post = get_post($postid);

    // if $data empty or wp_error then return error response with 404 status code
    if ( empty( $post ) || is_wp_error( $post ) ) {
      return new WP_Error( 'rest_post_invalid_id', __( 'Invalid post id.' ), array( 'status' => 404 ) ); // new WP_REST_Response( array( ), 404 );
    }

    // foreach throught them to get relevant data and add these to response array
    $data = array();
    $data = self::prepare_item_for_response( $post, $request );

    // return response array + status
    $response = new WP_REST_Response( $data, 200 );

    return $response;
  }

  // Sticky posts in REST - https://github.com/WP-API/WP-API/issues/2210
  public static function get_sticky_posts() {
    $posts = get_posts(
        array(
            'post__in' => get_option('sticky_posts')
        )
    );
    if (empty($posts)) {
        return null;
    }
    
    return $posts;
}

  // Sticky posts in REST - https://github.com/WP-API/WP-API/issues/2210
  public static function get_social_posts( WP_REST_Request $request) {

    $type = $request['type'];

    if ($type == instagram) {
    $result = file_get_contents("https://graph.facebook.com/v3.2/17841400375245813/media?access_token=EAANsk8zlaPgBAGhiJLEopICRFrgPReXsO4GSsGCkFFEcL2cKccfNjb9DMSGK7pfwCMca1nxmaV2IlNZAGd8B4e2PW3N91aFrqlOiHjzoUJ73xD7tsA2YoK59CMbuiuyajFXTvLrkal5aKbg6gaO0WYW6exrWWlAwF6XZCRDgZDZD&pretty=0&fields=id%2Cmedia_url%2Cpermalink%2Ccaption%2Ctags%2Ctimestamp%2Cthumbnail_url&count=-1");
    $jsonArr = json_decode($result, true); //this is an array

    foreach($jsonArr['data'] as $key => $value) { 
        if((strpos($value['user']['username'], 'hochu_v_vanuatu') !== false) || (strpos($value['user']['username'], 'hindu_don') !== false) || (strpos($value['user']['username'], 'alocolu') !== false) || (strpos($value['user']['username'], 'blinidze') !== false) || (strpos($value['user']['username'], 'mhmd.fikriii') !== false) || (strpos($value['user']['username'], 'kikkiz') !== false)|| (strpos($value['user']['username'], 'saaraplanting') !== false)|| (strpos($value['user']['username'], 'sedibigdeli') !== false)|| (strpos($value['user']['username'], 'da.young_kim') !== false)|| (strpos($value['user']['username'], 'voodooburgersweden') !== false)|| (strpos($value['location']['name'], 'DKM') !== false)|| (strpos($value['user']['username'], 'hops0114') !== false) || (strpos($value['user']['username'], 'cevapi.se') !== false) || (strpos($value['user']['username'], 'bokafoodtrucks') !== false) || (strpos($value['user']['username'], 'gnarlyburger') !== false ) || (strpos($value['user']['username'], 'bokafoodtrucks') !== false) || (strpos($value['user']['username'], 'dannibanni') !== false) || (strpos($value['user']['username'], 'structorgruppen') !== false) ||  (strpos($value['user']['username'], 'samhallsbyggarna') !== false) 
        ||  (strpos($value['user']['username'], 'kristoffer.emanuelsson') !== false) ||  (strpos($value['user']['username'], 'dagens.matlada') !== false) || (strpos($value['user']['username'], 'naggieaxen') !== false) ||  (strpos($value['user']['username'], 'mateload') !== false) ||  (strpos($value['user']['username'], 'davidrojas8871') !== false)  
        ) {
          array_splice($jsonArr['data'][$key], 0);
        }
    }
    return $jsonArr; //this is an array
    } else if ($type == facebook){
       $string = file_get_contents("https://graph.facebook.com/v3.2/posts?ids=121470594571005,148731426526,126460727403918,113657678689023,199385490073014,279104938773217,160121967371342,38928295381,77067797676&access_token=EAANsk8zlaPgBAGhiJLEopICRFrgPReXsO4GSsGCkFFEcL2cKccfNjb9DMSGK7pfwCMca1nxmaV2IlNZAGd8B4e2PW3N91aFrqlOiHjzoUJ73xD7tsA2YoK59CMbuiuyajFXTvLrkal5aKbg6gaO0WYW6exrWWlAwF6XZCRDgZDZD&fields=id,message,story,created_time,full_picture,from,link,description,type,picture,object_id,updated_time&limit=5&locale=EN_en");
      // $string = file_get_contents("/storage/content/63/101063/ths.kth.se/public_html/wp-content/plugins/ths-api/facebook_mockup.json");
      return json_decode($string, true);
    } 
    
    else if ($type == events){
      $string = file_get_contents("https://graph.facebook.com/v3.2/events?ids=121470594571005,148731426526,122876454407986&access_token=EAANsk8zlaPgBAGhiJLEopICRFrgPReXsO4GSsGCkFFEcL2cKccfNjb9DMSGK7pfwCMca1nxmaV2IlNZAGd8B4e2PW3N91aFrqlOiHjzoUJ73xD7tsA2YoK59CMbuiuyajFXTvLrkal5aKbg6gaO0WYW6exrWWlAwF6XZCRDgZDZD&time_filter=upcoming&fields=id,description,end_time,name,place,start_time,cover,attending_count,category,interested_count,owner&limit=20&date_format=U&locale=EN_en");
     // $string = file_get_contents("/storage/content/63/101063/ths.kth.se/public_html/wp-content/plugins/ths-api/facebook_mockup.json");
     return json_decode($string, true);
   } 
   
   
   else{
        return null;
    }

}

  /**
  * Prepare the item for the REST response
  *
  * @param mixed $item WordPress representation of the item.
  * @param WP_REST_Request $request Request object.
  * @return mixed
  */

  private static function prepare_item_for_response( $post, $request ) {

    $thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' );

   // Base fields for every post.
    $postdata = array(
      'id'           => $post->ID,
      'date'         => self::prepare_date_response( $post->post_date_gmt, $post->post_date ),
      'date_gmt'     => self::prepare_date_response( $post->post_date_gmt ),
      'guid'         => array(
        'rendered' => apply_filters( 'get_the_guid', $post->guid ),
      ),
      'modified'     => self::prepare_date_response( $post->post_modified_gmt, $post->post_modified),
      'modified_gmt' => self::prepare_date_response( $post->post_modified_gmt ),
      'slug'         => $post->post_name,
      'status'       => $post->post_status,
      'type'         => $post->post_type,
      'link'         => get_permalink( $post->ID ),
      'acf'          => get_fields($post->ID),
      'comment_status'   => $post->comment_status,
      'sticky'       => is_sticky( $post->ID ),
      'template'     => get_page_template_slug( $post->ID ),
      'featured_image' => $thumbnail[0],
      'categories' => get_the_category( $post->ID ),

    );

    /** BUG. If installed on new wp-blog remove these lines **/
    if ( $postdata['template'] === false ) {
      if (!empty( get_post_meta($post->ID,'_post_template',true))) {
          $postdata['template'] = get_post_meta($post->ID,'_post_template',true);
      } else {
        $postdata['template'] = "news";
      }
    }
    
      $postdata['author'] = array(
          'name' => get_the_author_meta( 'display_name', $post->post_author),
          'email' =>  get_the_author_meta( 'user_email', $post->post_author),
      );

      $postdata['title'] = array(
        'rendered' => get_the_title( $post->ID ),
      );

      $postdata['content'] = array(
        /** This filter is documented in wp-includes/post-template.php */
        'rendered' => apply_filters( 'the_content', $post->post_content ),
      );

      $postdata['format'] = get_post_format( $post->ID );
      // Fill in blank post format.
      if ( empty( $postdata['format'] ) ) {
        $postdata['format'] = 'standard';
      }

      $postdata['excerpt'] = array(
        'rendered' => wp_trim_words( $post->post_content, 50, ' <a href="'. get_permalink( $post->ID ) .'">read more</a>' )
      );


      $response = rest_ensure_response( $postdata );

   // $schema = WP_REST_Posts_Controller::get_item_schema();

    return $postdata;
  }

  /**
   * Check the post_date_gmt or modified_gmt and prepare any post or
   * modified date for single post output.
   *
   * @param string       $date_gmt
   * @param string|null  $date
   * @return string|null ISO8601/RFC3339 formatted datetime.
   */
  protected function prepare_date_response( $date_gmt, $date = null ) {
    // Use the date if passed.
    if ( isset( $date ) ) {
      return mysql_to_rfc3339( $date );
    }

    // Return null if $date_gmt is empty/zeros.
    if ( '0000-00-00 00:00:00' === $date_gmt ) {
      return null;
    }

    // Return the formatted datetime.
    return mysql_to_rfc3339( $date_gmt );
  }

}
