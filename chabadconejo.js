window.addEventListener("DOMContentLoaded", () => {
	if (document.querySelector('#myTab > li:nth-child(1).active')) {
		document.querySelector('#Description-tab').click()
	}
});

window.addEventListener('load', function () {
	if (window.location.href.includes('templates/fundraising')) {
		/* Pre Chanukah Campaign */
		function preChanukahCampaignGeneric(campaignSettings) {
			function checkAndsetupBonusRound() {
				if (isBonusRound()) {
					setupBonusRound();
				}
			}
			function setupBonusRound() {
				// Body Class
				$j("body").addClass("fs-bonus");
				// Goal Text
				$j(".fs-goal-amount").prepend("<span class='fs-real-original-goal'>" + getOriginalCampaignGoal() +
					"</span>");
				// Matchers Intro
				var bonusRoundGoal = getBonusRoundGoal();
				if ($j(".fs-matchers-intro .fs-full-line").html() != "THANK YOU!!! WE DID IT!!") {
					$j(".fs-matchers-intro").html(campaignSettings.bonusRoundMessage);
				}
				/*
				// Goal Graph fill
				var bonusPercentCompleteOfTotalGoal = getBonusPercentCompleteOfTotalGoal();
				if (bonusPercentCompleteOfTotalGoal > 0) $j(".fs-goal-graph-fill").append(
				'<div class="fs-goal-graph-fill-bonus fs-goal-graph-star-container" style="width: ' +
				bonusPercentCompleteOfTotalGoal + '%;"><i class="glyphicon glyphicon-star"></i></div>');
				*/
				// Goal Percent
				//$j(".fs-percent-complete-amount").hide().closest(".fs-goal-graph-value").prepend('<span>'+getBonusPercentComplete()+'%</span>');
			}
			function isBonusRound() {
				if (campaignSettings.isBonusRound) {
					return true;
				} else {
					return goalIsNotOriginal();
				}
			}
			function getBonusPercentComplete() {
				var originalGoal = getOriginalCampaignGoal().replace(/^\D+/g, '').replace(",", '');
				var totalRaised = Math.floor($j(".fs-total-raised-amount").html().replace(/^\D+/g, '').replace(",", ''));
				var percent = (totalRaised / originalGoal) * 100;
				return Math.floor(percent);
			}
			function getBonusPercentCompleteOfTotalGoal() {
				var originalGoal = getOriginalCampaignGoal().replace(/^\D+/g, '').replace(",", '');
				var totalRaised = Math.floor($j(".fs-total-raised-amount").html().replace(/^\D+/g, '').replace(",", ''));
				var bonusRaised = totalRaised - originalGoal;
				if (bonusRaised > 0) {
					var percent = (bonusRaised / totalRaised) * 100;
					return Math.floor(percent);
				}
				return 0;
			}
			function getBonusRoundGoal() {
				return $j(".fs-goal-amount .fs-original-goal").html();
			}
			function goalIsNotOriginal() {
				var currentGoal = $j(".fs-goal-amount .fs-original-goal").html();
				if (currentGoal && currentGoal != getOriginalCampaignGoal()) return true;
			}
			function getOriginalCampaignGoal() {
				return campaignSettings.originalCampaignGoal;
			}
			function getTimeNow() {
				return Math.floor(Date.now() / 1000);
			}
			function getSecondsUntilCampaignStarts(campaignStartTime) {
				var timeNow = getTimeNow();
				return campaignStartTime - timeNow;
			}
			function changeCountDownToPreDonate() {
				var campaignStartTime = getCampaignStartTime();
				var countDownElements = {
					seconds: $j('.fs-countdown-seconds .fs-countdown-number'),
					minutes: $j('.fs-countdown-minutes .fs-countdown-number'),
					hours: $j('.fs-countdown-hours .fs-countdown-number'),
					days: $j('.fs-countdown-days .fs-countdown-number')
				};
				var secondsUntilCampaignStarts = getSecondsUntilCampaignStarts(campaignStartTime);
				var daysUntilCampaignStarts = Math.floor(secondsUntilCampaignStarts / (3600 * 24));
				secondsUntilCampaignStarts -= daysUntilCampaignStarts * 3600 * 24;
				var hoursUntilCampaignStarts = Math.floor(secondsUntilCampaignStarts / 3600);
				secondsUntilCampaignStarts -= hoursUntilCampaignStarts * 3600;
				var minutesUntilCampaignStarts = Math.floor(secondsUntilCampaignStarts / 60);
				secondsUntilCampaignStarts -= minutesUntilCampaignStarts * 60;
				countDownElements.days.html(daysUntilCampaignStarts);
				countDownElements.hours.html(hoursUntilCampaignStarts);
				countDownElements.minutes.html(minutesUntilCampaignStarts);
				countDownElements.seconds.html(secondsUntilCampaignStarts);
			}
			function addPreDonateClassToBody() {
				jQuery("body").addClass("fs-pre-donate");
			}
			function setPreDonateCountDownMessage() {
				$j('.fs-countdowndonate h3').html(
					"Left until <strong>Campaign</strong> starts!<br><div style='font-size:16px;margin: 0 auto;margin-top:10px;width: 90%;line-height:130%; text-transform: none;'>We are accepting pre-donations now.<br> Campaign goes LIVE on " + campaignSettings.liveDateNice + "</div>"
				);
			}
			function setPreDonatePartnersMessage() {
				$j('.fs-partners .fs-partners-list-container').html(
					"<div class='fs-predonate-message'></div>"
				);
			}
			function hideGoalRaisedTotalForPreDonate() {
				$j('.fs-goal .fs-goal-graph-container .fs-goal-graph .fs-goal-graph-fill').hide();
				$j('.fs-goal .fs-goal-graph-container .fs-total-raised-amount').hide();
				$j('.fs-goal .fs-goal-graph-container .fs-total-raised-amount').closest(".fs-goal-graph-value").prepend(
					"<span>$0</span>");
				$j('.fs-goal .fs-goal-graph-container .fs-percent-complete-amount').hide();
				$j('.fs-goal .fs-goal-graph-container .fs-percent-complete-amount').closest(".fs-goal-graph-value").prepend(
					"<span>0%</span>");
			}
			function changeDonateButtonsToPreDonate() {
				// Add Pre Donate Button to main donate
				$j('.fs-donate .fs-btn').prepend("Pre-");
				replacePartnersButtonWithPreDonate();
				// And do it again a few times on a timer because we can't check when the partners list has finished loading via ajax
				// Worst case is the button doesn't show
				window.setTimeout(replacePartnersButtonWithPreDonate, 100);
				window.setTimeout(replacePartnersButtonWithPreDonate, 500);
				window.setTimeout(replacePartnersButtonWithPreDonate, 1000);
			}

			function hidePartnersButton() {
				// Hide but also add a class of "very-hidden" to prevent it being shown by ajax response of partners list
				$j('.fs-partners #showAllDonorsButton').hide().addClass("very-hidden");
			}
			function showPreDonateButton() {
				$j('.fs-partners #temporaryDonateButton').show().html(
					'Pre-Donate <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>');
			}
			function enterPreDonateMode() {
				addPreDonateClassToBody();
				changeCountDownToPreDonate();
				setPreDonateCountDownMessage();
				//setPreDonatePartnersMessage();
				changeDonateButtonsToPreDonate()
				//hideGoalRaisedTotalForPreDonate();
			}
			function checkIfCampaignStarted(campaignStartTime) {
				var timeNow = getTimeNow();
				if (timeNow > campaignStartTime) {
					return true;
				}
				return false;
			}
			function checkIfCampaignOver(campaignEndTime) {
				var timeNow = getTimeNow();
				if (timeNow > campaignEndTime) {
					return true;
				}
				return false;
			}
			function getCampaignEndTime() {
				return campaignSettings.campaignEndTime;
			}
			function getCampaignStartTime() {
				return campaignSettings.campaignStartTime;
			}
			function getCampaignArticleId() {
				return campaignSettings.campaignArticleId;
			}
			function getHomepageArticleId() {
				return "3210881";
			}
			function isSiteHomepage() {
				return Co.ArticleId == getHomepageArticleId();
			}
			function isInCampaign() {
				return Co.ArticleId == getCampaignArticleId();
			}
			function isCampaignStarted() {
				var campaignStartTime = getCampaignStartTime();
				var campaignStarted = checkIfCampaignStarted(campaignStartTime);
				return campaignStarted;
			}
			function isCampaignOver() {
				var campaignEndTime = getCampaignEndTime();
				var campaignOver = checkIfCampaignOver(campaignEndTime);
				return campaignOver;
			}
			function addJSProcessedBodyClass() {
				$j("body").addClass("js-processed");
			}
			function checkAndSetupPreDonate() {
				if (!isCampaignStarted()) {
					enterPreDonateMode()
				}
			}
			function setupSlider() {
				var carousel = $j('.fs-carousel');
				var fallBackImage = $j('.fs-about-images');
				carousel.on('initialized.owl.carousel', function (event) {
					carousel.show();
					fallBackImage.hide();
				})
				if (carousel.owlCarousel) {
					carousel.owlCarousel({
						loop: true,
						margin: 0,
						nav: true,
						items: 1,
						autoplay: true,
					}).show();
				}
			}
			function moveMatchers() {
				jQuery(".fs-matchers-list").appendTo(".fs-about .fs-about-text");
				jQuery(".fs-about .fs-matchers-list").wrap("<div class='fs-matchers'></div>");
			}
			function initializeCampaign() {
				if (isInCampaign()) {
					checkAndSetupPreDonate();
					checkAndsetupBonusRound();
					$.getScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js", function (data, textStatus, jqxhr) {
						setupSlider();
					});
					moveMatchers();
					addJSProcessedBodyClass();
					if (!isCampaignOver()) {
						jQuery(".fs-matchers .fs-matchers-intro .fs-smaller-text").append(" Our generous matchers will continue the triple-match until January 1st.");
					}
				}
			}
			function getHomepageBannerHTML() {
				var wrapperStart = "<a href='/" + getCampaignArticleId() + "' class='fs-homepage-banner'>";
				var wrapperEnd = "</a>";
				var images, wideImage, narrowImage;
				if (isCampaignStarted()) {
					wideImage = campaignSettings.homepageBanner.started.wide;
					narrowImage = campaignSettings.homepageBanner.started.narrow;
				} else {
					wideImage = campaignSettings.homepageBanner.pre.wide;
					narrowImage = campaignSettings.homepageBanner.pre.narrow;
				}
				images = "<img src='" + wideImage + "' class='wide-image'><img src='" + narrowImage +
					"' class='narrow-image'>";
				return wrapperStart + images + wrapperEnd;
			}
			function setupHomepageBanner() {
				if (!isCampaignOver() && campaignSettings.showHomepageBanner) {
					var bannerHTML = getHomepageBannerHTML();
					var aboveSlider = $j(".promo_slider").closest(".g960");
					$j(bannerHTML).prependTo(aboveSlider).hide().delay(500).slideDown('slow');
				}
			}
			function checkAndSetupSiteBy() {
				if (isInCampaign()) {
					$j('.fs-footer .fs-copyright').append(
						"<span class='fs-site-by'>Site by <a href='https://theclickco.com'>Click Co</a><span>"
					);
				}
			}
			function reportDonations() {
				jQuery(document).on("fundraising:donation-completed", function (event, data) {
					if (ga) {
						ga('ecommerce:addTransaction', {
							'id': data.Id,
							'affiliation': 'Pre-Chanukah Miracle Campaign',
							'revenue': data.Amount,
						});
					}
				});
			}
			function checkAndSetupHomepageBanner() {
				if (isSiteHomepage()) setupHomepageBanner();
			}
			jQuery(document).ready(function () {
				checkAndSetupHomepageBanner();
				initializeCampaign();
				checkAndSetupSiteBy();
				// reportDonations();
			});
		}
		preChanukahCampaignGeneric({
			originalCampaignGoal: "$540,000",
			isBonusRound: false,
			showHomepageBanner: false,
			campaignArticleId: "6653698",
			campaignStartTime: "1733162400", //  Monday, December 2, 2024 1:00:00 PM
			campaignEndTime: "1733446800", // Thursday, December 5, 2024 8:00:00 PM
			liveDateNice: "Monday, Dec. 2",
			bonusRoundMessage: '<strong class=\"fs-full-line\">THANK YOU!!! WE DID IT!!</strong><span class=\"fs-smaller-text\">Thank you for helping us "Light Up The Night" and supporting our "United As One" Campaign. The site will remain active for the coming days and will accept contributions to be matched. Thank you to our generous matchers for making this a possibility. Am Yisroel Chai!</span>',
			homepageBanner: {
				pre: {
					wide: "/media/images/1251/LGgb12515092.jpg",
					narrow: "/media/images/1251/uFDG12515091.jpg",
				},
				started: {
					wide: "/media/images/1253/EBcx12536384.jpg",
					narrow: "/media/images/1253/AVYZ12536385.jpg",
				}
			}
		});
	}
});
