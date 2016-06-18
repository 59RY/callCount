/**
 * script.js
 * ジャニーズ当落電話カウンターのスクリプトファイルです。
 * --------------------
 * @version 1.0
 * @license	Creative Commons BY-NC 4.0
 * 			{@link https://creativecommons.org/licenses/by-nc/4.0/deed.ja}
 * @author	yuta*ﾟ {@link https://y59.jp/}
**/

/****************************
 * 変数定義
*****************************/

// 電話先
var callTo = "0570000058";

// Twitter for iPhoneか？未定義の際のフェイルバック
if( typeof twitter_for_iPhone !== "boolean" ) {
	var twitter_for_iPhone = false;
}


/****************************
 * 関数定義
*****************************/

/**
 * クッキーの値を取得
 * @param	cookieName = プロパティ名
 * @return	String
**/
function getCookie(cookieName){
    var dc = document.cookie, st = "", ed = "", rtn = "";
    if(dc.length > 0){
        st = dc.indexOf(cookieName + "=");
        if(st !== -1){
            st = st + parseInt(cookieName.length + 1);
            ed = dc.indexOf(";", st);
            if(ed === -1){
				ed = dc.length;
			}
            // 値をデコードして返す
            rtn = unescape(dc.substring(st, ed));
        }
    } else{
		rtn = "";
	}

	return rtn;
}


/**
 * クッキーを保存
 * @param	cookieName = プロパティ名
 * @param	value = 値
 * @param	expiredays = 有効期限(日数)
 * @return	なし
**/
function setCookie(cookieName, value, expiredays){
    // path の指定
    var path = location.pathname, paths = [];
    // path をフォルダ毎に指定する場合のIE対策
    paths = path.split("/");
    if(paths[paths.length - 1] !== ""){
        paths[paths.length - 1] = "";
        path = paths.join("/");
    };
    // 有効期限の日付
    var extime = new Date().getTime(),
	    cltime = new Date(extime + (86400000 * expiredays)),
        exdate = cltime.toUTCString();
    // クッキーに保存する文字列を生成
    var s= "";
    s += cookieName + "=" + escape(value);
    s += "; path=" + path;
    if(expiredays){
        s += "; expires=" + exdate + "; ";
    }else{
        s += "; ";
    }
    // クッキーに保存
    document.cookie = s;
}


/**
 * カンマ区切りの挿入。さらに全角数値は半角に変換する
 * @param	destStr = 値
 * @return	カンマ区切りされた値 または undefined
 * @NOTE	min化した時にサイズを減らすため、halfWidthPlus() とセットで作用するようにした
**/
function insertComma(destStr){
	var tmpStr = "";
	if(typeof destStr !== "undefined"){
		destStr = String(destStr);
		destStr = halfWidthPlus(destStr);
		destStr = String(parseFloat(destStr)); // ←念入り
		while (destStr !== (tmpStr = destStr.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){
			destStr = tmpStr;
		}
		return destStr;
	} else{
		return;
	}
}


/**
 * 全角数字を半角にしたり、不要な文字をトリミングしたりする
 * @param	val = 値
 * @return	トリミングされた値
**/
function halfWidthPlus(val){
	return val.replace(/[Ａ-ｚ０-９]/g, function(s){
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	}).replace(/(,|，|､|、|\ |\　)/g,"").replace(/．/g,".").replace(/\‐\-\‑\—/g,"-");
}


/**
 * カウンターを設定する
 * @param	setValue = 値
 * @param	relative = 相対的に値を増減するか
 * @return	Number(設定後の値) または undefined
**/
function counterSet(setValue, relative){
	// Init
	var current = parseInt($("#callValue").attr("data-value")), setCount;
	// relative が true の場合、相対的に値を増減する
	if(relative){
		setCount = current + setValue;
	} else{
		setCount = setValue;
	}
	// ただし、setCount が 0 以上の場合のみ処理をする
	if(setCount >= 0){
		// 表示値・アトリビュートを変える
		counterAffect(setCount);
		// Cookie に値を格納する
		setCookie("callCount_value", setCount, 731);
		return setCount;
	} else{
		return;
	}
}


/**
 * カウンターの表示を変える
 * @NOTE	主に counterSet() とセットで使用する
 * @param	val = 値
 * @return	なし
**/
function counterAffect(val){
	$("#callValue").attr("data-value", String(val)).html(insertComma(val));

	// 繋がった! ボタンの表示・非表示を切り替える
	var outWentButton = $(".outWent");
	if( parseInt(val) >= 1 ){
		outWentButton.show();
	} else{
		outWentButton.hide();
	}
}


/****************************
 * 即時関数
*****************************/

$(function($doc){

	// タッチイベントを扱えるかどうかによって、イベントハンドラを変える
	var supportTouch = "ontouchend" in document;
	var EVENT_TOUCHSTART = supportTouch ? "touchstart": "mousedown";

	// Cookie から電話カウンターを読み込む。読み込めたら値を表示する
	var initValue = getCookie("callCount_value");
	if(initValue !== "" && typeof initValue !== "undefined"){
		counterAffect(initValue);
	}

	// 電話をかける & カウンターを1増やす
	$($doc).on(EVENT_TOUCHSTART, ".callButton", function(){
		location.href = "tel:" + callTo;
		counterSet(1, true);
	});

	// 電話カウンターを調整する
	$($doc).on(EVENT_TOUCHSTART, ".adjust", function(){
		var attrVal = $(this).attr("data-count");
		switch (attrVal){
			case "+1":
				// カウンターを1増やす
				counterSet(1, true);
				break;
			case "-1":
				// カウンターを1減らす
				counterSet(-1, true);
				break;
			case "custom":
				// カウンターをカスタム調整する
				var newCount = window.prompt("電話をかけた回数を半角で入力してください", parseInt($("#callValue").attr("data-value")));
				if(typeof newCount !== "undefined" && newCount !== "" && newCount !== null){
					newCount = halfWidthPlus(newCount);
					var newCountInteger = parseInt(newCount);
					// 正しい値かを調査する
					if(newCount === String(newCountInteger)){
						// Valid Value
						if(newCount >= 0){
							counterSet(newCount, false);
						} else{
							alert("注：0 以上の数字を入力してください。");
						}
					} else{
						// Invalid Value
						alert("注：正しい数字を入力してください。");
					}
				}
				break;
			case "reset":
				// カウンターをリセットする
				if(window.confirm("電話カウンターをリセットしてもよろしいですか?")){
					counterSet(0, false);
				}
				break;
			default:
				// Do Nothing
				break;
		}
	});

	// 繋がった処理
	$($doc).on(EVENT_TOUCHSTART, ".outWent", function(){
		// 繋がった処理をするかどうかのブーメランを予め定義する
		var outWentProcess = false;
		if(twitter_for_iPhone){
			outWentProcess = true;
		} else {
			if(window.confirm("当落確認が出来ましたか?")){
				outWentProcess = true;
			}
		}

		if(outWentProcess){
			// Cookie内のカウンターリセット
			setCookie("callCount_value", "0", -1);

			// .notConnected をフェードアウト → .connected をフェードイン
			var elem1 = $(".notConnected"), elem2 = $(".connected");
			elem1.addClass("fadeout");
			setTimeout(function(){
				elem1.hide();
				elem2.addClass("fadein");
			}, 500);
			setTimeout(function(){
				elem2.show();
			}, 1000);
		}
	});

	// シェアボタンを押された処理
	$($doc).on(EVENT_TOUCHSTART, ".share", function(){
		var shareType = $(this).attr("data-shareto"),
		    myCount = $("#callValue").attr("data-value"),
		    thisURL = location.href,
		    shareText = encodeURI("ジャニーズ当落電話カウンター! 私は" + insertComma(myCount) + "回で繋がりました٩(๑^o^๑)۶"),
		    shareHashTag = encodeURI("当落電話カウンター"),
		    shareURL = "";
		switch (shareType){
			case "twitter":
				shareURL = "https://twitter.com/share?via=y59JP&text=" + shareText + "&url=" + thisURL + "&hashtags=" + shareHashTag + "&lang=ja";
				break;
			case "facebook":
				shareURL = "https://www.facebook.com/sharer.php?u=" + thisURL;
				break;
			case "line":
				shareURL = "line://msg/text/" + shareText + "%0D%0A" + encodeURI(thisURL);
				break;
			default:
				break;
		};
		if(shareURL !== "") {
			if(twitter_for_iPhone){
				location.href = shareURL;
			} else {
				window.open(shareURL, "_blank");
			};
		}
	});

}($(document)));
