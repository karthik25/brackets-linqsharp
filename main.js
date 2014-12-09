/*!
 * Brackets LinqSharp Extension
 *
 * An extension to integrate brackets-omnisharp-linqpad
 *
 * @author Karthik Ananthapadmanaban
 * @license http://opensource.org/licenses/MIT
 */

define(function (require, exports, module) {
    "use strict";

    var AppInit         = brackets.getModule("utils/AppInit"),
		CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        FileUtils       = brackets.getModule("file/FileUtils"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
		ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain      = brackets.getModule("utils/NodeDomain"),
		MainViewManager = brackets.getModule("view/MainViewManager"),
		Directory       = brackets.getModule("filesystem/Directory");

	var simpleDomain = new NodeDomain("simple", ExtensionUtils.getModulePath(module, "src/node/SimpleDomain"));

	AppInit.appReady(function(){
		// create the linqs folder
		var moduleDirectory = FileUtils.getNativeModuleDirectoryPath(module);
		moduleDirectory = moduleDirectory.substring(0, moduleDirectory.indexOf("extensions")) + "linqs";
		console.log('[brackets-linqsharp] ' + moduleDirectory);
		var directory = FileSystem.getDirectoryForPath(moduleDirectory);
		directory.create(function(){
			console.log('[brackets-linqsharp] created the directory');
		});
	});

    // Private functions
    function selectAllTextFromCurrentDocument() {
        var document = DocumentManager.getCurrentDocument();
        if (document) {
            return document.getText();
        }
        return null;
    }

	function getPathForNewFile() {
		var moduleDirectory = FileUtils.getNativeModuleDirectoryPath(module);
		moduleDirectory = moduleDirectory.substring(0, moduleDirectory.indexOf("extensions"));
		console.log('[brackets-linqsharp] Base directory :: ' + moduleDirectory);
        var path = moduleDirectory + "linqs/";
		var currentPath = MainViewManager.getCurrentlyViewedPath();
        console.log('[brackets-linqsharp] ' + currentPath);
		var fileName = FileUtils.getFilenameWithoutExtension(FileUtils.getBaseName(currentPath));
		path = path + fileName + '.linq';
		console.log('[brackets-linqsharp] ' + path);
		return path;
	}

    function generatePathForNewFile(path){
        var newFile = FileSystem.getFileForPath(path);
        return newFile;
    }
    
    function saveAsLinqFile(){
		var file_name = getPathForNewFile();
        var newFile = generatePathForNewFile(file_name);
        var document = selectAllTextFromCurrentDocument();
        if (document) {
            var allText = '<Query Kind="Program" />' + document;
            FileUtils.writeText(newFile, allText, true).then(function () {
                simpleDomain.exec("launchLinq", file_name)
							.done(function () {
								console.log("[brackets-linqsharp] Launched linqpad");
							}).fail(function (err) {
								console.error("[brackets-linqsharp] failed to run the process", err);
							});
            }, function () {
                alert('Unable to save the .linq file :: verify if you have the appropriate permissions');
            });
        }
    }
    
    // Function to run when the menu item is clicked
    function saveFileAndLaunchLinqPad() {
        saveAsLinqFile();
    }

    // First, register a command - a UI-less object associating an id to a handler
    var MY_LINQ_LAUNCH_MENU_ID = "brackets_linqsharp.save_file_launch_linqpad";   // package-style naming to avoid collisions
    CommandManager.register("Open File in LinqPad", MY_LINQ_LAUNCH_MENU_ID, saveFileAndLaunchLinqPad);
    
    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.addMenu("Run", "linq-menu");
    menu.addMenuItem(MY_LINQ_LAUNCH_MENU_ID);
});
