function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const completed = tweet_array.filter(tweet => tweet.source== 'completed_event' && tweet.activityType!= 'unknown');

	const counts = {};
	completed.forEach(function(tweet){
		const type = tweet.activityType;
		if(counts[type]== undefined){
			counts[type] = 0;
		}
		counts[type]++;
	});
	const activityData = Object.keys(counts).map(function(type){
		return{activityType: type, count: counts[type]};
	});
	activityData.sort((a,b)=>b.count - a.count);
	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding":{
		"x": {"field": "activityType", "type": "nominal", "title": "Activity type", "sort": "-y"},
	 	"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});