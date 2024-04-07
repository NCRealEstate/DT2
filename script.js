(function(){
    var script = {
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "scripts": {
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "registerKey": function(key, value){  window[key] = value; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getKey": function(key){  return window[key]; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "unregisterKey": function(key){  delete window[key]; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "existsKey": function(key){  return key in window; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; }
 },
 "paddingBottom": 0,
 "children": [
  "this.MainViewer",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
  "this.Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE"
 ],
 "id": "rootPlayer",
 "width": "100%",
 "defaultVRPointer": "laser",
 "contentOpaque": false,
 "definitions": [{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165835_00_069_PureShot",
 "id": "panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163117_10_029_PureShot",
 "id": "panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170250_10_076_PureShot",
 "id": "panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164328_00_037_PureShot",
 "id": "panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F4D533_BAD1_F76C_41D1_036843397344_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170052_00_074_PureShot",
 "id": "panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165742_00_065_PureShot",
 "id": "panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163735_10_031_PureShot",
 "id": "panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170806_00_082_PureShot",
 "id": "panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170726_00_081_PureShot",
 "id": "panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164318_00_036_PureShot",
 "id": "panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165147_00_048_PureShot",
 "id": "panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165906_00_070_PureShot",
 "id": "panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163817_10_032_PureShot",
 "id": "panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164209_00_035_PureShot",
 "id": "panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164452_00_039_PureShot",
 "id": "panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170027_00_073_PureShot(1)",
 "id": "panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165928_00_071_PureShot",
 "id": "panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_162907_00_026_PureShot",
 "id": "panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165220_00_050_PureShot",
 "id": "panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170435_00_079_PureShot",
 "id": "panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170412_00_078_PureShot",
 "id": "panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163141_10_030_PureShot",
 "id": "panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165751_00_066_PureShot",
 "id": "panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170027_00_073_PureShot",
 "id": "panorama_B1F57192_BAD1_0F2C_4196_4076C138263E",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165803_00_067_PureShot",
 "id": "panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165826_00_068_PureShot",
 "id": "panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "items": [
  {
   "media": "this.panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7",
   "camera": "this.panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09",
   "camera": "this.panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F74409_BAD1_753C_41DE_257A00B2464B",
   "camera": "this.panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA",
   "camera": "this.panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB",
   "camera": "this.panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2",
   "camera": "this.panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7",
   "camera": "this.panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B",
   "camera": "this.panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699",
   "camera": "this.panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C",
   "camera": "this.panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902",
   "camera": "this.panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B",
   "camera": "this.panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064",
   "camera": "this.panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A",
   "camera": "this.panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC",
   "camera": "this.panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027",
   "camera": "this.panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C",
   "camera": "this.panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4D533_BAD1_F76C_41D1_036843397344",
   "camera": "this.panorama_B1F4D533_BAD1_F76C_41D1_036843397344_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3",
   "camera": "this.panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3",
   "camera": "this.panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4",
   "camera": "this.panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4",
   "camera": "this.panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689",
   "camera": "this.panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B",
   "camera": "this.panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900",
   "camera": "this.panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97",
   "camera": "this.panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB",
   "camera": "this.panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01",
   "camera": "this.panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243",
   "camera": "this.panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A",
   "camera": "this.panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548",
   "camera": "this.panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE",
   "camera": "this.panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986",
   "camera": "this.panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F57192_BAD1_0F2C_4196_4076C138263E",
   "camera": "this.panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 33, 34)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB",
   "camera": "this.panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 34, 35)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88",
   "camera": "this.panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 35, 36)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8",
   "camera": "this.panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 36, 37)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9",
   "camera": "this.panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 37, 38)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650",
   "camera": "this.panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 38, 39)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25",
   "camera": "this.panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 39, 40)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05",
   "camera": "this.panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 40, 41)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266",
   "camera": "this.panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 41, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165708_00_063_PureShot",
 "id": "panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164923_00_045_PureShot",
 "id": "panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165725_00_064_PureShot",
 "id": "panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164155_00_034_PureShot",
 "id": "panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164630_00_040_PureShot",
 "id": "panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164851_00_044_PureShot",
 "id": "panorama_B1F4D533_BAD1_F76C_41D1_036843397344",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F4D533_BAD1_F76C_41D1_036843397344_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170114_00_075_PureShot",
 "id": "panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_camera",
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7",
   "camera": "this.panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09",
   "camera": "this.panorama_B1FABE70_BAD1_15ED_41C8_AAF46CD1BC09_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F74409_BAD1_753C_41DE_257A00B2464B",
   "camera": "this.panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA",
   "camera": "this.panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB",
   "camera": "this.panorama_B1FEC925_BAD1_7F71_41E0_9FF4470B22FB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2",
   "camera": "this.panorama_B1FBBB95_BAD1_7357_41A2_B2BE356D37A2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7",
   "camera": "this.panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B",
   "camera": "this.panorama_B1F89091_BAD1_0D2C_41E0_E681D298C74B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699",
   "camera": "this.panorama_B1F9D2FF_BAD1_12D4_41E0_C1D35E4EB699_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C",
   "camera": "this.panorama_B1F798C2_BAD1_1D2C_41D1_0C7899714A5C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902",
   "camera": "this.panorama_B1F79E4E_BAD1_1535_41DF_519E7E054902_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B",
   "camera": "this.panorama_B1F7B3F0_BAD1_32EC_41C5_3C2744138E6B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064",
   "camera": "this.panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A",
   "camera": "this.panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC",
   "camera": "this.panorama_B1F41497_BAD1_1553_41E6_D2683B593AEC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027",
   "camera": "this.panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C",
   "camera": "this.panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4D533_BAD1_F76C_41D1_036843397344",
   "camera": "this.panorama_B1F4D533_BAD1_F76C_41D1_036843397344_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3",
   "camera": "this.panorama_B1F4FAA6_BAD1_FD75_41E3_4A645E2E7DB3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3",
   "camera": "this.panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4",
   "camera": "this.panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4",
   "camera": "this.panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689",
   "camera": "this.panorama_B1F44109_BAD1_0F3F_41C2_16DC12AA5689_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B",
   "camera": "this.panorama_B1F466B8_BAD1_355D_41CA_FA826E6F391B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900",
   "camera": "this.panorama_B1F47C3D_BAD1_3557_41BB_C19EB6518900_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97",
   "camera": "this.panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB",
   "camera": "this.panorama_B1F5B761_BAD1_13EC_41CC_2389EBAF24CB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01",
   "camera": "this.panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243",
   "camera": "this.panorama_B1F5A26F_BAD1_0DF3_41E5_112CC29C4243_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A",
   "camera": "this.panorama_B1F5E7EF_BAD1_72F3_41E1_A7F4E4D3D90A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548",
   "camera": "this.panorama_B1F59269_BAD1_0DFF_41DC_CE789C4F6548_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE",
   "camera": "this.panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986",
   "camera": "this.panorama_B1F5A6EC_BAD1_32F5_41DE_3C9CECD2B986_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F57192_BAD1_0F2C_4196_4076C138263E",
   "camera": "this.panorama_B1F57192_BAD1_0F2C_4196_4076C138263E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB",
   "camera": "this.panorama_B1F56C28_BAD1_157D_41DE_79CD91F458AB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 35)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88",
   "camera": "this.panorama_B1F556BB_BAD6_F553_41D1_CA1E978BCB88_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 35, 36)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8",
   "camera": "this.panorama_B1F4C110_BAD7_0F2C_41AF_148DDBD58EC8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 36, 37)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9",
   "camera": "this.panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 37, 38)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650",
   "camera": "this.panorama_B19A8E1C_BAD7_1554_41C8_720E6AA72650_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 38, 39)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25",
   "camera": "this.panorama_B19098B6_BAD7_3D54_41E3_9F6F1B2BEC25_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 39, 40)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05",
   "camera": "this.panorama_B192932F_BAD7_1373_41E7_2B9C7C0B6F05_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 40, 41)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_B1EFDD7C_BAD7_17D4_41C2_FEBBF3875266_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 41, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164701_00_042_PureShot",
 "id": "panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F4EFA6_BAD1_1374_41E2_B9C60E60084C_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "buttonToggleHotspots": "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration",
 "buttonCardboardView": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270"
 ],
 "buttonToggleGyroscope": "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F43F18_BAD1_335D_41DC_3F3D3249166A_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163002_10_027_PureShot",
 "id": "panorama_B1F74409_BAD1_753C_41DE_257A00B2464B",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F45B5C_BAD1_13D4_41B2_1F1CBF376AA4_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_165201_00_049_PureShot",
 "id": "panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F445D4_BAD1_16D5_41D3_1B60864011D4_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F40045_BAD1_0D34_41D8_5A26208DF3C3_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_162850_00_025_PureShot",
 "id": "panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1260864_BAD1_1DF5_41CA_E2536B79DED7_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170005_00_072_PureShot",
 "id": "panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F58C8F_BAD1_1533_41B0_623E080C80AE_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_163013_10_028_PureShot",
 "id": "panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1FE668F_BAD1_7533_41DE_1E717272CFFA_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5A1BF_BAD1_0F53_41C1_34DEEDFC2A97_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164649_00_041_PureShot",
 "id": "panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F41A39_BAD1_1D5F_41B5_364F8F744027_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_164339_00_038_PureShot",
 "id": "panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F46987_BAD1_3F33_41DB_803EF6D10064_t.jpg",
 "hfov": 360,
 "hfovMin": "150%",
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F5BCEC_BAD1_16F5_41D5_290215875B01_camera",
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1F74409_BAD1_753C_41DE_257A00B2464B_camera",
 "class": "PanoramaCamera"
},
{
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "rowCount": 8,
      "height": 4096,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "IMG_20240406_170349_00_077_PureShot",
 "id": "panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9",
 "vfov": 180,
 "partial": false,
 "thumbnailUrl": "media/panorama_B1F8639C_BAD7_1354_41E7_0987CB3FC9B9_t.jpg",
 "hfov": 360,
 "pitch": 0
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_B1FBBE0B_BAD1_753C_41CC_7E0B3C673CB7_camera",
 "class": "PanoramaCamera"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton MUTE"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png"
},
{
 "toolTipFontStyle": "normal",
 "paddingBottom": 0,
 "toolTipFontFamily": "Georgia",
 "id": "MainViewer",
 "left": 0,
 "width": "100%",
 "toolTipPaddingTop": 7,
 "transitionMode": "blending",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "toolTipBackgroundColor": "#000000",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "toolTipShadowOpacity": 0,
 "height": "100%",
 "class": "ViewerArea",
 "borderSize": 0,
 "progressHeight": 6,
 "toolTipFontColor": "#FFFFFF",
 "progressBottom": 55,
 "toolTipShadowSpread": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 0.5,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "progressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipPaddingLeft": 10,
 "progressLeft": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipDisplayTime": 600,
 "paddingRight": 0,
 "playbackBarHeight": 10,
 "progressBorderRadius": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipFontSize": 13,
 "toolTipBorderColor": "#767676",
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadOpacity": 1,
 "minHeight": 50,
 "top": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingTop": 0,
 "minWidth": 100,
 "toolTipPaddingRight": 10,
 "borderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingBottom": 7,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBottom": 5,
 "playbackBarHeadBorderRadius": 0,
 "propagateClick": true,
 "playbackBarBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarHeadBorderColor": "#000000",
 "progressOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderSize": 0,
 "playbackBarLeft": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "layout": "absolute",
 "height": 641,
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "propagateClick": true,
 "data": {
  "name": "--SETTINGS"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Image_1B99DD00_16C4_0505_41B3_51F09727447A",
  "this.Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
  "this.IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270"
 ],
 "id": "Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
 "left": "0%",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "bottom": 0,
 "height": 118,
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundImageUrl": "skin/Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48.png",
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0.64,
 "overflow": "visible",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--MENU"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--INFO photo"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_23F7B7B7_0C0A_6293_4197_F931EEC6FA48",
  "this.Container_23F097B8_0C0A_629D_4176_D87C90BA32B6"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--INFO photoalbum"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--PANORAMA LIST"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--LOCATION"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--FLOORPLAN"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_28215A13_0D5D_5B97_4198_A7CA735E9E0A"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_2820BA13_0D5D_5B97_4192_AABC38F6F169",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169, true, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--PHOTOALBUM + text"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--PHOTOALBUM"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
  "this.Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F"
 ],
 "creationPolicy": "inAdvance",
 "id": "Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.6,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "absolute",
 "data": {
  "name": "--REALTOR"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "visible": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "maxWidth": 1258,
 "id": "Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE",
 "left": "0%",
 "maxHeight": 953,
 "verticalAlign": "middle",
 "width": "5.398%",
 "url": "skin/Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "height": "7.606%",
 "shadow": false,
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image4523"
 },
 "horizontalAlign": "center",
 "paddingRight": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton FULLSCREEN"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton HS "
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton VR"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "visible": false
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "maxWidth": 49,
 "id": "IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270",
 "maxHeight": 37,
 "verticalAlign": "middle",
 "width": 100,
 "rollOverIconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270_rollover.png",
 "right": 30,
 "minHeight": 1,
 "paddingLeft": 0,
 "bottom": 8,
 "height": 75,
 "class": "IconButton",
 "shadow": false,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton VR"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton GYRO"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png"
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "verticalAlign": "middle",
 "contentOpaque": false,
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 110,
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "visible",
 "propagateClick": true,
 "data": {
  "name": "button menu sup"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "width": "91.304%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "bottom": "0%",
 "height": "85.959%",
 "shadow": false,
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "vertical",
 "data": {
  "name": "-button set"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "visible": false,
 "gap": 3
},
{
 "paddingBottom": 0,
 "maxWidth": 3000,
 "id": "Image_1B99DD00_16C4_0505_41B3_51F09727447A",
 "left": "0%",
 "maxHeight": 2,
 "verticalAlign": "middle",
 "right": "0%",
 "url": "skin/Image_1B99DD00_16C4_0505_41B3_51F09727447A.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "bottom": 53,
 "height": 2,
 "class": "Image",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "scaleMode": "fit_outside",
 "data": {
  "name": "white line"
 },
 "horizontalAlign": "center",
 "paddingRight": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.Button_1B998D00_16C4_0505_41AD_67CAA4AAEFE0",
  "this.Button_1B999D00_16C4_0505_41AB_D0C2E7857448",
  "this.Button_1B9A6D00_16C4_0505_4197_F2108627CC98",
  "this.Button_1B9A4D00_16C4_0505_4193_E0EA69B0CBB0",
  "this.Button_1B9A5D00_16C4_0505_41B0_D18F25F377C4",
  "this.Button_1B9A3D00_16C4_0505_41B2_6830155B7D52"
 ],
 "id": "Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
 "left": "0%",
 "width": 1199,
 "verticalAlign": "middle",
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 30,
 "scrollBarMargin": 2,
 "bottom": "0%",
 "height": 51,
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "propagateClick": true,
 "layout": "horizontal",
 "data": {
  "name": "-button set container"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 3
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "left": "10%",
 "backgroundColorDirection": "vertical",
 "right": "10%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "scroll",
 "propagateClick": false,
 "layout": "horizontal",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "left": "10%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "10%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "80%",
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "paddingRight": 20,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_23F797B7_0C0A_6293_41A7_EC89DBCDB93F",
  "this.Container_23F027B7_0C0A_6293_418E_075FCFAA8A19"
 ],
 "id": "Container_23F7B7B7_0C0A_6293_4197_F931EEC6FA48",
 "left": "10%",
 "backgroundColorDirection": "vertical",
 "right": "10%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "scroll",
 "propagateClick": false,
 "layout": "horizontal",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA"
 ],
 "id": "Container_23F097B8_0C0A_629D_4176_D87C90BA32B6",
 "left": "10%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "10%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "80%",
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "paddingRight": 20,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "backgroundColorDirection": "vertical",
 "right": "15%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "7%",
 "scrollBarMargin": 2,
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_221C0648_0C06_E5FD_4193_12BCE1D6DD6B",
  "this.Container_221C9648_0C06_E5FD_41A1_A79DE53B3031"
 ],
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "10%",
 "backgroundColorDirection": "vertical",
 "right": "10%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "scroll",
 "propagateClick": false,
 "layout": "horizontal",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "10%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "10%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "80%",
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "paddingRight": 20,
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
  "this.MapViewer"
 ],
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "backgroundColorDirection": "vertical",
 "right": "15%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "7%",
 "scrollBarMargin": 2,
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_28214A13_0D5D_5B97_4193_B631E1496339",
  "this.Container_2B0BF61C_0D5B_2B90_4179_632488B1209E"
 ],
 "id": "Container_28215A13_0D5D_5B97_4198_A7CA735E9E0A",
 "left": "15%",
 "backgroundColorDirection": "vertical",
 "right": "15%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "7%",
 "scrollBarMargin": 2,
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "backgroundColorDirection": "vertical",
 "right": "15%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "7%",
 "scrollBarMargin": 2,
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
  "this.Container_06C58BA5_1140_A63F_419D_EC83F94F8C54"
 ],
 "id": "Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
 "left": "10%",
 "backgroundColorDirection": "vertical",
 "right": "10%",
 "contentOpaque": false,
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 25,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "shadow": true,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "shadowHorizontalLength": 0,
 "backgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "overflow": "scroll",
 "propagateClick": false,
 "layout": "horizontal",
 "data": {
  "name": "Global"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81"
 ],
 "id": "Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F",
 "left": "10%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "right": "10%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "5%",
 "scrollBarMargin": 2,
 "bottom": "80%",
 "class": "Container",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "visible",
 "propagateClick": false,
 "layout": "vertical",
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "paddingRight": 20,
 "gap": 10
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "width": 60,
 "maxWidth": 60,
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 60,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "image button menu"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.shareTwitter(window.location.href)",
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton TWITTER"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "maxHeight": 58,
 "verticalAlign": "middle",
 "width": 58,
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "class": "IconButton",
 "shadow": false,
 "height": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.shareFacebook(window.location.href)",
 "backgroundOpacity": 0,
 "propagateClick": true,
 "data": {
  "name": "IconButton FB"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png"
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 0,
 "id": "Button_1B998D00_16C4_0505_41AD_67CAA4AAEFE0",
 "width": 120,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 0,
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "HOUSE INFO",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0.01
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0
 ],
 "gap": 5,
 "data": {
  "name": "Button house info"
 }
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_1B999D00_16C4_0505_41AB_D0C2E7857448",
 "width": 130,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 32,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "PANORAMA LIST",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 5,
 "data": {
  "name": "Button panorama list"
 }
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_1B9A6D00_16C4_0505_4197_F2108627CC98",
 "width": 90,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 32,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "LOCATION",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 5,
 "data": {
  "name": "Button location"
 }
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_1B9A4D00_16C4_0505_4193_E0EA69B0CBB0",
 "width": 103,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 32,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "FLOORPLAN",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 5,
 "data": {
  "name": "Button floorplan"
 }
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_1B9A5D00_16C4_0505_41B0_D18F25F377C4",
 "width": 112,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 32,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "PHOTOALBUM",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 5,
 "data": {
  "name": "Button photoalbum"
 }
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_1B9A3D00_16C4_0505_41B2_6830155B7D52",
 "width": 90,
 "verticalAlign": "middle",
 "fontFamily": "Montserrat",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "iconHeight": 32,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, true, 0, null, null, false)",
 "iconBeforeLabel": true,
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "borderColor": "#000000",
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "class": "Button",
 "shadow": false,
 "height": 40,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "REALTOR",
 "rollOverBackgroundOpacity": 0.8,
 "fontSize": 12,
 "backgroundOpacity": 0,
 "propagateClick": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "bold",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 5,
 "data": {
  "name": "Button realtor"
 }
},
{
 "paddingBottom": 0,
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "width": "85%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#000000"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "-left"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ],
 "gap": 10
},
{
 "paddingBottom": 20,
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "width": "50%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 50,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 460,
 "borderRadius": 0,
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "-right"
 },
 "horizontalAlign": "left",
 "paddingRight": 50,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "width": "25%",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "minHeight": 50,
 "paddingLeft": 0,
 "shadow": false,
 "height": "75%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg"
},
{
 "paddingBottom": 0,
 "children": [
  "this.ViewerAreaLabeled_23F787B7_0C0A_6293_419A_B4B58B92DAFC",
  "this.Container_23F7F7B7_0C0A_6293_4195_D6240EBAFDC0"
 ],
 "id": "Container_23F797B7_0C0A_6293_41A7_EC89DBCDB93F",
 "width": "85%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#000000"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "-left"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ],
 "gap": 10
},
{
 "paddingBottom": 20,
 "children": [
  "this.Container_23F017B8_0C0A_629D_41A5_DE420F5F9331",
  "this.Container_23F007B8_0C0A_629D_41A3_034CF0D91203",
  "this.Container_23F047B8_0C0A_629D_415D_F05EF8619564"
 ],
 "id": "Container_23F027B7_0C0A_6293_418E_075FCFAA8A19",
 "width": "50%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 50,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 460,
 "borderRadius": 0,
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "-right"
 },
 "horizontalAlign": "left",
 "paddingRight": 50,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "width": "25%",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA_rollover.jpg",
 "minHeight": 50,
 "paddingLeft": 0,
 "shadow": false,
 "height": "75%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA.jpg"
},
{
 "paddingBottom": 0,
 "children": [
  "this.HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "height": 140,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "header"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 70,
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "itemThumbnailScaleMode": "fit_outside",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "itemPaddingLeft": 3,
 "verticalAlign": "middle",
 "itemMaxWidth": 1000,
 "itemThumbnailWidth": 220,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "paddingLeft": 70,
 "scrollBarWidth": 10,
 "itemPaddingRight": 3,
 "itemBackgroundColor": [],
 "backgroundColor": [
  "#000000"
 ],
 "selectedItemLabelFontColor": "#04A3E1",
 "itemPaddingTop": 3,
 "itemThumbnailOpacity": 1,
 "class": "ThumbnailGrid",
 "borderSize": 0,
 "rollOverItemThumbnailShadow": true,
 "itemLabelPosition": "bottom",
 "itemLabelGap": 7,
 "itemThumbnailShadow": false,
 "itemLabelFontColor": "#666666",
 "scrollBarVisible": "rollOver",
 "itemBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "selectedItemThumbnailShadow": true,
 "backgroundOpacity": 0.05,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "selectedItemThumbnailShadowBlurRadius": 16,
 "itemOpacity": 1,
 "paddingRight": 70,
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "height": "100%",
 "itemBackgroundColorDirection": "vertical",
 "itemThumbnailBorderRadius": 0,
 "itemMinHeight": 50,
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "itemMode": "normal",
 "rollOverItemLabelFontColor": "#04A3E1",
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemLabelFontWeight": "normal",
 "itemHorizontalAlign": "center",
 "itemThumbnailHeight": 125,
 "selectedItemLabelFontWeight": "bold",
 "itemMaxHeight": 1000,
 "itemMinWidth": 50,
 "itemBackgroundOpacity": 0,
 "itemWidth": 220,
 "minHeight": 1,
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "itemPaddingBottom": 3,
 "scrollBarMargin": 2,
 "shadow": false,
 "paddingTop": 10,
 "minWidth": 1,
 "itemLabelTextDecoration": "none",
 "borderRadius": 5,
 "itemLabelFontFamily": "Montserrat",
 "itemHeight": 156,
 "itemLabelFontSize": 14,
 "scrollBarColor": "#04A3E1",
 "itemLabelFontStyle": "normal",
 "propagateClick": false,
 "data": {
  "name": "ThumbnailList"
 },
 "horizontalAlign": "center",
 "itemBorderRadius": 0,
 "itemLabelHorizontalAlign": "center",
 "backgroundColorRatios": [
  0
 ],
 "gap": 26,
 "itemVerticalAlign": "top"
},
{
 "paddingBottom": 0,
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "id": "Container_221C0648_0C06_E5FD_4193_12BCE1D6DD6B",
 "width": "85%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#000000"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "-left"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ],
 "gap": 10
},
{
 "paddingBottom": 20,
 "children": [
  "this.Container_221C8648_0C06_E5FD_41A0_8247B2B7DEB0",
  "this.Container_221B7648_0C06_E5FD_418B_12E57BBFD8EC",
  "this.Container_221B4648_0C06_E5FD_4194_30EDC4E7D1B6"
 ],
 "id": "Container_221C9648_0C06_E5FD_41A1_A79DE53B3031",
 "width": "15%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 50,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 400,
 "borderRadius": 0,
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "-right"
 },
 "horizontalAlign": "left",
 "paddingRight": 50,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "width": "25%",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "minHeight": 50,
 "paddingLeft": 0,
 "shadow": false,
 "height": "75%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg"
},
{
 "paddingBottom": 0,
 "children": [
  "this.HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "height": 140,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "header"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "toolTipFontStyle": "normal",
 "paddingBottom": 0,
 "toolTipFontFamily": "Arial",
 "id": "MapViewer",
 "transitionMode": "blending",
 "width": "100%",
 "toolTipPaddingTop": 4,
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "toolTipShadowOpacity": 1,
 "height": "100%",
 "class": "ViewerArea",
 "borderSize": 0,
 "progressHeight": 6,
 "toolTipFontColor": "#606060",
 "progressBottom": 2,
 "toolTipShadowSpread": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "progressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipPaddingLeft": 6,
 "progressLeft": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipTextShadowOpacity": 0,
 "paddingRight": 0,
 "playbackBarHeight": 10,
 "progressBorderRadius": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipDisplayTime": 600,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipFontSize": 12,
 "toolTipBorderColor": "#767676",
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "minHeight": 1,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingTop": 0,
 "minWidth": 1,
 "toolTipPaddingRight": 6,
 "borderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingBottom": 4,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBottom": 0,
 "playbackBarHeadBorderRadius": 0,
 "propagateClick": false,
 "playbackBarBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "data": {
  "name": "Floor Plan"
 },
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "progressOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderSize": 0,
 "playbackBarLeft": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.HTMLText_28217A13_0D5D_5B97_419A_F894ECABEB04",
  "this.IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3"
 ],
 "id": "Container_28214A13_0D5D_5B97_4193_B631E1496339",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "height": 140,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "header"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.ViewerAreaLabeled_281D2361_0D5F_E9B0_41A1_A1F237F85FD7",
  "this.IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D",
  "this.IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14"
 ],
 "id": "Container_2B0BF61C_0D5B_2B90_4179_632488B1209E",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "Container photo"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "Container photo"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "children": [
  "this.Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397"
 ],
 "id": "Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
 "width": "55%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundColor": [
  "#000000"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "-left"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ],
 "gap": 10
},
{
 "paddingBottom": 20,
 "children": [
  "this.Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
  "this.Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
  "this.Container_06C42BA5_1140_A63F_4195_037A0687532F"
 ],
 "id": "Container_06C58BA5_1140_A63F_419D_EC83F94F8C54",
 "width": "45%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 60,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 460,
 "borderRadius": 0,
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 1,
 "overflow": "visible",
 "propagateClick": false,
 "data": {
  "name": "-right"
 },
 "horizontalAlign": "left",
 "paddingRight": 60,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "width": "25%",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_rollover.jpg",
 "minHeight": 50,
 "paddingLeft": 0,
 "shadow": false,
 "height": "75%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81.jpg"
},
{
 "paddingBottom": 0,
 "maxWidth": 2000,
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "left": "0%",
 "maxHeight": 1000,
 "verticalAlign": "middle",
 "width": "100%",
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "height": "100%",
 "shadow": false,
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image"
 },
 "horizontalAlign": "center",
 "paddingRight": 0
},
{
 "paddingBottom": 0,
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 0,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 60,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "paddingBottom": 30,
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 520,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 100,
 "borderRadius": 0,
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container text"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "width": 370,
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 40,
 "class": "Container",
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "toolTipFontStyle": "normal",
 "paddingBottom": 0,
 "toolTipFontFamily": "Arial",
 "id": "ViewerAreaLabeled_23F787B7_0C0A_6293_419A_B4B58B92DAFC",
 "left": 0,
 "toolTipPaddingTop": 4,
 "transitionMode": "blending",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "right": 0,
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBackgroundOpacity": 1,
 "class": "ViewerArea",
 "toolTipShadowOpacity": 1,
 "progressBottom": 2,
 "borderSize": 0,
 "progressHeight": 6,
 "toolTipFontColor": "#606060",
 "playbackBarOpacity": 1,
 "toolTipShadowSpread": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "progressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipPaddingLeft": 6,
 "progressLeft": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipDisplayTime": 600,
 "paddingRight": 0,
 "playbackBarHeight": 10,
 "progressBorderRadius": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipFontSize": 12,
 "toolTipBorderColor": "#767676",
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "minHeight": 1,
 "top": 0,
 "toolTipFontWeight": "normal",
 "bottom": 0,
 "progressBarBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "shadow": false,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingTop": 0,
 "minWidth": 1,
 "toolTipPaddingRight": 6,
 "borderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingBottom": 4,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBottom": 0,
 "playbackBarHeadBorderRadius": 0,
 "propagateClick": false,
 "playbackBarBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "data": {
  "name": "Viewer info 1"
 },
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "progressOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderSize": 0,
 "playbackBarLeft": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD",
  "this.Container_23F7D7B7_0C0A_6293_4195_312C9CAEABE4",
  "this.IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4"
 ],
 "id": "Container_23F7F7B7_0C0A_6293_4195_D6240EBAFDC0",
 "left": "0%",
 "width": "100%",
 "verticalAlign": "middle",
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": "100%",
 "shadow": false,
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container arrows"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Container_23F017B8_0C0A_629D_41A5_DE420F5F9331",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 0,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 60,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "paddingBottom": 30,
 "children": [
  "this.HTMLText_23F067B8_0C0A_629D_41A9_1A1C797BB055",
  "this.Button_23F057B8_0C0A_629D_41A2_CD6BDCDB0145"
 ],
 "id": "Container_23F007B8_0C0A_629D_41A3_034CF0D91203",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 520,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 100,
 "borderRadius": 0,
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container text"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Container_23F047B8_0C0A_629D_415D_F05EF8619564",
 "width": 370,
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 40,
 "class": "Container",
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
 "left": "0%",
 "width": "77.115%",
 "scrollBarWidth": 10,
 "minHeight": 100,
 "paddingLeft": 80,
 "top": "0%",
 "scrollBarMargin": 2,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">Panorama list:</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText54192"
 },
 "paddingRight": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "maxHeight": 60,
 "verticalAlign": "top",
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "right": 20,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": 20,
 "shadow": false,
 "height": "36.14%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg"
},
{
 "paddingBottom": 0,
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "left": "0%",
 "backgroundColorDirection": "vertical",
 "right": "0%",
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14377.55330038866!2d-73.99492968084243!3d40.75084469078082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2s400+5th+Ave%2C+New+York%2C+NY+10018!5e0!3m2!1ses!2sus!4v1467271743182\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen>",
 "scrollEnabled": true,
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "bottom": "0%",
 "backgroundColor": [
  "#FFFFFF"
 ],
 "class": "WebFrame",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "insetBorder": false,
 "backgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "WebFrame48191"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [
  0
 ]
},
{
 "paddingBottom": 0,
 "id": "Container_221C8648_0C06_E5FD_41A0_8247B2B7DEB0",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 0,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 60,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "paddingBottom": 30,
 "children": [
  "this.HTMLText_221B6648_0C06_E5FD_41A0_77851DC2C548",
  "this.Button_221B5648_0C06_E5FD_4198_40C786948FF0"
 ],
 "id": "Container_221B7648_0C06_E5FD_418B_12E57BBFD8EC",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 520,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 100,
 "borderRadius": 0,
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container text"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Container_221B4648_0C06_E5FD_4194_30EDC4E7D1B6",
 "width": 370,
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 40,
 "class": "Container",
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
 "left": "0%",
 "width": "77.115%",
 "scrollBarWidth": 10,
 "minHeight": 100,
 "paddingLeft": 80,
 "top": "0%",
 "scrollBarMargin": 2,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">FLOORPLAN:</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText54192"
 },
 "paddingRight": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "maxHeight": 60,
 "verticalAlign": "top",
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "right": 20,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": 20,
 "shadow": false,
 "height": "36.14%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg"
},
{
 "paddingBottom": 0,
 "id": "HTMLText_28217A13_0D5D_5B97_419A_F894ECABEB04",
 "left": "0%",
 "width": "77.115%",
 "scrollBarWidth": 10,
 "minHeight": 100,
 "paddingLeft": 80,
 "top": "0%",
 "scrollBarMargin": 2,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">PHOTOALBUM:</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText54192"
 },
 "paddingRight": 0
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3",
 "maxHeight": 60,
 "verticalAlign": "top",
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3_rollover.jpg",
 "right": 20,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": 20,
 "shadow": false,
 "height": "36.14%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3.jpg"
},
{
 "toolTipFontStyle": "normal",
 "paddingBottom": 0,
 "toolTipFontFamily": "Arial",
 "id": "ViewerAreaLabeled_281D2361_0D5F_E9B0_41A1_A1F237F85FD7",
 "left": "0%",
 "width": "100%",
 "toolTipPaddingTop": 4,
 "transitionMode": "blending",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "toolTipShadowOpacity": 1,
 "height": "100%",
 "class": "ViewerArea",
 "borderSize": 0,
 "progressHeight": 6,
 "toolTipFontColor": "#606060",
 "progressBottom": 2,
 "toolTipShadowSpread": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "progressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipPaddingLeft": 6,
 "progressLeft": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipDisplayTime": 600,
 "paddingRight": 0,
 "playbackBarHeight": 10,
 "progressBorderRadius": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipFontSize": 12,
 "toolTipBorderColor": "#767676",
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "minHeight": 1,
 "top": "0%",
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingTop": 0,
 "minWidth": 1,
 "toolTipPaddingRight": 6,
 "borderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingBottom": 4,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBottom": 0,
 "playbackBarHeadBorderRadius": 0,
 "propagateClick": false,
 "playbackBarBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "data": {
  "name": "Viewer photoalbum + text 1"
 },
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "progressOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderSize": 0,
 "playbackBarLeft": 0
},
{
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D",
 "left": 10,
 "maxHeight": 60,
 "verticalAlign": "middle",
 "cursor": "hand",
 "width": "14.22%",
 "rollOverIconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D_rollover.png",
 "minHeight": 50,
 "paddingLeft": 0,
 "top": "20%",
 "bottom": "20%",
 "shadow": false,
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D_pressed.png",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D.png"
},
{
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "cursor": "hand",
 "width": "14.22%",
 "rollOverIconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14_rollover.png",
 "right": 10,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": "20%",
 "bottom": "20%",
 "shadow": false,
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14_pressed.png",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14.png"
},
{
 "toolTipFontStyle": "normal",
 "paddingBottom": 0,
 "toolTipFontFamily": "Arial",
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "width": "100%",
 "toolTipPaddingTop": 4,
 "transitionMode": "blending",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "toolTipShadowOpacity": 1,
 "height": "100%",
 "class": "ViewerArea",
 "borderSize": 0,
 "progressHeight": 6,
 "toolTipFontColor": "#606060",
 "progressBottom": 2,
 "toolTipShadowSpread": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "progressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipPaddingLeft": 6,
 "progressLeft": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipDisplayTime": 600,
 "paddingRight": 0,
 "playbackBarHeight": 10,
 "progressBorderRadius": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipFontSize": 12,
 "toolTipBorderColor": "#767676",
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "minHeight": 1,
 "top": "0%",
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderRadius": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingTop": 0,
 "minWidth": 1,
 "toolTipPaddingRight": 6,
 "borderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderSize": 1,
 "toolTipPaddingBottom": 4,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBottom": 0,
 "playbackBarHeadBorderRadius": 0,
 "propagateClick": false,
 "playbackBarBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "progressOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderSize": 0,
 "playbackBarLeft": 0
},
{
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "maxHeight": 60,
 "verticalAlign": "middle",
 "cursor": "hand",
 "width": "14.22%",
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "minHeight": 50,
 "paddingLeft": 0,
 "top": "20%",
 "bottom": "20%",
 "shadow": false,
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png"
},
{
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "maxHeight": 60,
 "verticalAlign": "middle",
 "cursor": "hand",
 "width": "14.22%",
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "right": 10,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": "20%",
 "bottom": "20%",
 "shadow": false,
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png"
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "maxWidth": 60,
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "maxHeight": 60,
 "verticalAlign": "top",
 "width": "10%",
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "right": 20,
 "minHeight": 50,
 "paddingLeft": 0,
 "top": 20,
 "shadow": false,
 "height": "10%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "paddingTop": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg"
},
{
 "paddingBottom": 0,
 "maxWidth": 2000,
 "id": "Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397",
 "left": "0%",
 "maxHeight": 1000,
 "verticalAlign": "bottom",
 "width": "100%",
 "url": "skin/Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397.jpg",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "0%",
 "height": "100%",
 "shadow": false,
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image"
 },
 "horizontalAlign": "center",
 "paddingRight": 0
},
{
 "paddingBottom": 0,
 "id": "Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 0,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 60,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 20,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "right",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 0
},
{
 "paddingBottom": 30,
 "children": [
  "this.HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
  "this.Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C"
 ],
 "id": "Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 520,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "100%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 100,
 "borderRadius": 0,
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container text"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Container_06C42BA5_1140_A63F_4195_037A0687532F",
 "width": 370,
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "height": 40,
 "class": "Container",
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container space"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 20,
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 10,
 "minHeight": 1,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">Lorem ipsum</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">dolor sit amet</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:3.47vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">consectetur adipiscing elit. Morbi bibendum pharetra lorem, accumsan san nulla.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.57vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.57vh;font-family:'Bebas Neue Bold';\"><B>Donec feugiat:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nisl nec mi sollicitudin facilisis </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nam sed faucibus est.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Ut eget lorem sed leo.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.57vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.57vh;font-family:'Bebas Neue Bold';\"><B>lorem ipsum:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.58vh;font-family:'Bebas Neue Bold';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText"
 },
 "paddingRight": 10
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "width": "46%",
 "backgroundColorDirection": "vertical",
 "fontFamily": "Bebas Neue Bold",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "iconHeight": 32,
 "iconBeforeLabel": true,
 "borderColor": "#000000",
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "backgroundColor": [
  "#04A3E1"
 ],
 "shadow": false,
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "height": "9%",
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "lorem ipsum",
 "rollOverBackgroundOpacity": 1,
 "fontSize": "3vh",
 "backgroundOpacity": 0.7,
 "propagateClick": false,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0
 ],
 "gap": 5,
 "data": {
  "name": "Button"
 }
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD",
 "maxHeight": 150,
 "verticalAlign": "middle",
 "width": "12%",
 "maxWidth": 150,
 "rollOverIconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD_rollover.png",
 "minHeight": 70,
 "paddingLeft": 0,
 "shadow": false,
 "height": "8%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD_pressed.png",
 "paddingTop": 0,
 "minWidth": 70,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD.png"
},
{
 "paddingBottom": 0,
 "id": "Container_23F7D7B7_0C0A_6293_4195_312C9CAEABE4",
 "width": "80%",
 "verticalAlign": "top",
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "minHeight": 1,
 "layout": "absolute",
 "height": "30%",
 "shadow": false,
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container separator"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 10
},
{
 "cursor": "hand",
 "paddingBottom": 0,
 "id": "IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4",
 "maxHeight": 150,
 "verticalAlign": "middle",
 "width": "12%",
 "maxWidth": 150,
 "rollOverIconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4_rollover.png",
 "minHeight": 70,
 "paddingLeft": 0,
 "shadow": false,
 "height": "8%",
 "class": "IconButton",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4_pressed.png",
 "paddingTop": 0,
 "minWidth": 70,
 "mode": "push",
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "paddingRight": 0,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4.png"
},
{
 "paddingBottom": 20,
 "id": "HTMLText_23F067B8_0C0A_629D_41A9_1A1C797BB055",
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 10,
 "minHeight": 1,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">Lorem ipsum</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">dolor sit amet</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:3.47vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">consectetur adipiscing elit. Morbi bibendum pharetra lorem, accumsan san nulla.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.57vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.57vh;font-family:'Bebas Neue Bold';\"><B>Donec feugiat:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nisl nec mi sollicitudin facilisis </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nam sed faucibus est.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Ut eget lorem sed leo.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText"
 },
 "paddingRight": 10
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_23F057B8_0C0A_629D_41A2_CD6BDCDB0145",
 "width": "46%",
 "backgroundColorDirection": "vertical",
 "fontFamily": "Bebas Neue Bold",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "iconHeight": 32,
 "iconBeforeLabel": true,
 "borderColor": "#000000",
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "backgroundColor": [
  "#04A3E1"
 ],
 "shadow": false,
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "height": "9%",
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "lorem ipsum",
 "rollOverBackgroundOpacity": 1,
 "fontSize": "3vh",
 "backgroundOpacity": 0.7,
 "propagateClick": false,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0
 ],
 "gap": 5,
 "data": {
  "name": "Button"
 }
},
{
 "paddingBottom": 20,
 "id": "HTMLText_221B6648_0C06_E5FD_41A0_77851DC2C548",
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 10,
 "minHeight": 1,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">location</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.79vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">address line 1</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">address line 2</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:5.15vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac.</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText"
 },
 "paddingRight": 10
},
{
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "iconWidth": 32,
 "id": "Button_221B5648_0C06_E5FD_4198_40C786948FF0",
 "width": 207,
 "backgroundColorDirection": "vertical",
 "fontFamily": "Bebas Neue Bold",
 "pressedBackgroundOpacity": 1,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "iconHeight": 32,
 "iconBeforeLabel": true,
 "borderColor": "#000000",
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "paddingLeft": 0,
 "layout": "horizontal",
 "height": 59,
 "class": "Button",
 "shadow": false,
 "backgroundColor": [
  "#04A3E1"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "label": "lorem ipsum",
 "rollOverBackgroundOpacity": 1,
 "fontSize": 34,
 "backgroundOpacity": 0.7,
 "propagateClick": false,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "normal",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "shadowSpread": 1,
 "backgroundColorRatios": [
  0
 ],
 "visible": false,
 "gap": 5,
 "data": {
  "name": "Button"
 }
},
{
 "paddingBottom": 10,
 "id": "HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "minHeight": 1,
 "height": "45%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.93vh;font-family:'Bebas Neue Bold';\">real estate agent</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText18899"
 },
 "paddingRight": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
  "this.HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE"
 ],
 "id": "Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C",
 "width": "100%",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "horizontal",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "height": "80%",
 "class": "Container",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "backgroundOpacity": 0.3,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "- content"
 },
 "horizontalAlign": "left",
 "paddingRight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "gap": 10
},
{
 "paddingBottom": 0,
 "id": "Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
 "maxHeight": 200,
 "verticalAlign": "top",
 "width": "25%",
 "maxWidth": 200,
 "url": "skin/Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0.jpg",
 "minHeight": 1,
 "paddingLeft": 0,
 "height": "100%",
 "shadow": false,
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "backgroundOpacity": 0,
 "propagateClick": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "agent photo"
 },
 "horizontalAlign": "left",
 "paddingRight": 0
},
{
 "paddingBottom": 10,
 "id": "HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE",
 "width": "75%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "paddingLeft": 10,
 "minHeight": 1,
 "height": "100%",
 "shadow": false,
 "class": "HTMLText",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">john doe</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.9vh;font-family:'Bebas Neue Bold';\">licensed real estate salesperson</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.79vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">Tlf.: +11 111 111 111</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">jhondoe@realestate.com</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">www.loremipsum.com</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV></div>",
 "backgroundOpacity": 0,
 "propagateClick": false,
 "data": {
  "name": "HTMLText19460"
 },
 "paddingRight": 10
}],
 "verticalAlign": "top",
 "desktopMipmappingEnabled": false,
 "scrollBarWidth": 10,
 "vrPolyfillScale": 0.5,
 "mobileMipmappingEnabled": false,
 "minHeight": 20,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "layout": "absolute",
 "shadow": false,
 "class": "Player",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 20,
 "height": "100%",
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "overflow": "visible",
 "propagateClick": true,
 "data": {
  "name": "Player468"
 },
 "horizontalAlign": "left",
 "downloadEnabled": false,
 "paddingRight": 0,
 "mouseWheelEnabled": true,
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
