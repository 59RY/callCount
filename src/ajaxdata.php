<?php
/**
 * ajaxdata.php
 * ジャニーズ当落カウンターの使用状況を送信します。
 * @NOTE	必要な SQLite3 テーブルは既に出来ている体になっています。
 * @NOTE	Require PHP 5.4+, SQLite, SQLite3
 * --------------------
 * @param 	counter: カウンター
 * @param	date_array: 日付情報(Unixミリ秒・配列)
 * @param	date_send: このAjaxの送信日付(Unixミリ秒)
 *
 * @return	array( "finished" => Bool, [ "errorReason" => エラーになった理由 ] )
 * --------------------
 * @since	1.1
 * @version	1.1
 * @license	Creative Commons BY-NC 4.0
 * 			{@link https://creativecommons.org/licenses/by-nc/4.0/deed.ja}
 * @author	yuta*ﾟ {@link https://y59.jp/}
**/

// 実稼働環境：Fatal Error以外のエラーを非表示にする
error_reporting( E_ERROR );

// ヘッダー
header( "Content-Type: application/json; charset=UTF-8" );

// 戻り値
$return = array(
	"finished" => false,
);

// 取得した情報を配列に入れる
$counter    = $_REQUEST["counter"];
$date_array = $_REQUEST["date_array"];
$date_send  = $_REQUEST["date_send"];

// 必要な情報がちゃんとあるか調べる
if( (string)$counter !== "" && @is_array( $date_array ) && @count( $date_array ) >= 1 && (string)$date_send !== "" ) {

	// DBに格納するように日付データを作る
	$sql_date_array = array();
	$lastKey = 0;
	foreach( $date_array as $key => $value ) {
		// ミリ秒ではなく、秒を出す
		$date_seconds = floor( (int)$value / 1000 );
		// 配列に格納する
		$sql_date_array[] = array(
			"date_str" => date( "Y-m-d H:i:s", $date_seconds ),
			"date_int" => $value
		);
		// 最後の時間を取得するため、最後のキー番号を変数に入れる
		$lastKey = $key;
	};

	// データの送信日もDBで処理しやすい形式にする
	$sql_date_send_int = floor( (int)$date_send / 1000 );
	$sql_date_send     = date( "Y-m-d H:i:s", $sql_date_send_int );

	// SQLite 接続
	try{
		$SQLite = new SQLite3( "assets/data.sqlite3" );
	} catch( Exception $e ) {
		$return["errorReason"] = "DBの接続に失敗しました({$e})";
		die( json_encode( $return, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ) );
	}

	// ユーザー情報を入れる
	$user_SQL =
		"INSERT INTO `user` (
			`count`,
			`userAgent`,
			`date_1st`,
			`date_1st_int`,
			`date_final`,
			`date_final_int`,
			`date_datasend`,
			`date_datasend_int`
		 ) VALUES (
			 '{$counter}',
			 '{$_SERVER["HTTP_USER_AGENT"]}',
			 '{$sql_date_array[0]["date_str"]}',
			 '{$sql_date_array[0]["date_int"]}',
			 '{$sql_date_array[$lastKey]["date_str"]}',
			 '{$sql_date_array[$lastKey]["date_int"]}',
			 '{$sql_date_send}',
			 '{$date_send}'
		 )";
	$user_result = $SQLite -> query( $user_SQL );
	$user_lastID = $SQLite -> lastInsertRowId();

	// 電話情報を入れる
	$call_SQL = "INSERT INTO `call` (`userID`, `date`, `date_int`, `connect`) VALUES \n";
	foreach( $sql_date_array as $key => $value ) {
		$finalLoop = $value === end( $sql_date_array ) ? true : false;
		$connect = $finalLoop ? "1" : "0";
		$call_SQL .= "('{$user_lastID}', '{$value["date_str"]}', '{$value["date_int"]}', '{$connect}')";
		if(! $finalLoop ) {
			$call_SQL .= ", \n";
		}
	};
	$call_result = $SQLite -> query( $call_SQL );

	// $call_result が false でなければ、正しく処理したものとして返り値を true にする
	if( $call_result !== false ) {
		$return["finished"] = true;
	} else {
		$return["errorReason"] = "DBに値を格納できなかった可能性があります";
	}

	// SQLite を閉じる
	$SQLite -> close();

} else {
	// 必要な情報が無かった場合
	$return["errorReason"] = "必要な情報がありません";
}

// クライアントサイドに返却する
echo json_encode( $return, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

?>
