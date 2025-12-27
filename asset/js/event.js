// $('#msgbtn').click(function() {
// 	$('<p>ボタンがクリックされました</p>').appendTo('#event');
// });

// $('#clear').click(function() {
// 	$('#event p').remove();
// });

/* ⇒arrow関数 */
$('#msgbtn').on('click', () => {
	$('<p>ボタンがクリックされました</p>').appendTo('#event');
});

// $('#clear').on('click', () => {
// 	$('#event p').remove();
// });



const msgAlertContent = document.getElementById('message-alert');
const msgAlertBtn = document.getElementById('msgbtn2');

// msgAlertBtn.onclick = function() {
// 	alert('ボタンがクリックされました');
// };

/* ⇒arrow関数 */
// msgAlertBtn.onclick = () => {
// 	alert('ボタンがクリックされました');
// };

function msg1() {
	alert('ボタンがクリックされました');
}

function msg2() {
	const p = document.createElement('p');
	const msg = document.createTextNode('ボタンがクリックされました');
	p.appendChild(msg);
	msgAlertContent.appendChild(p);
}

// attachEventは古い書き方
// if(msgAlertBtn.attachEvent) {
// 	msgAlertBtn.attachEvent('onclick', msg1);
// 	msgAlertBtn.attachEvent('onclick', msg2);
// } else if (msgAlertBtn.addEventListener) {
// 	msgAlertBtn.addEventListener('click', msg1, false);
// 	msgAlertBtn.addEventListener('click', msg2, false);
// }

// ⇒Vanilla JS
// msgAlertBtn.addEventListener('click', msg1);
// msgAlertBtn.addEventListener('click', msg2);

// ⇒jQuery
$(msgAlertBtn).on('click', msg1);
$(msgAlertBtn).on('click', msg2);


$('.clear-btn').on('click', (event) => {
	$(event.currentTarget).closest('.content').find('p').remove();
});


const clickBtn = document.getElementById('clickbtn');
const objClick = {
	click:		'クリック',
	dblclick:	'ダブルクリック',
	mousedown:	'マウスが押',
	mouseup:		'マウスが放'
};

$.each(objClick, (key, val) => {
	$(clickBtn)[key](() => {
		$('<p>', {text: val + 'されました'}).appendTo('#clickbtn')
	});
});