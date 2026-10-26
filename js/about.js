


function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	tweet_array.sort(function(a,b){
		return a.time.getTime() - b.time.getTime();
	});

	const earliestDate = tweet_array[0].time;
	const latestDate = tweet_array[tweet_array.length-1].time;
	const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

	document.getElementById('firstDate').innerText = earliestDate.toLocaleDateString('en-US', options);
	document.getElementById('lastDate').innerText = latestDate.toLocaleDateString('en-US', options);

	let completedCount = 0;
	let liveCount = 0;
	let achievementCount = 0;
	let miscCount= 0;
	let writtenCount = 0;

	tweet_array.forEach(function(tweet){
		let cat = tweet.source;
		if(cat=='completed_event'){
			completedCount++;
			if(tweet.written){
				writtenCount++;
			}
		}
		else if(cat=='live_event'){
			liveCount++;
		}
		else if(cat== 'achievement'){
			achievementCount++;
		}
		else if(cat == 'miscellaneous'){
			miscCount++;
		}

	});

	const total = tweet_array.length;

	document.querySelectorAll('.completedEvents').forEach(el => el.innerText =completedCount);
	document.querySelector('.completedEventsPct').innerText = (completedCount / total * 100).toFixed(2) + '%';
	document.querySelector('.liveEvents').innerText = liveCount;
	document.querySelector('.liveEventsPct').innerText = (liveCount / total * 100).toFixed(2) + '%';
	document.querySelector('.achievements').innerText = achievementCount;
	document.querySelector('.achievementsPct').innerText = (achievementCount / total * 100).toFixed(2) + '%';
	document.querySelector('.miscellaneous').innerText = miscCount;
	document.querySelector('.miscellaneousPct').innerText = (miscCount / total * 100).toFixed(2) + '%';

	document.querySelector('.written').innerText = writtenCount;
	document.querySelector('.writtenPct').innerText = (writtenCount / completedCount * 100).toFixed(2) + '%';
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});