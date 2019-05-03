<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * For a full explanation see https://github.com/michaelbromley/angular-social-demo
 */

$API_URL = "https://cdn.thskth.se/api/";
$SITE_URL = "https://ths.kth.se/";
$POST_PAGE = "%%POST_PAGE%%";

$jsonData = getData($API_URL);
makePage($jsonData, $API_URL);


function getData($API_URL) {
$url = $_GET['url'] ? $_GET['url'] : 1;

// Create a curl handle to a non-existing location
$ch = curl_init($API_URL.'wp/v2/post/'.$url);
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

if (isset($decoded->$data->status) && $decoded->$data->status == '404') {
    header("HTTP/1.0 404 Not Found");
    die('404 Not Found');
}
return $decoded;
   
}

function makePage($data) {
    $pageUrl = str_replace("/api/", "/blog/", $data->link);
    $metaDescription = substr(strip_tags($data->excerpt->rendered), 0, 155);
    $colarray = $data->acf->post_meta[0]->col;
    ?>
      <!DOCTYPE html>
    <html ⚡>
    <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
        <meta content="width=device-width,minimum-scale=1" name=viewport>
        <title><?php echo $data->title->rendered; ?></title>
        <script type="application/ld+json">
         {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "mainEntityofPage": "<?php echo $pageUrl; ?>",
        "headline": "<?php echo $data->title->rendered; ?>",
        "datePublished": "<?php echo $data->date; ?>",
        "dateModified": "<?php echo $data->modified; ?>",
        "description": "<?php echo strip_tags($data->excerpt->rendered); ?>",
        "publisher": { "@type": "Organization", "name": "THS - Student Union at KTH", 
        "logo": {
        "@type": "ImageObject",
            "url": "http://ths.kth.se/assets/images/logo.png",
            "width": 600,
            "height": 60
            }
        },
        "author": {"type": "Organization", "name": "THS - Student Union at KTH"},
         "image": {
           "@type": "ImageObject",
            "url": "https://cdn.thskth.se/wp-content/uploads/2015/09/35_kth_vlv_6y7b5608-640x640.jpg",
            "height": 800,
            "width": 800
         }
      }
        </script>
<!--<script async src="https://cdn.ampproject.org/viewer/google/v5.js"></script><script async custom-element="amp-font" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-font-0.1.js"></script><script async custom-element="amp-twitter" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-twitter-0.1.js"></script><script async custom-element="amp-youtube" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-youtube-0.1.js"></script><script async custom-element="amp-instagram" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-instagram-0.1.js"></script><script async custom-element="amp-facebook" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-facebook-0.1.js"></script><script async custom-element="amp-list" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-list-0.1.js"></script><script async custom-element="amp-iframe" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-iframe-0.1.js"></script><script async custom-element="amp-analytics" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-analytics-0.1.js"></script><script async custom-element="amp-ad" src="https://cdn.ampproject.org/rtv/011476486609642/v0/amp-ad-0.1.js"></script>--><style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

<link href="<?php echo $pageUrl; ?>" rel=canonical>
    

        <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="og:title" content="<?php echo $data->title->rendered; ?>" />
        <meta property="og:description" content="<?php echo strip_tags($data->excerpt->rendered); ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="<?php echo $pageUrl; ?>" />
        <?php if (isset($data->featured_image)) {
            ?>
            <meta property="og:image" content="<?php echo $dat->featured_image; ?>" />
        <?php
        }?>
        <!-- inject:css -->
        <style amp-custom>
        html, body, div, span, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        abbr, address, cite, code,
        del, dfn, em, img, ins, kbd, q, samp,
        small, strong, sub, sup, var,
        b, i,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, figcaption, figure,
        footer, header, hgroup, menu, nav, section, summary,
        time, mark, audio, video, button {
            margin:0;
            padding:0;
            border:0;
            outline:0;
            font-size:100%;
            vertical-align:baseline;
            background:transparent;
        }

        body {
            line-height:1;
        }

        article,aside,details,figcaption,figure,
        footer,header,hgroup,menu,nav,section {
            display:block;
        }

        nav ul {
            list-style:none;
        }

        blockquote, q {
            quotes:none;
        }

        blockquote:before, blockquote:after,
        q:before, q:after {
            content:'';
            content:none;
        }

        a {
            margin:0;
            padding:0;
            font-size:100%;
            vertical-align:baseline;
            background:transparent;
        }

        ins {
            background-color:#ff9;
            color:#000;
            text-decoration:none;
        }

        mark {
            background-color:#ff9;
            color:#000;
            font-style:italic;
            font-weight:bold;
        }

        del {
            text-decoration: line-through;
        }

        abbr[title], dfn[title] {
            border-bottom:1px dotted;
            cursor:help;
        }

        table {
            border-collapse:collapse;
            border-spacing:0;
        }

        hr {
            display:block;
            height:1px;
            border:0;
            border-top:1px solid #cccccc;
            margin:1em 0;
            padding:0;
        }

        input, select {
            vertical-align: middle;
        }

        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: local('Lato Regular'), local('Lato-Regular'), url('/r/s/fonts.gstatic.com/s/lato/v11/8qcEw_nrk_5HEcCpYdJu8BTbgVql8nDJpwnrE27mub0.woff2') format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }

        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: local('Lato Regular'), local('Lato-Regular'), url('/r/s/fonts.gstatic.com/s/lato/v11/MDadn8DQ_3oT6kvnUq_2r_esZW2xOQ-xsNqO47m55DA.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 400;
            src: local('Playfair Display'), local('PlayfairDisplay-Regular'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/2NBgzUtEeyB-Xtpr9bm1CUR-13DsDU150T1bKbJZejI.woff2') format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 400;
            src: local('Playfair Display'), local('PlayfairDisplay-Regular'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/2NBgzUtEeyB-Xtpr9bm1CfoVn-aGdXvQRwgLLg-TkDk.woff2') format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 400;
            src: local('Playfair Display'), local('PlayfairDisplay-Regular'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/2NBgzUtEeyB-Xtpr9bm1Cdhy5e3cTyNKTHXrP9DO-Rc.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 700;
            src: local('Playfair Display Bold'), local('PlayfairDisplay-Bold'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/UC3ZEjagJi85gF9qFaBgIKHabUDGjprROP0Kzi4LtY8.woff2') format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 700;
            src: local('Playfair Display Bold'), local('PlayfairDisplay-Bold'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/UC3ZEjagJi85gF9qFaBgILCFnVHHm1VfBoEzRr6gqH0.woff2') format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: normal;
            font-weight: 700;
            src: local('Playfair Display Bold'), local('PlayfairDisplay-Bold'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/UC3ZEjagJi85gF9qFaBgIIsv7neNnoQYDmljOSnH1QE.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 400;
            src: local('Playfair Display Italic'), local('PlayfairDisplay-Italic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/9MkijrV-dEJ0-_NWV7E6N7pW-cN4iQdgUKBHiobroRo.woff2') format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 400;
            src: local('Playfair Display Italic'), local('PlayfairDisplay-Italic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/9MkijrV-dEJ0-_NWV7E6N3L1iaS4euO_B3wJG_mMktU.woff2') format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 400;
            src: local('Playfair Display Italic'), local('PlayfairDisplay-Italic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/9MkijrV-dEJ0-_NWV7E6NwXiAI3F8adTt8b-_w2WoPM.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 700;
            src: local('Playfair Display Bold Italic'), local('PlayfairDisplay-BoldItalic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/n7G4PqJvFP2Kubl0VBLDEMjNOE6OIchc6xEWGp4AFzI.woff2') format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 700;
            src: local('Playfair Display Bold Italic'), local('PlayfairDisplay-BoldItalic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/n7G4PqJvFP2Kubl0VBLDEGfg93gVtA75Tg3Rp7v1E0k.woff2') format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }

        @font-face {
            font-family: 'Playfair Display';
            font-style: italic;
            font-weight: 700;
            src: local('Playfair Display Bold Italic'), local('PlayfairDisplay-BoldItalic'), url('/r/s/fonts.gstatic.com/s/playfairdisplay/v10/n7G4PqJvFP2Kubl0VBLDEBZeN5y77JNHCKkhVNuYRJ4.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        * {

            box-sizing: border-box;

        }

        body {

            background: #f7f7f7;
            font: 300 16px/24px 'Lato', lucida sans, arial, sans-serif;

        }

        .clearfix:after,.clearfix:before {

            display:table;
            content:" ";
        }

        .clearfix:after {

            clear:both;

        }

        .d--none {

            display: none;

        }

        .d--block {

            display: block;

        }

        .d--inline-block {

            display: inline-block;

        }

        .list--none {

            list-style: none;

        }

        .list--border {

            border-bottom: 1px solid #e5e5e5;
            margin-bottom: 2em;

        }

        .list--border:last-child {

            border: none;

        }

        .t-align--center {

            text-align: center;

        }

        .t-align--left {

            text-align: left;

        }

        .t-align--right {

            text-align: right;

        }

        a, a:focus {

            color: #00bcfd;
            text-decoration: none;

        }

        a:hover, a:active {

            color: #0e0e0e;

        }




h1, h2, h3, h4, h5, h6 {
    font-family: CenturyGothic,sans-serif;
    font-weight: 700;
    margin: 30px 0;
    line-height: .9;
}
h1 {
    font-size: 3em;
}
h2 {
    font-size: 2em;
}
h3 {
    font-size: 1em;
    line-height: 1.3;
}
h4 {
    font-size: 0.7em;
    line-height: 1.3;
}
.page-content {
    font-size: 1.1rem;
    line-height: 33px;
    font-weight: 400;
    padding: 0 30px;
}


    </style>

        <!-- endinject -->

    </head>
    <body>
    <div class="main">


                <div class="pure-g page-content">
                        <h4><a href="http://ths.kth.se">Back to Site</a></h4>
        <h1 class="page-header"><?php echo $data->title->rendered; ?></h1>
        <h4>Last modified: <?php echo date('Y-m-d',strtotime($data->modified)); ?></h4>
            <div class="pure-u-1">
                <div class="post-body">


<?php $content = $data->content->rendered;
$content = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $content);
$content = preg_replace('/<img\s+src="([^"]+)"[^>]+>/i', '<amp-img layout=responsive height="10" width="10" src="$1"></amp-img>', $content); 
echo $content; ?>



                
                    
                </div>
                <?php if (!empty($data->acf->post_meta[0]->related_links)) { ?>
                <div class="related-links-block"><h2 class="h2 border-top">Related links</h2>
                 <div class="link-container"> <?php echo $data->acf->post_meta[0]->related_links; } ?></div>
                </div>
            </div>

        </div>

    </div>
    </body>
    </html>
<?php
}
