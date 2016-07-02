
import plugins from 'plugins';

var plugin = plugins('Plugin');

describe("Plugin client test", function() {
	it("plugin name", function() {
		assert.equal(plugin.name, 'Plugin');
	});
});

