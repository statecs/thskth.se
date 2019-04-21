<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * For a full explanation see https://github.com/michaelbromley/angular-social-demo
 */

$API_URL = "https://cdn.thskth.se/api/";
$SITE_URL = "https://thskth.se/";
$POST_PAGE = "%%POST_PAGE%%";

$jsonData = getData($API_URL);
makePage($jsonData, $API_URL);


function getData($API_URL) {
$url = $_GET['url'] ? $_GET['url'] : 1;

// Create a curl handle to a non-existing location
$ch = curl_init($API_URL.'wp/v2/pages?slug='.$url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$json = '';
if( ($json = curl_exec($ch) ) === false)
{
    curl_close($ch);
    header("HTTP/1.0 404 Not Found");
    die;

}
// Close handle
curl_close($ch);
$decoded = json_decode($json);

if (isset($decoded->data->status) && $decoded->data->status == '404') {
    header("HTTP/1.0 404 Not Found");
    die('404 Not Found');
}
 
return $decoded;
   
}

function makePage($data) {
   
    $pageUrl = str_replace("/api/", "/blog/", $data[0]->link);
    $metaDescription = substr(strip_tags($data[0]->excerpt->rendered), 0, 155);
    $colarray = $data[0]->acf->post_meta[0]->col;
    $url = $_GET['url'] ? $_GET['url'] : 1;
    ?>
      <!DOCTYPE html>
    <html>
    <head>
        <!--<meta http-equiv="content-type" content="text/html; charset=utf-8">-->
        <title><?php echo $data[0]->title->rendered; ?></title>
        <meta property="description" content="<?php echo $metaDescription; ?>" />
        <link rel="amphtml" href="http://ths.kth.se/static-amp.php?url=<?php echo $url; ?>" />

        <!-- Twitter summary card metadata -->
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="<?php echo $data[0]->title->rendered; ?>" />
        <meta property="twitter:description" content="<?php echo strip_tags($data[0]->excerpt->rendered); ?>" />
        <meta property="twitter:url" content="<?php echo $pageUrl; ?>" />
        <?php if (isset($data[0]->featured_image)) {
            ?>
            <meta property="twitter:image" content="<?php echo $data[0]->featured_image; ?>" />
        <?php
        }?>

        <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="og:title" content="<?php echo $data[0]->title->rendered; ?>" />
        <meta property="og:description" content="<?php echo strip_tags($data[0]->excerpt->rendered); ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="<?php echo $pageUrl; ?>" />
        <?php if (isset($data[0]->featured_image)) {
            ?>
            <meta property="og:image" content="<?php echo $data[0]->featured_image; ?>" />
        <?php
        }?>
        <!-- inject:css -->
        <link rel="stylesheet" href="styles/style.min.css">
        <!-- endinject -->

    </head>
    <body>
    <div class="main">

        <h2><a href="http://thskth.se">Back to Site</a></h2>
        <h1 class="page-header"><?php echo $data[0]->title->rendered; ?></h1>
        <div class="pure-g page-content">
            <div class="pure-u-1">
                <div class="post-body">
                    <?php echo $data[0]->content->rendered; ?>
                    <?php if (!empty($colarray)){

                     foreach ($colarray as $object) {
                            echo $object->content . "<br/>";
                    }
                    } ?>
                </div>
                <?php if (!empty($data[0]->acf->post_meta[0]->related_links)) { ?>
                <div class="related-links-block"><h2 class="h2 border-top">Related links</h2>
                 <div class="link-container"> <?php echo $data[0]->acf->post_meta[0]->related_links; } ?></div>
                </div>
            </div>

        </div>

    </div>
    </body>
    </html>
<?php
}
