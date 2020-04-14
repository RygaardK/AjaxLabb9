$(document).ready(() => {
	let titleString = '';
	let authorString = '';
	let inputKeyTitle = document.getElementById('title');
	inputKeyTitle.addEventListener('keyup', titleEventCallback);
	let inputKeyAuthor = document.getElementById('author');
	inputKeyAuthor.addEventListener('keyup', authorEventCallback);
	let loadBookButton = $('#loadBookButton');
	let addBookButton = $('#addBookButton');
	let changeLibraryButton = $('#changeLibraryButton');
	let key = 'qHaVd';

	function titleEventCallback(event) {
		titleString = event.target.value;
		console.log(titleString);
	}
	function authorEventCallback(event) {
		authorString = event.target.value;
		console.log(authorString);
	}
	///

	changeLibraryButton.on('click', event => getNewAPIkey())
	function getNewAPIkey() {
		const url = "https://www.forverkliga.se/JavaScript/api/crud.php";
		const settings = {
			method: 'GET',
			data: {
				requestKey: ""
			}
		};
		let jqXHR = $.ajax(url, settings);
		jqXHR.done(data => onSuccessGetNewAPIkey(data)).fail(onFailureGetNewAPIkey);
	}

	
	function onSuccessGetNewAPIkey(data) {
		let newAPIobject = JSON.parse(data);
		document.documentElement.style.setProperty('--headerRight-color', "successBackground");
		document.getElementById("headerRightInfo").innerHTML = "You got a new API!";
		console.log(newAPIobject);
		key = newAPIobject.key;
	}
	function onFailureGetNewAPIkey(message) {
		console.log('AJAX FAILD TO GET NEW API', message); /// OUTPut HTML
		document.documentElement.style.setProperty('--headerRight-color', "warningBackground");
		document.getElementById("headerRightInfo").innerHTML = "Failed, no new API!";
	}
	

	////

	addBookButton.on('click', event => sendRequestAddBook(6))
	function sendRequestAddBook(tryCount) {
		const url = 'https://www.forverkliga.se/JavaScript/api/crud.php';
		const settings = {
			method: 'GET',
			data: {
				key: key,
				op: 'insert',
				title:  titleString,
				author:  authorString 
			},

		};
		let jqXHR = $.ajax(url, settings);
		jqXHR.done(data => onSuccessAdd(data, tryCount)).fail(onFailureAdd);
	}

	function onSuccessAdd(data, tryCount) {
		let book = JSON.parse(data);
		console.log('onSuccess ADD: ', book.status);	// IF på status, OUTPUT i html
		
		if(book.status == 'error' && tryCount >= 0){
			tryCount = tryCount - 1;
			console.log('Try: ', tryCount);
			sendRequestAddBook(tryCount);
		} else if (book.status == 'error'){
			console.log('ALL TRIES ARE OUT!');
			document.getElementById("addBookInfo").innerHTML = "Failed to add book!";
			document.documentElement.style.setProperty('--mainLeft-color', "warningBackground");
		} else if (book.status == 'success'){
			console.log(book.status, book.id);
			document.documentElement.style.setProperty('--mainLeft-color', "successBackground");	
			document.getElementById("addBookInfo").innerHTML = "Success, your book is added!";				
		} else {
			console.log('SOMETHINGY IS WRONGY!')
		}

	}
	function onFailureAdd(message) {
		console.log('AJAX ADD onFailure', message); /// OUTPut HTML
		document.documentElement.style.setProperty('--mainLeft-color', "warningBackground");
		document.getElementById("addBookInfo").innerHTML = "Failed to add book!";
	}

	loadBookButton.on('click', event => loadBooks(6))
		function loadBooks(tryCount) {
			const url = 'https://www.forverkliga.se/JavaScript/api/crud.php';
			const settings = {
				method: 'GET',
				data: {
					key: key,
					op: 'select',
				},
			};
		let jqXHR = $.ajax(url, settings);
		console.log(jqXHR);
		
		jqXHR.done(data => onSuccessLoad(data, tryCount)).fail(onFailureLoad);
	}
	
	function onSuccessLoad(data, tryCount) {
		let book = JSON.parse(data);
		if(book.status == 'error' && tryCount >= 0){
			tryCount = tryCount - 1;
			console.log('Try: ', tryCount);
			loadBooks(tryCount);
		} else if (book.status == 'error'){
			console.log('ALL TRIES ARE OUT!');/// OUTPut HTML   KVAR 
			document.documentElement.style.setProperty('--mainRight-color', "warningBackground");	
			document.getElementById("mainRightInfo").innerHTML = "Failed to load book!";
		} else if (book.status == 'success'){
			document.documentElement.style.setProperty('--mainRight-color', "successBackground");
			document.getElementById("mainRightInfo").innerHTML = "Sucess!";
			let newList = [...book.data];
			let libraryList = $('#libraryList');
			libraryList.html("");
			for (let i = 0; i < newList.length; i++){
				$( "#libraryList").append(
					"<li class='bookList'>" +
					"ID: " + newList[i].id +
					" Title: " + newList[i].title +
					" Author: " + newList[i].author +
					" Updated:<i> " + newList[i].updated +
					'</i></li>'
				);									
			}			
			
		} else {
			console.log('SOMETHINGY IS WRONGY!')/// OUTPut HTML
		}
	};

	function onFailureLoad(message) {
		console.log('AJAX LOAD onFailure', message); /// OUTPut HTML
		document.documentElement.style.setProperty('--mainRight-color', "warningBackground");
		document.getElementById("mainRightInfo").innerHTML = "Failed to load book!";
	}
});

