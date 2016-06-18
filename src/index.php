<?php
/**
 * index.php
 * ジャニーズ当落電話カウンター
 * --------------------
 * @since	1.0
 * @version	1.1
 * @license	Creative Commons BY-NC 4.0
 * 			{@link https://creativecommons.org/licenses/by-nc/4.0/deed.ja}
 * @author	yuta*ﾟ {@link https://y59.jp/}
**/

// 実稼働環境：Fatal Error以外のエラーを非表示にする
error_reporting(E_ERROR);

// キャッシュさせない
header("Expires: Thu, 01 Jan 1970 09:00:00 +0900");
header("Cache-Control: no-store, no-cache, must-revalidate");

// 現在の電話カウンターを読み込む
$callValue = (int)$_COOKIE["callCount_value"];

// Twitter for iPhoneか
$userAgent = $_SERVER["HTTP_USER_AGENT"];
if (strstr($userAgent, "Twitter for iPhone")){
	$twitter_for_iPhone = true;
};

// ページを読み込む
include_once "index.tpl";

?>
