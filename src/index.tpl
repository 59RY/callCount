<!DOCTYPE html>
<html>
<head>

	<!-- Base -->
	<meta charset="UTF-8" />
	<title>ジャニーズ当落電話カウンター!</title>
	<link rel="shortcut icon" href="assets/images/icon.ico" type="image/x-icon" />

	<!-- SEO -->
	<meta name="author" content="yuta*ﾟ" />
	<meta name="robots" content="noindex, follow, archive" />
	<meta name="revisit-after" content="5 days" />
	<meta name="description" content="ジャニーズのコンサートの当落で電話をかけた回数を測定するページです。" />

	<!-- OGP -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:site" content="@y59JP" />
	<meta property="og:title" content="ジャニーズ当落電話カウンター!" />
	<meta property="og:image" content="https://i.y59.jp/Johnny's/callCount/assets/images/icon-2048.png" />
	<meta property="og:description" content="ジャニーズのコンサートの当落で電話をかけた回数を測定するページです。" />

	<!-- Extented -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
	<meta property="apple-mobile-web-app-title" content="当落ｶｳﾝﾀｰ" />
	<link rel="apple-touch-icon-precomposed" href="https://i.y59.jp/Johnny's/callCount/assets/images/icon-2048.png" />

	<!-- CSS -->
	<link rel="stylesheet" href="assets/css/style.min.css" />

</head>
<body class="<?= $twitter_for_iPhone ? 'twitter_for_iPhone' : '' ?>">
	<div id="bodyBox">
		<div id="bodyBox-inner">
			<p class="titleCall">ジャニーズ当落電話カウンター!</p>

			<div class="callCounter section">
				<p class="callCounterTitle">電話<br />カウンター</p>
				<p class="callCounterValue" id="callValue" data-value="<?= $callValue ?>"><?= number_format($callValue) ?></p>
				<p class="callCounterFooter connected">回で繋がりました!</p>
			</div>

			<p class="callButton-wrap section notConnected">
				<button class="callButton">電話をかける!</button><br />
				<span class="small">※このページから離れてもカウンターは保持されます</span>
			</p>

			<div class="bottomFix">
				<div class="bottomFix-inner notConnected">
					<p class="section aligncenter outWent-wrap">
						<button class="outWent" style="display: <?= $callValue >= 1 ? 'inline-block' : 'none' ?>"><i class="icon-phone"></i>繋がった!</button>
					</p>
					<p class="section aligncenter">
						ｶｳﾝﾀｰ調整:
						<button class="adjust" data-count="+1">+1</button>
						<button class="adjust" data-count="-1">-1</button>
						<?php if( !$twitter_for_iPhone ): ?>
						<button class="adjust" data-count="custom">手動</button>
						<button class="adjust" data-count="reset">ﾘｾｯﾄ</button>
						<?php endif; ?>
					</p>
				</div>

				<div class="bottomFix-inner connected">
					<div class="section aligncenter">
						<p class="titleCall" style="font-size: 1.5em; font-weight: 200;">Let's Share!</p>
						<button class="share twitter" data-shareto="twitter"><i class="icon-twitter"></i></button>
						<button class="share facebook" data-shareto="facebook"><i class="icon-facebook"></i></button>
						<button class="share line" data-shareto="line"><i class="icon-line"></i></button>
					</div>
					<p class="section aligncenter">
						<button class="reload" onclick="(function(){location.reload()}())">再測定</button><br />
					</p>
				</div>

				<div class="copyright aligncenter">
					<address>©2016 yuta*ﾟ ( <a href="https://twitter.com/y59JP"><i class="icon-twitter"></i>y59JP</a>・<a href="https://y59.jp/">y59.jp/</a> )</address>
				</div>

			</div>
		</div>
	</div>

	<!-- JavaScript Core -->
	<!--[if IE]>
		<script src="//code.jquery.com/jquery-1.12.4.min.js"></script>
	<![endif]-->
	<!--[if lte IE 9]><!-->
		<script src="assets/js/zepto.min.js"></script>
	<!--<![endif]-->

	<!-- JavaScript -->
	<script>
		var twitter_for_iPhone = <?= $twitter_for_iPhone ? "true" : "false" ?>;
	</script>
	<script src="assets/js/script.min.js"></script>

</body>
</html>
