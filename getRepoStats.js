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
			filterStats(html,tn);
		})
	}).on('error', (e) => { console.log(e) });
	req.end();

};

function filterStats(html,tn) {

	var $ = cheerio.load(html);
	var repoName = $('.repo-list-item').find('.repo-list-name').children().first().text().trim();
	if(!repoName){
		console.log(tn+" :fail to get the repo info,please retry...");
		return;
	}
	var statsArray = [repoName];
	var stats = $('.repo-list-item').children().first().text().trim();
	statsArray = statsArray.concat(stats.split(/\s+/))
	var updateTime = $('.repo-list-item').find('.repo-list-meta').children().first().text().trim();
	statsArray.push(updateTime);
	showInfo(statsArray)
}

function showInfo(data) {

	var info = '仓库(repo)：' + fixedLength(data[0], 25) + '开发(language)：' + fixedLength(data[1], 15) + 'stars：'
		+ fixedLength(data[2], 10) + 'forks：' + fixedLength(data[3], 10) + '更新时间(time)： ' + data[4];
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