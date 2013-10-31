var fileUploaderSettings;
var progress = document.getElementsByTagName("progress");
var FileUploader = {
	settings: function() {
		return {

		}
	},

	init: function() {
		this.uiBindings();
	},

	uiBindings: function() {
		// $("form#file-submit").submit(FileUploader.fileShow);
		$("form#file-submit").submit(FileUploader.fileSubmit);
	},

	fileShow: function(e) {
		e.preventDefault();
		var nBytes = 0,
			file = document.getElementById("file-input").files[0],
			reader = new FileReader();
		var body = document.getElementsByTagName("body");
		reader.onload = function(e) {
			body[0].style.background = 'url(' + event.target.result + ') no-repeat center';
		};

		console.log(file);
		reader.readAsDataURL(file);
	},

	fileSubmit: function(e) {
		e.preventDefault();

		var file = document.getElementById("file-input").files[0];

		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("file", file);

		xhr.upload.addEventListener("progress", FileUploader.handleUploadProgress, false);

		// if (xhr.status === 200) {
		// 	var data = JSON.parse(xhr.responseText);
		// }

		// function xhrListener() {
		// 	console.log(this.responseText);
		// }

		xhr.addEventListener("load", function() {
			var data = JSON.parse(this.responseText);
			FileUploader.displayOptionsSelector(data);
		});

		// xhr.onload = xhrListener;

		xhr.open('post', '/mapper/map', true);

		xhr.send(formData);

		

		// console.log(data);

		// var reader = new FileReader();
		// var xhr = new XMLHttpRequest();
		// this.xhr = xhr;

		// var self = this;

		// xhr.open("POST", "/mapper/map");
		// // xhr.setRequestHeader("FILENAME", file.name);
		// xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		// xhr.send(file.name);

		var thisFile = new FormData($('form')[0]);

		// $.post("/mapper/map", { file: thisFile }, {dataType: false});

		// $.ajax({
		// 	url: "/mapper/map",
		// 	contentType: false,
		// 	processData: false,
		// 	type: "POST",
		// 	data: thisFile
		// });

		// xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

		// reader.onload = function(evt) {
		// 	xhr.sendAsBinary(evt.target.result);
		// };

		// reader.readAsBinaryString(file);
	},

	handleUploadProgress: function(e) {
		var percent = e.loaded / e.total * 100;
		console.log("Percent loaded: " + percent + "%");
		progress[0].setAttribute("value", percent);
	},

	displayOptionsSelector: function(data) {
		var form = document.createElement(form);
		$form = $(form);
		$('body').append($form);
		var checkBox = '<input type="checkBox">';
		for (var i = 0; i < data.length - 1; i++) {
			$('form').append(checkBox);
			var label = '<label>' + data[i] + '</label>';
			$('form').append(label);
		}
	}
}


$(document).ready(function() {
	FileUploader.init();
});