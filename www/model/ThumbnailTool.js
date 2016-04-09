var im = require('imagemagick');
var fs = require('fs');
var slogger = require('../lib/slogger');
require('../lib/string');
var path = require('path');
/**
 * 缩微图处理抽象类
 * @param {string}originPath 给出的原图路径
 * @param {number}width 想要得到的缩微图的宽度
 * @param {number}height 想要得到的缩微图的高度
 * @param {string}gravity 裁剪位置，默认为Center
 * @constructor
 */
function ThumbnailTool(originPath,savePath, width, height, gravity) {
    slogger.debug('begin->orginPath:' + originPath + ',width:' + width + ',height:' + height + ',gravity:' + gravity);
	this.width = width;
	this.height = height;
	this.gravity = gravity || 'Center';
    /**
     * @public
     * @type {string}
    * 传递过来的原图路径
     */
    this.originPath = originPath;


    /**
     * @public
     * @type {string}
     * 生成缩微图保存的物理路径
     */
    this.savePath = savePath;

}


ThumbnailTool.FORMAT_THUMBNAIL = 'png';

ThumbnailTool.identify = function(path,callback) {
    im.identify(path,function(err,features) {
        if (err) {
            slogger.error('获取原图片数据失败',err);
            return callback('获取原图片数据失败')
        }
        callback(false,features);
    });
}

function getThumbnail(featuresOrigin, self, callback) {
    var startTime = new Date().getTime();
    slogger.debug('getThumbnail begin->' + startTime);
	var e = featuresOrigin.width/self.width - featuresOrigin.height/self.height;
	var option = {
	  srcPath: self.originPath,
	  dstPath: self.destPath,
	  format : ThumbnailTool.FORMAT_THUMBNAIL,
	  width: self.width,
	  height : self.height
	};
//	if (e == 0) {//直接缩放
        slogger.debug('resize directly [直接缩放]');
		im.resize(option,function(err, stdout, stderr) {
			if (err) {
                slogger.error('resize failded [缩放失败]',err);
				callback('缩放失败');
				return;
			}
            slogger.debug('resize success [缩放成功]');
            slogger.debug('resize directly time:' + (new Date().getTime() - startTime));
			callback(false);
		});
//	} else {
//        slogger.debug('need to clip and then resize [先裁剪后缩放]');
//		if(e > 0) {//新图高度比例比宽度比例大
//            option.height = featuresOrigin.height;
//            option.width = featuresOrigin.height*self.width/self.height;//根据新图的比例计算宽度
//		} else {//新图宽度比例比高度比例大
//            option.width = featuresOrigin.width;
//            option.height = self.height * featuresOrigin.width / self.width;//根据新图的比例计算高度
//		}
//		option.gravity = self.gravity;
//        var tmpFile = option.dstPath = self.destPath + Math.random();
//		im.crop(option,function(err, stdout, stderr) {//裁剪
//			if (err) {
//                slogger.error('clip failed [裁剪失败]');
//				callback(err);
//				return;
//			}
//
//            option.width = self.width;
//            option.height = self.height;
//            option.srcPath = tmpFile;
//            option.dstPath = self.destPath;
//            slogger.debug('begin resize [开始缩放]');
//            im.resize(option,function(err, stdout, stderr) {
//                fs.unlink(tmpFile);
//                if (err) {
//                    slogger.error('resize failed 2 [缩放失败2]');
//                    callback(err);
//                    return;
//                }
//                slogger.debug('resize success 2 [缩放成功2]');
//                slogger.debug('resize again time:' + (new Date().getTime() - startTime));
//                callback(false);
//            });
//
//		});
//	}
}

/**
 *
 * @param {function} callback 回调函数的形式为
 *      function(err, filename)
 *      其中err为出错对象，filename为返回的缩微图物理路径
 */
ThumbnailTool.prototype.genThumbnail = function(callback) {
    var beginTime = new Date().getTime();
    slogger.debug('genThumbnail begin->' + beginTime);
    var self = this;

    slogger.debug('event real path get emit time:' + (new Date().getTime()-beginTime));
    beginTime = new Date().getTime();

    slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# checkOriginPath');
    fs.exists(self.originPath, checkOriginPathFinished);

    function checkOriginPathFinished(exist) {
        slogger.debug('checkOriginPath:' + (new Date().getTime()-beginTime));

        slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# checkOriginPath finished');
        beginTime = new Date().getTime();
        if (exist) {
            slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# checkCache');
            fs.exists(self.savePath, checkSavePathFinished);
        } else {
            slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# checkOriginPath finished error');
            callback('原图未找到');
        }
    }

    function checkSavePathFinished(exist) {
        slogger.debug('checkCache time:' + (new Date().getTime()-beginTime));
        beginTime = new Date().getTime();
        slogger.debug('genThumbnail EVENT_REAL_PATH_GET save dir finished');
        if (!exist) {//保存目录不存在
            callback('保存目录不存在');
            return;
        }
        slogger.debug('genThumbnail EVENT_REAL_PATH_GET save dir exist');
        self.width = parseInt(self.width);
        self.height = parseInt(self.height);

        if (!isNaN(self.width) && !isNaN(self.height)) {//需要改变图片大小
            slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# need to change the image');
            im.identify(self.originPath, function(err,features) {
                slogger.debug('identify time:' + (new Date().getTime()-beginTime));
                slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# identify finished');
                if (err) {
                    slogger.error('genThumbnail EVENT_REAL_PATH_GET #on# identify finished err',err);
                    callback('获取图片数据时失败');
                    return;
                }
                slogger.debug('genThumbnail EVENT_REAL_PATH_GET #on# to get the thumbnail');
                var _originPath = self.originPath;

                var extname = path.extname(_originPath);
                var filename = path.basename(_originPath, extname)
                    + '_' + self.width + '_' + self.height + '.' + ThumbnailTool.FORMAT_THUMBNAIL;
                self.destPath = path.join(self.savePath,filename);
                getThumbnail(features, self, callback);
            });
        } else {//
            callback('宽高没有指定');
        }
    }
}

module.exports = ThumbnailTool;