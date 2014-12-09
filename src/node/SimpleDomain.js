/*!
 * Brackets LinqSharp Extension
 *
 * An extension to integrate brackets-omnisharp-linqpad
 *
 * @author Karthik Ananthapadmanaban
 * @license http://opensource.org/licenses/MIT
 */

(function () {
    "use strict";
    
    function launchProcess(file_name) {
		var exec = require("child_process").exec,
			child;

		console.log('[brackets-linqsharp] ' + file_name);

		child = exec("\"c:\\Program Files (x86)\\LINQPad4\\LINQPad.exe\" " + file_name, function (error, stdout, stderr) {
			console.log(error);
		});
    }
    
    function init(domainManager) {
        if (!domainManager.hasDomain("simple")) {
            domainManager.registerDomain("simple", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "simple",       // domain name
            "launchLinq",    // command name
            launchProcess,   // command handler function
            false,          // this command is synchronous in Node
            "Launches linq",
            [{name: "file_name", // parameters
                type: "string",
                description: "The file to be opened"}],
            []
        );
    }
    
    exports.init = init;
    
}());
