/**
 * Created by Jian on 1/14/2015.
 */
  var DyNews;
  (function($){
    var _insertPage = function(Jo, html, mode){
      switch( mode ){
        case 'cover':
          Jo.html(html);
          break;
        case 'head':
          Jo.html( html + Jo.html());
          break;
        default:
        case 'end':
          Jo.html( Jo.html() + html);
          break;
      }
    };
    $.fn.dyNews = function(config){

    };
    DyNews = function(selector, config){
      var _initProp = {
        url: '',
        data: [],
        pageSize : 5,
        currentPage : -1,
        imageSize: 'm',
        wrapper:'.dy-news-wrapper',
        preButton:'.dy-news-pagination-pre',
        nextButton:'.dy-news-pagination-next',
        insertMode:'end',
        itemClass:'dy-news-item',
        loadPage: function( page, callback ){
          var self = this;
          self.onBeforeLoad();
          $.get(self.url, { page: page, size: self.pageSize },function( response ){
            if( response.status == 1 ){
              self.data[ page ] = response.data;
              if( typeof callback == 'function' ){
                callback( response.data )
              }
              self.onAfterLoad();
            }else{
              callback( [] );
            }
          });
        },
        onAfterLoad:function(){},
        onBeforeLoad:function(){},
        loadNextPage : function(){
          var self = this;
          this.loadPage(this.currentPage + 1)
        },
        formatPage: function(pageData , callback){
          if(!pageData){
            return ''
          }
          var _pageHtml = '';
          for(var i = 0; i < pageData.length; i++){
            _pageHtml += this.formatNews(pageData[i]);
          }
          return _pageHtml;
        },
        onBeforeFormat:function(){},
        onAfterFormat:function(){},
        formatNews:function(news){
          console.log(news)
          var _createdDate = new Date(news.createdTime);
          var imagesHtml = '';
          for(var i = 0; i<news.images.length; i++){
            imagesHtml += '<div class="dy-news-item-image"><img style="height: 100%;width: 100%;" src="'+ '/painting/upload/image/org/'+ this.orgId  +'/static/'+ news.images[i] +'-'+this.imageSize +'.jpg"></div>'
          }
          var _newsHtml = '<div class="'+ this.itemClass+'">\n<div class="dy-news-item-head"><span class="dy-news-item-time">'
            + _createdDate.getFullYear() + '-' + ( _createdDate.getMonth() + 1 ) + '-' + _createdDate.getDate() + ' ' + _createdDate.getHours() + ':' + _createdDate.getMinutes() + ':' + _createdDate.getSeconds()
            + '</span>\n</div>\n<p class="dy-news-item-content">'
            + ( news.content || '(空)' )
            + '</p>\n<div class="dy-news-item-attachment">\n'
            + ( '' )
            + '<div class="clearfix"></div>\n</div>\n</div>';
          return _newsHtml;
        },
        showPage: function(page, callback){
          this.onBeforeShow();
          if(typeof callback != 'function'){
            callback = function(){};
          }
          if(typeof page != 'number'|| page < 0 ){
            page =this.currentPage;
          }
          if(this.data[page] && this.data[page].length > 0){
            _insertPage( this.find(this.wrapper), this.formatPage( this.data[ page ] ), this.insertMode );
            this.currentPage = page;
            callback();
            this.onAfterShow();
          }else{
            var self = this;
            this.loadPage(page, function(data){
              if(data.length > 0){
                _insertPage(self.find(self.wrapper), self.formatPage( data ), self.insertMode );
                self.currentPage = page;
                callback();
                self.onAfterShow()
              }
            })
          }
        },
        onBeforeShow:function(){},
        onAfterShow:function(){}
      };
      var news = $( selector );
      $.fn.extend( news, _initProp , config );
      news.url = news.url || '/cake/news/'+news.orgId;

      news.find( news.nextButton ).click(function(){
        var btn = $(this).attr('disabled','');
        news.showPage( news.currentPage + 1, function(){
          btn.removeAttr('disabled');
        });
      });
      news.find( news.preButton ).click(function(){
        var btn = $(this).attr('disabled','');
        news.showPage( news.currentPage - 1, function(){
          btn.removeAttr('disabled');
        });
      });
      news.showPage(0);
      return news;
    }
  })($);
