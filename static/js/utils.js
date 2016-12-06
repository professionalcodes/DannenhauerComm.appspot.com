function log(m) { 
    console.log(m);
}

function timeNow() {
    return performance.now();
}

function timeDifference(t2, t1) {
	return t2-t1;
}

function timeFunction(f) {
    var before = timeNow();
    f();
    var after = timeNow();

    return timeDifference(after, before);
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function loadStyleSheetsAsync() {
    config.stylesheetsAsyncLoad.forEach(function(link, index, args) {
        jQuery("head").append(link);
    });
}

function defined(val) {
    return (val !== undefined);
}

function regExpMatch(regexp, value) {
	return regexp.test(value);
}

function trim(value) {
    value = value.trim();
    return value;
}

function validUsername(username) {
    return (defined(username) && username.length >= 5);
}

function validPassword(password_value) {
    return (defined(password_value) && regExpMatch(config.regexp.password, trim(password_value)));
}

function validEmail(email) {
    return (defined(email) && regExpMatch(config.regexp.email, email))
}
function passwordsMatch(p1, p2) {
    return defined(p1) && defined(p2) && p1 === p2; 
}

function validPhone(phone_value) {
	return (defined(phone_value) && regExpMatch(config.regexp.phone, trim(phone_value)));
}

function notAllDigits(value) {
    return (config.regexp.allNumbers.test(value)) ? false : true; 
}

function removeDisabledAttr(string_selector) {
	jQuery(string_selector).attr("disabled", null);
}

function addDisabledAttr(string_selector) {
	jQuery(string_selector).attr("disabled", true);
}

function clearInput(string_selector) {
   jQuery(string_selector).val('');   
}

function showModal(modalId) {
    jQuery("#" + modalId).modal();
}

function closeModal(modalId) {
    jQuery("#" + modalId).modal('hide');
}