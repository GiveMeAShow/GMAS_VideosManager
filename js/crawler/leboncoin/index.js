var lbcCrawler = function()
{
	this.simpleCrawler = require("simplecrawler");

	this.BASE_URL = "http://www.leboncoin.fr/annonces/offres/:region/occasions/?f=a&th=1&q=:item";
	this.DEFAULT_REGION = "ile_de_france";

	this.crawl = function(item, region, results)
	{
		if (_.isUndefined(region) || _.isNull(region))
		{
			region = DEFAULT_REGION;
		}
		console.log("Looking for %s in %s", item, region);

		var queryURL = BASE_URL.replace(":region", region).replace(":item", item);

		var lbcCrawler = simpleCrawler.crawl(queryURL);
		lbcCrawler.interval(500);
		lbcCrawler.on("fetchComplete", function(queueItem, responseBuffer, response) {
			results.push(queueItem);
		});

		lbcCrawler.start();
	}
}

