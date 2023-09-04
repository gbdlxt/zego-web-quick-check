const GenerageLink = (function() {
    /**
     *  常量
     */
    // let LINK_TEMPLATE = `https://logcenter-new.oa.zego.im/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:${time})&_a=(columns:${columns},filters:${filters},index:${index},interval:auto,query:${query},sort:!(!('@timestamp',asc)))`;
    const ZDS_ACCESS_CLIENT_REPORT_INDEX = '4f890960-f021-11eb-b67b-a151f09c199f';
    const ZDS_CENTERSVR_BACKEND_INDEX = 'a1465460-f021-11eb-b67b-a151f09c199f'; // 查录制
    const ZDS_RTC_WEB_INDEX = '1fcbafa0-6651-11ed-a87e-3da84820e0b7';
    const NORMAL_TIME = '(from:now%2Fd,to:now%2Fd)'; // today

    const ZDS_ACCESS_CLIENT_REPORT_COLUMNS = '!(userid,action_detail,action,content)';
    const ZDS_CENTERSVR_BACKEND_COLUMNS = '!(app_id,operate,task_id,room_id,origin_req,stream_update_type)';
    const ZDS_RTC_WEB_COLUMNS = '!(event,device_id,device,room_id,listener_params,listener)';
    const ROOM_AND_STREAM_STATE_QUERY = encodeURI('"zc.al" OR "zm.al"');
    const ROOM_STATE_CHANGE_QUERY = encodeURI('"zm.al" OR "zm.rm.scb" OR "unload"')
    const PREVIEW_STATE_QUERY = encodeURI('"zm.al" OR "预览" OR "device"');
    const OSINFO_SDKVER_QUERY = encodeURI('"osinfo" OR "sdk_ver"');
    const PUBLISHER_DEVICE_STATE_QUERY = encodeURI('"zc.s.sss" AND "mic_status"');
    const PLAYER_DEVICE_STATE_QUERY = encodeURI('"zc.p.orss.1" AND "mic_status"');
    const NET_PROB_RESULT_QUERY = encodeURI('"zc.al" OR "zc.hcqr.0"');
    const NODE_NODES_QUERY = encodeURI('"sdp" AND "zc.s.bwh"');
    const STRT_CORD_QUERY = encodeURI('"/start"');
    const DEVICE_CHANGE_LOGIN_DEVICE_ERROR_QUERY = encodeURI('"/sdk/login" OR "/device/api/audio_c" OR "/device/api/video_c" OR "deviceError"');
    const PUBLISHER_SIMPLE_QUERY = encodeURI('"publisherStateUpdate" OR "zc.sps.0" OR "zsc.crss.0" OR "zc.p.0.ocsc" OR "zc.p.0.ogrd" OR "zc.s.sss" OR "zm.lrh.sru" OR "zc.p.0.upq" OR "预览" OR "device"');
    const PLAYER_SIMPLE_QUERY = encodeURI('');

    // 查房间状态、流状态变化
    function generateRoomOrStreamStateLink(params, startTime, endTime) {
        let query = `(language:lucene,query:'${ROOM_AND_STREAM_STATE_QUERY}')`;
        let link = _generateLink(params, 
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 查房间状态和房间连接状态变化
    function generateRoomStateChange(params, startTime, endTime) {
        let query = `(language:lucene,query:'${ROOM_STATE_CHANGE_QUERY}')`;
        let link = _generateLink(params, 
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 查房间状态和设备变化
    function generateRoomOrPreviewOrDeviceState(params, startTime, endTime) {
        let query = `(language:lucene,query:'${PREVIEW_STATE_QUERY}')`;
        let link = _generateLink(params, 
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 查浏览器版本 & sdk版本
    function generateOsinfoOrSdkVer(params, startTime, endTime) {
        let query = `(language:lucene,query:'${OSINFO_SDKVER_QUERY}')`;
        let link = _generateLink(params,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 推流设备状态
    function generagePublisherOrDeviceState(params, startTime, endTime) {
        let query = `(language:lucene,query:'${PUBLISHER_DEVICE_STATE_QUERY}')`;
        let link = _generateLink(params,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }
    // 推流设备状态
    function generagePlayerOrDeviceState(params, startTime, endTime) {
        let query = `(language:lucene,query:'${PLAYER_DEVICE_STATE_QUERY}')`;
        let link = _generateLink(params,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 流状态 & 探测结果
    function generageNetProbResult(params, startTime, endTime) {
        let query = `(language:lucene,query:'${NET_PROB_RESULT_QUERY}')`;
        let link = _generateLink(params,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // sdp 节点信息
    function generageNodeAndNodes(params, startTime, endTime) {
        let query = `(language:lucene,query:'${NODE_NODES_QUERY}')`;
        if(params.streamid) {
            query = `(language:lucene,query:'${NODE_NODES_QUERY} AND "${params.streamid}"')`;
            // delete params.streamid;
        }
        let link = _generateLink(params,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 推流过程
    function generatePusherSimpleLink(params, startTime, endTime) {
        let query = `(language:lucene,query:'${PUBLISHER_SIMPLE_QUERY}')`;
        let link = _generateLink(params, 
                                ZDS_ACCESS_CLIENT_REPORT_INDEX, 
                                ZDS_ACCESS_CLIENT_REPORT_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    function _generateLink(params, index, columns, query, startTime, endTime) {
        let time = NORMAL_TIME;
        let filterArray = [];
        let filters = '';
        if(startTime && endTime) {
            time = `(from:'${new Date(startTime).toISOString()}',to:'${new Date(endTime).toISOString()}')`;
        }
        Object.keys(params).forEach(key=> {
            if(params[key]) {
                console.warn('params[key]', params[key], params, key)
                let filter = `('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${index}',key:${key},negate:!f,params:(query:${params[key]}),type:phrase),query:(match_phrase:(${key}:${params[key]})))`;
                filterArray.push(filter);
            }
        });
        filters = `!(${filterArray.join(',')})`;
        console.log(query, filters)
        return `https://logcenter-new.oa.zego.im/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:${time})&_a=(columns:${columns},filters:${filters},index:'${index}',interval:auto,query:${query},sort:!(!('@timestamp',asc)))`;
    }

    // 查房间录制时间
    function generageStartCord(params, startTime, endTime) {
        let options = {};
        options['app_id'] = params.appid;
        options['room_id'] = params.roomid;
        let query = `(language:lucene,query:'${STRT_CORD_QUERY}')`;
        let link = _generateLink(options,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_CENTERSVR_BACKEND_INDEX, 
                                ZDS_CENTERSVR_BACKEND_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 事件日志，查设备切换
    function generateDeviceChangeOrDeviceErrorLink(params, startTime, endTime) {
        if(!params.appid || !params.userid) { return; }
        let options = {};
        options['appid'] = params.appid;
        options['id_name'] = params.userid;
        let query = `(language:lucene,query:'${DEVICE_CHANGE_LOGIN_DEVICE_ERROR_QUERY}')`;
        let link = _generateLink(options,  // 注意，浏览器版本过滤条件最多只精确到userid即可
                                ZDS_RTC_WEB_INDEX, 
                                ZDS_RTC_WEB_COLUMNS, 
                                query,
                                startTime, 
                                endTime);
        return link;
    }

    // 星图
    function generageStarMapLink(params, startTime, endTime) {
        if(!params.appid) { return; } //必须要appid
        let filter = params.roomid? `room_id=${params.roomid}`
                        : params.userid? `user_id=${params.userid}`
                        : params.streamid? `stream_id=${params.streamid}`: '';
        if(!filter) { return; }
        let selectID = 1;
        let idValue = '';
        if(params.roomid) {
            idValue = params.roomid;
            selectID = 1;
            filter = `room_id=${params.roomid}`;
        }else if(params.userid) {
            idValue = params.userid;
            selectID = 2;
            filter = `room_id=${params.userid}`;
        }else {
            idValue = params.streamid;
            selectID = 3;
            filter = `room_id=${params.streamid}`;
        }
        if(!startTime || !endTime) { // 没填开始时间，查当天；没填结束时间，查到当天最后一秒
            let today = new Date().toDateString();
            let todayTimer = new Date(today).getTime();
            startTime = startTime? startTime : todayTimer
            endTime = new Date(todayTimer + 24 * 60 * 60 * 1000 -1).getTime();
        }
        let link = `https://prism.zego.im/callInsight/search?app_id=${params.appid}&${filter}&start_time=${new Date(startTime).getTime()}&end_time=${new Date(endTime).getTime()}&page=1&page_size=200&filter_error=false&is_from_mix=false&no_room=false&stateName=callInsightUrl&searchText=${params.appid}&hasSelet=[{"selectID":${selectID},"idValue":"${idValue}","homeId":[{"label":"推流房间ID","value":1},{"label":"用户ID","value":2},{"label":"流ID","value":3}]}]&utc=8`;
        return encodeURI(link);
    }

    // 流拓扑
    function generateStreamTopology(params, startTime, endTime) {
        if(!params.appid && !params.streamid && !params.pullUserId) {
            return;
        }
        // 以开始时间为基准，查4小时
        startTime = startTime? new Date(startTime).getTime(): new Date(new Date().toDateString()).getTime();
        let _endTime = new Date(startTime + 4 * 60 * 60 * 1000 -1).getTime();
        endTime = endTime? (_endTime - new Date(endTime).getTime() > 0? new Date(endTime).getTime() : _endTime): _endTime;
        console.error('----------', startTime, endTime, _endTime);
        let link = `https://boss.zego.cloud/qualityOperate/fullLinkQuality?appId=${params.appid}&streamId=${params.streamid}&timeBegin=${startTime}&timeEnd=${endTime}&pullUserId=${params.pullUserId}&refreshNow=true`
        return link;
    }

    // UDP
    function generateUDPLink(params, startTime, endTime, ) {
        if(!params.appid && !params.streamid) {
            return;
        }
        // 以开始时间为基准，查4小时
        startTime = startTime? new Date(startTime).getTime(): new Date(new Date().toDateString()).getTime();
        let _endTime = new Date(startTime + 4 * 60 * 60 * 1000 -1).getTime();
        endTime = endTime? (_endTime - new Date(endTime).getTime() > 0? endTime : _endTime): _endTime;

        let s = encodeURI(new Date(startTime).format());
        let e = encodeURI(new Date(endTime).format());

        console.error('[udp]', params, params.streamid);
        return `https://boss.zego.cloud/qualityOperate/DataDetail/UdpPackage?start_time=${s}&end_time=${e}&stream=${params.streamid}&server_ip=&server_port=&kind=&node_class=&src_type=&app_id=${params.appid}&src_ip=&width=&height=&sdn=&ap=`;
    }
    
    Date.prototype.format = function(format){
        if((format = "" || format == undefined)){
          format ="yyyy/mm/dd h:m:s"
         }
         let conf =['yyyy','mm', 'dd','h','m','s','S'];
         let arr = {
           'yyyy':this.getFullYear(),
           'mm':this.getMonth() +1,
           'dd':this.getDate(),
           'h':this.getHours(),
           'm':this.getMinutes(),
           's':this.getSeconds(),
           'S':this.getMilliseconds(),
         };
        conf.forEach(function(item){
          format= format.replace(item,arr[item])
         });
        return format;
    };

    return {
        generateRoomOrStreamStateLink, // "zc.al" OR "zm.al"
        generateRoomStateChange, // "zm.al" OR "zm.rm.scb" OR "unload"
        generateRoomOrPreviewOrDeviceState, // "zm.al" OR "预览" OR "device"
        generateOsinfoOrSdkVer, // "osinfo" OR "sdk_ver"
        generagePublisherOrDeviceState, // "zc.s.sss" AND "mic_status"
        generagePlayerOrDeviceState, // "zc.p.orss.1 AND "mic_status""
        generageNetProbResult, // "zc.al" OR "zc.hcqr.0"
        generageNodeAndNodes, // "sdp" AND "zc.s.bwh"
        generageStartCord, // /start 
        generageStarMapLink, // 生成星图连接
        generateStreamTopology, // 生成流链路
        generateUDPLink, // 生成UDP数据报文
        generateDeviceChangeOrDeviceErrorLink, // /device/api/audio_c  deviceError
        generatePusherSimpleLink, // 推流过程的简要信息
    };
})();
