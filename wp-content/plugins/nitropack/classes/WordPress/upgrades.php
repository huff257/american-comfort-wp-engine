<?php

namespace NitroPack\WordPress;

/**
 * Initialize the checking for plugin updates.
 */
function check_for_nitropack_upgrades() {
	$properties = array(
		// This must match the key in "https://wpe-plugin-updates.wpengine.com/plugins.json".
		'plugin_slug'     => 'nitropack',
		// This must be the result of calling plugin_basename( __FILE__ ) IN YOUR MAIN PLUGIN's FILE.
		'plugin_basename' => NITROPACK_BASENAME, 
	);

	require_once __DIR__ . '/PluginUpdater.php';
	new \NitroPack\WordPress\PluginUpdater( $properties );
}
add_action( 'admin_init', __NAMESPACE__ . '\check_for_nitropack_upgrades' );