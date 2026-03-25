<?php
define( 'WP_CACHE', TRUE );
# Database Configuration
define( 'DB_NAME', 'wp_american393stg' );
define( 'DB_USER', 'american393stg' );
define( 'DB_PASSWORD', 'sx0hpyjJ-S7YXNqbagTU' );
define( 'DB_HOST', '127.0.0.1:3306' );
define( 'DB_HOST_SLAVE', '127.0.0.1:3306' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         'DiUD,Jzq0Lyy=lynIOFmRj%ZjsZhTWg65Y7$jKcuMPKqBCLZ%p%j5uiwHiZx6Awy');
define('SECURE_AUTH_KEY',  'CUiYCEwq4bZnIBVhv!RTMJ2Qq?FM6wsysL+DS,!10Tx&k,o4r,uj&bKE#W+5D~Bj');
define('LOGGED_IN_KEY',    'Mk6R1GZQp&t)!4k#^1xWz^ip^uU52?bBd$T,Fdqcvw@KVGRpgPO~VvxJqdXa0#78');
define('NONCE_KEY',        '&1zN0(vLVUQm2)AgU!IKp&zOhXOY_%cet?0X!oS@&7#*V8p*no(lQ2OrF75L^Mg$');
define('AUTH_SALT',        'e8eNF&lDjmOrh_$dTNdCD9.CmRawEX+JAuN0dv2dnf@^axB!jLb5z,Ez@F3#5zMI');
define('SECURE_AUTH_SALT', '5FoB*FYxLwbVAfx,@eR6PEGZQ7DhA?eFVan=JzJ=iAjWd6sKiLT6jixVBNg.Ld4r');
define('LOGGED_IN_SALT',   '=Y*APIzjPanQ@Rsr)fe.uo3DoBGg.T-rxNCiB1~7X3oRQn#BNrzb5eOt6jT~Uec+');
define('NONCE_SALT',       'khvc~p%fFyma??r+1Y1C#ZKk1KRJx7EK1wQGipdM2txc?B04QZLp5$19tNWeSf9z');


# Localized Language Stuff

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'american393stg' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'WPE_APIKEY', '9f01415c0e945a0232233082481a85074eebf33d' );

define( 'WPE_CLUSTER_ID', '405221' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_SFTP_ENDPOINT', '34.169.127.16' );

define( 'WPE_LBMASTER_IP', '' );

define( 'WPE_CDN_DISABLE_ALLOWED', true );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'american393stg.wpengine.com', 1 => 'american393stg.wpenginepowered.com', );

$wpe_varnish_servers=array ( 0 => '127.0.0.1', );

$wpe_special_ips=array ( 0 => '34.19.64.53', 1 => 'pod-405221-utility.pod-405221.svc.cluster.local', );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( 'default' =>  array ( 0 => 'unix:///tmp/memcached.sock', ), );
define('WPLANG','');

# WP Engine ID


# WP Engine Settings






# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', __DIR__ . '/');
require_once(ABSPATH . 'wp-settings.php');
