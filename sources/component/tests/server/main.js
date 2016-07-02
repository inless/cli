
import plugins from 'plugins';

var plugin = plugins('Plugin');

describe("Plugin server test", function() {
	it("plugin name", function() {
		assert.equal(plugin.name, 'Plugin');
	});
});

