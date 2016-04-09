var ThumbnailTool = require('./model/ThumbnailTool');

$(document).ready(function(){

    var $imgForm = $('#imgForm');
    var $originPath = $('#imgForm input[name="originPath"]');
    var $savePath = $('#imgForm input[name="savePath"]');
    var $width = $('#imgForm input[name="width"]');
    var $height = $('#imgForm input[name="height"]');
    var $forceRatio = $('#imgForm input[name="forceRatio"]');
    var $sizeNumber = $('.size-number');
    var ratio = 0;

    $('.file-button').click(function() {
        $(this).next().click();
    });

    $('.file-input').change(function() {
        $(this).next().val(this.value);
    });
    $('#originFile').change(function() {
        ThumbnailTool.identify(this.value,function(err,features) {
            if (err) {
                return console.error(err);
            }
            $width.val(features.width || '');
            $height.val(features.height || '');
            if (features.width && features.height) {
                ratio = features.width / features.height;
            }
        });
    });

    $sizeNumber.change(function(){
        if (!$forceRatio.get(0).checked) {
            return console.log('not force ratio');
        }
        var $this = $(this);
        var val = parseInt($this.val(),10);
        if (!val) {
            return console.log('not a number',val);
        }
        var index = $sizeNumber.index($this);
        if (index == 0) {
            $sizeNumber.eq(1).val(parseInt(val/ratio,10));
        } else {
            $sizeNumber.eq(0).val(parseInt(val*ratio,10));
        }

    });

    $imgForm.submit(function() {
        try {
            var tool = new ThumbnailTool(
                $originPath.val(),
                $savePath.val(),
                $width.val(),
                $height.val()
            );
            tool.genThumbnail(function(err) {
                if (err) {
                    return alert(err);
                }
                alert('缩放成功');
            });
        } catch (e) {
            console.error(e);
            alert(e);
        }

        return false;
    });
})