const https = require('https')
const cheerio = require('cheerio')
const process = require('process')



function getList(tn) {
	var options = {
		hostname: 'github.com',
		port: 443,
		method: 'GET',
		path: '/search?utf8=%E2%9C%93&q=' + tn
	}

	var req = https.request(options, (res) => {
		var html = '';
		res.on("data", (d) => { html += d; });
		res.on("end", (e) => {
			filterStats(html);
		})
	}).on('error', (e) => { console.log(e) });
	req.end();

};

function filterStats(html) {

	var $ = cheerio.load(html);
	var repoName = $('.repo-list-item').find('.repo-list-name').children().first().text().trim();
	var statsArray = [repoName];
	var stats = $('.repo-list-item').children().first().text().trim();
	statsArray = statsArray.concat(stats.split(/\s+/))
	var updateTime = $('.repo-list-item').find('.repo-list-meta').children().first().text().trim();
	statsArray.push(updateTime);
	showInfo(statsArray)
}

function showInfo(data) {

	var info = '仓库：' + fixedLength(data[0], 25) + '开发语言：' + fixedLength(data[1], 15) + 'starts：'
		+ fixedLength(data[2], 10) + 'forks：' + fixedLength(data[3], 10) + '更新时间： ' + data[4];
	process.stdout.write(info + '\n')
}



function fixedLength(s, n) {
	var sLength = (s + '').length;
	if (sLength < n) {
		var fixed = new Array(n - sLength).join(" ");
	} else {
		fixed = '';
	}
	return s + fixed;
}


module.exports.getRepoStats = getList;