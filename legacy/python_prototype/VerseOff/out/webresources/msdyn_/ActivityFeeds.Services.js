Type.registerNamespace('ActivityFeeds.Services');

ActivityFeeds.Services.IActivityFeedService = function() {}
ActivityFeeds.Services.IActivityFeedService.registerInterface('ActivityFeeds.Services.IActivityFeedService');


ActivityFeeds.Services.IFollowService = function() {}
ActivityFeeds.Services.IFollowService.registerInterface('ActivityFeeds.Services.IFollowService');


ActivityFeeds.Services.IYammerEmbed = function() {}
ActivityFeeds.Services.IYammerEmbed.registerInterface('ActivityFeeds.Services.IYammerEmbed');


ActivityFeeds.Services.ActivityFeedService = function ActivityFeeds_Services_ActivityFeedService() {
}
ActivityFeeds.Services.ActivityFeedService.$C = function ActivityFeeds_Services_ActivityFeedService$$C() {
    var $v_0 = new Array(0);
    var $v_1 = $P_CRM('.yammerEmbed');
    if (!IsNull($v_1)) {
        var $v_2 = $v_1.children('iframe');
        $v_2.each(function($p1_0, $p1_1) {
            var $v_3 = $p1_1;
            if (!IsNull($v_3.contentWindow)) {
                $v_0.push($v_3.contentWindow);
            }
        });
    }
    return $v_0;
}
ActivityFeeds.Services.ActivityFeedService.create = function ActivityFeeds_Services_ActivityFeedService$create($sn_window) {
    var $v_0 = $sn_window._activityFeedsStateDictionary;
    var $v_1 = new ActivityFeeds.Services.ActivityFeedService();
    if (IsNull($v_0)) {
        return $v_1;
    }
    $v_1.$3_0 = ActivityFeeds.Services.ActivityFeedService.$6($v_0['IsConfigured']);
    $v_1.$2_0 = ActivityFeeds.Services.ActivityFeedService.$6($v_0['IsFollowed']);
    $v_1.$4_0 = ActivityFeeds.Services.ActivityFeedService.$6($v_0['IsFollowedInYammer']);
    return $v_1;
}
ActivityFeeds.Services.ActivityFeedService.$6 = function ActivityFeeds_Services_ActivityFeedService$$6($p0) {
    if (IsNull($p0)) {
        return false;
    }
    var $v_0 = $p0.toString();
    return $v_0 === 'True' || $v_0 === 'true';
}
ActivityFeeds.Services.ActivityFeedService.prototype = {
    $2_0: false,
    $3_0: false,
    $4_0: false,
    
    get_isFollowed: function ActivityFeeds_Services_ActivityFeedService$get_isFollowed() {
        return this.$2_0;
    },
    
    set_isFollowed: function ActivityFeeds_Services_ActivityFeedService$set_isFollowed(value) {
        this.$2_0 = value;
        return value;
    },
    
    get_hasPostConfig: function ActivityFeeds_Services_ActivityFeedService$get_hasPostConfig() {
        return this.$3_0;
    },
    
    set_hasPostConfig: function ActivityFeeds_Services_ActivityFeedService$set_hasPostConfig(value) {
        this.$3_0 = value;
        return value;
    },
    
    get_isFollowedInYammer: function ActivityFeeds_Services_ActivityFeedService$get_isFollowedInYammer() {
        return this.$4_0;
    },
    
    set_isFollowedInYammer: function ActivityFeeds_Services_ActivityFeedService$set_isFollowedInYammer(value) {
        this.$4_0 = value;
        return value;
    },
    
    isFollowButtonEnabled: function ActivityFeeds_Services_ActivityFeedService$isFollowButtonEnabled(entityId, logicalName, followButton) {
        if (followButton) {
            return this.$3_0 && !this.$2_0;
        }
        else {
            return this.$2_0;
        }
    },
    
    refreshFormFollowEnabled: function ActivityFeeds_Services_ActivityFeedService$refreshFormFollowEnabled(entityId, newIsFollowed) {
        this.$2_0 = this.$4_0 = newIsFollowed;
        var $v_0 = ActivityFeeds.Services.ActivityFeedService.$C();
        for (var $v_1 = 0; $v_1 < $v_0.length; $v_1++) {
            $v_0[$v_1].updatePageOnFollowUnfollow();
        }
        Xrm.Page.ui.refreshRibbon();
    }
}


ActivityFeeds.Services.FollowService = function ActivityFeeds_Services_FollowService() {
    this.$0_0 = {};
}
ActivityFeeds.Services.FollowService.$A = function ActivityFeeds_Services_FollowService$$A() {
    if (!ActivityFeeds.Services.FollowService.$1) {
        if (Xrm.Page.context.client.getClient() !== 'Outlook') {
            var $v_0 = sessionStorage.getItem('EnabledGridStates');
            if (!_String.isNullOrEmpty($v_0)) {
                ActivityFeeds.Services.FollowService.$1 = JSON.parse($v_0);
            }
            else {
                ActivityFeeds.Services.FollowService.$1 = {};
            }
        }
        else {
            ActivityFeeds.Services.FollowService.$1 = {};
        }
    }
}
ActivityFeeds.Services.FollowService.$D = function ActivityFeeds_Services_FollowService$$D() {
    if (Xrm.Page.context.client.getClient() !== 'Outlook') {
        try {
            sessionStorage.setItem('EnabledGridStates', JSON.stringify(ActivityFeeds.Services.FollowService.$1));
        }
        catch ($v_0) {
        }
    }
}
ActivityFeeds.Services.FollowService.normalizeEntityId = function ActivityFeeds_Services_FollowService$normalizeEntityId(entityId) {
    if (!entityId) {
        return '';
    }
    if (entityId.startsWith('{')) {
        entityId = entityId.substr(1);
    }
    if (entityId.endsWith('}')) {
        entityId = entityId.substr(0, entityId.length - 1);
    }
    return entityId.toLowerCase();
}
ActivityFeeds.Services.FollowService.getGridEnabledFollow = function ActivityFeeds_Services_FollowService$getGridEnabledFollow(logicalNames, followEnabledStateCallback) {
    ActivityFeeds.Services.FollowService.$A();
    var $v_0 = [];
    for (var $$arr_3 = logicalNames, $$len_4 = $$arr_3.length, $$idx_5 = 0; $$idx_5 < $$len_4; ++$$idx_5) {
        var $v_5 = $$arr_3[$$idx_5];
        if (ActivityFeeds.Services.FollowService.$1[$v_5] === undefined) {
            $v_0.push($v_5);
        }
    }
    if (!$v_0.length) {
        followEnabledStateCallback(ActivityFeeds.Services.FollowService.$1);
        return;
    }
    var $v_1 = Xrm.Page.context.getClientUrl();
    var $v_2 = encodeURI(String.format('{0}/api/data/v9.0/msdyn_postconfigs?$select=msdyn_entityname,statecode', $v_1));
    var $v_3 = '';
    for (var $$arr_A = $v_0, $$len_B = $$arr_A.length, $$idx_C = 0; $$idx_C < $$len_B; ++$$idx_C) {
        var $v_6 = $$arr_A[$$idx_C];
        if ($v_3.length) {
            $v_3 += ' or ';
        }
        $v_3 += String.format('msdyn_entityname eq \'{0}\'', $v_6);
    }
    $v_2 += '&$filter=' + $v_3;
    var $v_4 = function($p1_0) {
        for (var $$arr_F = $v_0, $$len_G = $$arr_F.length, $$idx_H = 0; $$idx_H < $$len_G; ++$$idx_H) {
            var $v_7 = $$arr_F[$$idx_H];
            ActivityFeeds.Services.FollowService.$1[$v_7] = new ActivityFeeds.Services.FollowEnabledState();
        }
        if ($p1_0 !== undefined) {
            var $v_8 = $p1_0.match(ActivityFeeds.Services.FollowService.$9);
            var $v_9 = $p1_0.match(ActivityFeeds.Services.FollowService.$7);
            if ($v_8) {
                for (var $v_A = 0; $v_A < $v_8.length; $v_A++) {
                    $v_8[$v_A] = ActivityFeeds.Services.FollowService.$8($v_8[$v_A]);
                    $v_9[$v_A] = ActivityFeeds.Services.FollowService.$8($v_9[$v_A]);
                    (ActivityFeeds.Services.FollowService.$1[$v_9[$v_A]]).enableFollow = (ActivityFeeds.Services.FollowService.$1[$v_9[$v_A]]).enableUnFollow = $v_8[$v_A] === '0';
                }
            }
        }
        ActivityFeeds.Services.FollowService.$D();
        followEnabledStateCallback(ActivityFeeds.Services.FollowService.$1);
    };
    fetch($v_2).then(function(response) { if (response.ok) { return response.text(); }}).then($v_4);;
}
ActivityFeeds.Services.FollowService.$B = function ActivityFeeds_Services_FollowService$$B($p0, $p1, $p2) {
    var $v_0 = [ $p0 ];
    ActivityFeeds.Services.FollowService.getGridEnabledFollow($v_0, function($p1_0) {
        if (!($p1_0[$p0]).enableFollow) {
            $p2($p1_0[$p0]);
            return;
        }
        var $v_1 = Xrm.Page.context.getClientUrl();
        var $v_2 = encodeURI(String.format('{0}', $p1));
        var $v_3 = encodeURI(String.format('{0}', Xrm.Page.context.getUserId()));
        if (_String.isNullOrEmpty($v_2) || _String.isNullOrEmpty($v_3)) {
            return;
        }
        var $v_4 = String.format('{0}/api/data/v9.0/postfollows?$select=postfollowid&$filter=_regardingobjectid_value eq {1} and _ownerid_value eq {2}', $v_1, $v_2, $v_3);
        var $v_5 = function($p2_0) {
            var $v_6 = new ActivityFeeds.Services.FollowEnabledState();
            if ($p2_0 === undefined) {
                $v_6.enableUnFollow = true;
            }
            else {
                $v_6.enableUnFollow = $p2_0.indexOf('\"value\":[]') < 0;
            }
            $v_6.enableFollow = !$v_6.enableUnFollow;
            $p2($v_6);
        };
        fetch($v_4).then(function(response) { if (response.ok) { return response.text(); }}).then($v_5);;
    });
}
ActivityFeeds.Services.FollowService.$8 = function ActivityFeeds_Services_FollowService$$8($p0) {
    var $v_0 = $p0.split(':')[1].trim();
    var $v_1 = new RegExp('[\"]+', 'img');
    return $v_0.replace($v_1, '');
}
ActivityFeeds.Services.FollowService.prototype = {
    
    isFollowButtonEnabled: function ActivityFeeds_Services_FollowService$isFollowButtonEnabled(entityId, logicalName, followButton) {
        var $v_0 = null;
        var $v_1 = null;
        $v_1 = new Promise(function(_resolve, reject) { $v_0 = _resolve; });
        entityId = ActivityFeeds.Services.FollowService.normalizeEntityId(entityId);
        if (this.$0_0[entityId] === undefined) {
            this.$0_0[entityId] = new ActivityFeeds.Services.FollowEnabledState();
            (this.$0_0[entityId]).promise = $v_1;
            var $$t_7 = this;
            ActivityFeeds.Services.FollowService.$B(logicalName, entityId, function($p1_0) {
                $$t_7.$0_0[entityId] = $p1_0;
                ($$t_7.$0_0[entityId]).promise = null;
                $v_0((followButton) ? ($$t_7.$0_0[entityId]).enableFollow : ($$t_7.$0_0[entityId]).enableUnFollow);
            });
        }
        else {
            if ((this.$0_0[entityId]).promise) {
                var $v_2 = this;
                return (this.$0_0[entityId]).promise.then(function() { return (followButton) ? ($v_2.$0_0[entityId]).enableFollow : ($v_2.$0_0[entityId]).enableUnFollow; });
            }
            $v_0((followButton) ? (this.$0_0[entityId]).enableFollow : (this.$0_0[entityId]).enableUnFollow);
        }
        return $v_1;
    },
    
    refreshFormFollowEnabled: function ActivityFeeds_Services_FollowService$refreshFormFollowEnabled(entityId, newIsFollowed) {
        entityId = ActivityFeeds.Services.FollowService.normalizeEntityId(entityId);
        this.$0_0[entityId] = new ActivityFeeds.Services.FollowEnabledState();
        (this.$0_0[entityId]).enableFollow = !newIsFollowed;
        (this.$0_0[entityId]).enableUnFollow = newIsFollowed;
    }
}


ActivityFeeds.Services.FollowServiceFactory = function ActivityFeeds_Services_FollowServiceFactory() {
}
ActivityFeeds.Services.FollowServiceFactory.getFollowService = function ActivityFeeds_Services_FollowServiceFactory$getFollowService() {
    if (Xrm.Page.context.client.getClient() === 'Mobile' || Xrm.Internal.isUci()) {
        if (null === ActivityFeeds.Services.FollowServiceFactory.$5) {
            ActivityFeeds.Services.FollowServiceFactory.$5 = new ActivityFeeds.Services.FollowService();
        }
        return ActivityFeeds.Services.FollowServiceFactory.$5;
    }
    else {
        return Xrm.Internal.getServiceDirectory().find(ActivityFeeds.Services.IFollowService);
    }
}


ActivityFeeds.Services.FollowEnabledState = function ActivityFeeds_Services_FollowEnabledState() {
}
ActivityFeeds.Services.FollowEnabledState.prototype = {
    enableFollow: false,
    enableUnFollow: false,
    inProgress: false,
    promise: null
}


function getLocalizedFileName(fileNameWithPath, userLcid, orgLcid) {
    if (IsNull(fileNameWithPath)) {
        throw Error.argumentNull('fileNameWithPath');
    }
    var $v_0 = fileNameWithPath.match(new RegExp('[^/]*$'));
    if (!$v_0 || !$v_0.length) {
        throw Error.create('invalid fileNameWithPath format');
    }
    $v_0 = $v_0[0].match(new RegExp('^[^?]*'));
    if (!$v_0 || !$v_0.length) {
        throw Error.create('invalid fileNameWithPath format');
    }
    var $v_1 = $v_0[0];
    var $v_2 = $v_1.replace('.1033', '');
    $v_0 = $v_2.match(new RegExp('[^.]*$'));
    if (!$v_0 || !$v_0.length) {
        throw Error.create('invalid fileNameWithPath format');
    }
    var $v_3 = $v_0[0].toLowerCase();
    if ($v_3 !== 'js' && $v_3 !== 'htm' && $v_3 !== 'html' && $v_3 !== 'css') {
        throw Error.create('invalid extension / file type is not supported');
    }
    var $v_4 = getFallbackLcid(userLcid, orgLcid);
    if (!($v_3 === 'js' && $v_4 === 1033)) {
        $v_2 = _String.insert($v_2, $v_2.lastIndexOf('.'), String.format('.{0}', $v_4));
    }
    return fileNameWithPath.replace($v_1, $v_2);
}
function loadLocalizedContent(url, globalContext, successCallback) {
    var $v_0 = new Sales.Common.Framework.Loaders.ContentLoader();
    $v_0.loadContent(getLocalizedFileName(url, globalContext.getUserLcid(), globalContext.getOrgLcid()), 'html', successCallback);
}
function loadLocalizedScript(url, globalContext, onLoadCallback, onErrorCallback) {
    var $v_0 = getLocalizedFileName(url, globalContext.getUserLcid(), globalContext.getOrgLcid());
    var $v_1 = document.createElement('script');
    $v_1.setAttribute('type', 'text/javascript');
    $v_1.onload=$v_1.onreadystatechange=function(){if(!$v_1.readyState||$v_1.readyState==='loaded'||$v_1.readyState==='complete'){$v_1.onload=$v_1.onreadystatechange=$v_1.onerror=null;if(onLoadCallback){onLoadCallback();}}};
    $v_1.onerror=function(){$v_1.onload=$v_1.onreadystatechange=$v_1.onerror=null;if(onErrorCallback){onErrorCallback();}};
    $v_1.setAttribute('src', $v_0);
    var $v_2 = document.getElementsByTagName('HEAD');
    $v_2[0].appendChild($v_1);
}
function getInstalledLocales() {
    var $v_0 = window._installedLocales;
    if (IsNull($v_0)) {
        return [ 1033 ];
    }
    return $v_0;
}
function getFallbackLcid(userLcid, orgLcid) {
    var $v_0 = getInstalledLocales();
    if (Array.contains($v_0, userLcid)) {
        return userLcid;
    }
    if (Array.contains($v_0, orgLcid)) {
        return orgLcid;
    }
    return 1033;
}


ActivityFeeds.Services.ActivityFeedService.registerClass('ActivityFeeds.Services.ActivityFeedService', null, ActivityFeeds.Services.IActivityFeedService, ActivityFeeds.Services.IFollowService);
ActivityFeeds.Services.FollowService.registerClass('ActivityFeeds.Services.FollowService', null, ActivityFeeds.Services.IFollowService);
ActivityFeeds.Services.FollowServiceFactory.registerClass('ActivityFeeds.Services.FollowServiceFactory');
ActivityFeeds.Services.FollowEnabledState.registerClass('ActivityFeeds.Services.FollowEnabledState');
ActivityFeeds.Services.FollowService.$1 = null;
ActivityFeeds.Services.FollowService.$9 = new RegExp('\"statecode\":(\\d+)', 'img');
ActivityFeeds.Services.FollowService.$7 = new RegExp('\"msdyn_entityname\":\"(.*?)\"', 'img');
ActivityFeeds.Services.FollowServiceFactory.$5 = null;
//@ sourceMappingURL=file:///F:/dbs/el/dccm2/target/retail/amd64/bin/ActivityFeeds.Services/net48/.srcmap
