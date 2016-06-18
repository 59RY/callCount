<?php
/**
 * index.php
 * ジャニーズ当落電話カウンター
 * --------------------
 * @version	1.0
 * @license	Creative Commons BY-NC 4.0
 * 			{@link https://creativecommons.org/licenses/by-nc/4.0/deed.ja}
 * @author	yuta*ﾟ {@link https://y59.jp/}
**/

// 実稼働環境：Fatal Error以外のエラーを非表示にする
error_reporting(E_ERROR);

// 現在の電話カウンターを読み込む
$callValue = (int)$_COOKIE["callCount_value"];

// ページを読み込む
include_once "index.tpl";

?>
