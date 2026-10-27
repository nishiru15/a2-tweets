let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	written_tweets = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at)).filter(tweet => tweet.written);
	update()
}

function update(){
	//DO THIS
	const searchText =  document.getElementById('textFilter').value;
	const table = document.getElementById('tweetTable');
	document.getElementById('searchText').innerText = searchText;
	if (searchText == '') {
		document.getElementById('searchCount').innerText = 0;
		table.innerHTML = '';
		return;
	}
	const query = searchText.toLowerCase();
	const matches = written_tweets.filter(tweet => tweet.writtenText.toLowerCase().includes(query));
	document.getElementById('searchCount').innerText = matches.length;
	let rows = '';
	matches.forEach(function(tweet, i) {
		rows += tweet.getHTMLTableRow(i + 1);
	});
	table.innerHTML = rows;
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', update);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});