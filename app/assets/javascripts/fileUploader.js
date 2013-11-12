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

	selectNames: function(data) {
		var checkbox = '<form name="select-names">';

		console.log(data.names);

		for (var i = 0; i < data.names.length; i++) {
			if (data.names[i]) {
				checkbox += '<input type="checkbox" name="name" value="' + data.names[i] + '">' + data.names[i] + "</br>";
			}
		}

		checkbox += '<button value="submit" type="submit"></button></form>';

		$('body').append(checkbox);

		$('form[name="select-names"]').on("submit", function(e) {
			 FileUploader.submitNameChecker(e, data);	
		});
	},

	submitNameChecker: function(e, data) {
		e.preventDefault();

		var names = [];

		$('input[name="name"]').each(function() {
			$this = $(this);
			if ($this.is(":checked")) {
				names.push($this.val());
			}
		});

		data["names"] = names;

		var posting = $.post("/mapper/extract", { data: data }, "json");

		posting.done(FileUploader.buildTable);

		var detailBtn = '<button value="More Details" id="more-details-mapper">More Details</button>'

		$("body").append(detailBtn);
		$("button#more-details-mapper").click(FileUploader.getMoreInfo);

	},

	buildTable: function(data) {
		var tableHeaders = '<table id="results-table"><thead><tr><th>Name</th><th>Chain</th><th>Address</th></tr></thead><tbody></tbody></table>';
		$('body').append(tableHeaders);

		for (var i = 0; i < data.length; i++) {
			if (data[i]) {
				var rowStr = '<tr><td>' + data[i]['name'] + '</td><td>' + data[i]['chain'] + '</td><td>' + data[i]['addresses'] + '</td>';
				$("#results-table").append(rowStr);
			}
		};
	},

	submitFormColumns: function(e) {
		e.preventDefault();
		var formData = {
			column1: $('select[name="column1"]').val(),
			column2: $('select[name="column2"]').val(),
			filepath: $('input[name="filepath"]').val()
		};

		console.log(formData);

		$.post("/mapper/confirm", { data: formData }, FileUploader.selectNames, "json");
	},

	displayOptionsSelector: function(data) {

		var formTagOpen = '<form id="form-stores" name="columnHeaderCheck">';
		var options = [];
		for (var i = 0; i < data.length; i++) {
			if (i !== data.length - 1) {
				var option = '<option ' + 'value="' + data[i] + '">' + data[i] + '</option>';
				options.push(option);
			}
		}
		var selectOptions = options.join("");
		var hidden = '<input type="hidden" name="filepath" value="' + data.pop() + '"></input>';
		var button = '<button value="submit" type="submit"></button>';

		var outputString = formTagOpen + '<select name="column1">' + selectOptions + '</select><select name="column2">' + selectOptions + '</select>' + hidden + button + '</form>';
		$('body').append(outputString);

		$('#form-stores').on('submit', FileUploader.submitFormColumns);
		
	},

	getMoreInfo: function() {
		var data = FileUploader.buildFromTable();

		$.post("/mapper/more", { data: data }, "json");
	},

	buildFromTable: function() {
		var addresses = [];
		$("tr").each(function() {
			var info = {
				name: $(this).find("td").eq(1).text(),
				address: $(this).find("td:last-child").text()
			}
			addresses.push(info);
		});
		return addresses
	}
}


$(document).ready(function() {
	FileUploader.init();
});