var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;

router.get("/run_crawl", function(req, res, next){
    let url = "http://www.kyobobook.co.kr/search/SearchCommonMain.jsp?vPstrCategory=TOT&vPstrKeyWord=node.js&vPplace=top";
    var page_req = function(url){
        url = url;
        return new Promise(function(resolve, reject){
            request({
                    method:'GET',
                    uri : url,
                    mutipart:[{
                        'content-type' :'text/html;charset=utf-8'
                    }],
                    encoding: 'binary',
                    headers:{'User-Agent':"Mozilla/5.0"}
                }, function(err, res, body){
                    var contentType =  res.headers['content-type'].toLowerCase();
                    if(contentType.indexOf('utf')>-1){
                        request({
                            method:'GET',
                            uri : url,
                            mutipart:[{
                                'content-type' :'text/html;charset=utf-8'
                            }],
                            headers:{'User-Agent':"Mozilla/5.0"}
                        },function(err, ress, html){
                            resolve(html)
                        })
                    }else{
                        var iconv = new Iconv('EUC-KR', 'UTF-8')
                        var searchResultBin = new Buffer(body, 'binary');
                        var html = iconv.convert(searchResultBin).toString();
                        resolve(html)
                    }
                }
            )
        })
    }

    page_req(url).then(function(html){
        var $ = cheerio.load(html);
        // console.log(html);
        var total = $('.cover');
        var count = total.length;
        let img = [];
        let grade = [];
        let img1 = $("img", ".cover");
        for(let i = 0; i < img1.length; i++){
            img.push(img1[i].attribs.src)
        }
        //console.log(img);

        let title = $('.detail').children('.title').text();
        //console.log(title)

        let price = $(".price").children(".org_price").text();
        //console.log(price);

        $(".info a").each(function() {
            grade.push($(this).text());
        });
        //console.log(grade)
        res.render('run_crawl', { title: 'run_crawl', data:html, img:img, title:title, price:price, grade:grade });

    });

});

router.get('/list', function(req, res, next) {
    let url = "http://www.kyobobook.co.kr/search/SearchCommonMain.jsp?vPstrCategory=TOT&vPstrKeyWord=node.js&vPplace=top";
    var page_req = function (url) {
        url = url;
        return new Promise(function (resolve, reject) {
            request({
                    method: 'GET',
                    uri: url,
                    mutipart: [{
                        'content-type': 'text/html;charset=utf-8'
                    }],
                    encoding: 'binary',
                    headers: {'User-Agent': "Mozilla/5.0"}
                }, function (err, res, body) {
                    var contentType = res.headers['content-type'].toLowerCase();
                    if (contentType.indexOf('utf') > -1) {
                        request({
                            method: 'GET',
                            uri: url,
                            mutipart: [{
                                'content-type': 'text/html;charset=utf-8'
                            }],
                            headers: {'User-Agent': "Mozilla/5.0"}
                        }, function (err, ress, html) {
                            resolve(html)
                        })
                    } else {
                        var iconv = new Iconv('EUC-KR', 'UTF-8')
                        var searchResultBin = new Buffer(body, 'binary');
                        var html = iconv.convert(searchResultBin).toString();
                        resolve(html)
                    }
                }
            )
        })
    }

    page_req(url).then(function (html) {
        var $ = cheerio.load(html);
        // console.log(html);
        var total = $('.cover');
        var count = total.length;
        let img = [];
        let grade = [];
        let img1 = $("img", ".cover");
        for (let i = 0; i < img1.length; i++) {
            img.push(img1[i].attribs.src)
        }
        //console.log(img);

        let title = $('.detail').children('.title').text();
        //console.log(title)

        let price = $(".price").children(".org_price").text();
        //console.log(price);

        $(".info a").each(function () {
            grade.push($(this).text());
        });
        //console.log(grade)
        res.render('list', {title: 'list', data: html, img: img, title: title, price: price, grade: grade});
    });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
