const request_promise = require('request-promise-native');

const headers = {
    Authorization: ""
};
headers['Content-Type'] = "application/x-www-form-urlencoded";

const host = '10.42.24.55';

const formData = {
    grant_type: "password",
    username: "",
    password: ""
};

function getRequest(url, accessToken) {
    return request_promise({
            method: 'GET',
            url: url,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        }
    );
}

function chooseHref(body, containsString) {
    let url;
    body._embedded['loc:collection']._links['loc:item'].forEach(function (element) {
        if (element.href.includes(containsString)) {
            url = element.href;
        }
    });
    return url;
};

let accessToken;
request_promise({
    method: 'POST',
    url: `https://${host}/auth/sso/login/oauth2/ropc/ad`,
    form: formData,
    rejectUnauthorized: false,
    headers: {
        Authorization: ""
    }
}).then(function (body) {
    accessToken = JSON.parse(body).access_token;
    return getRequest(`https://${host}/apis/avid.ctms.registry;version=0;realm=global/serviceroots`, accessToken);
}).then(body => {
    body = (JSON.parse(body));
    return getRequest(body.resources['loc:root-item'][0].href, accessToken);
}).then(body => {
    body = JSON.parse(body);
    return getRequest(chooseHref(body, 'Projects'), accessToken)
}).then(body => {
    body = (JSON.parse(body));
    return getRequest(chooseHref(body, 'DTK'), accessToken)
}).then(body => {
    body = (JSON.parse(body));
    return getRequest(chooseHref(body, 'https'), accessToken)
}).then(body => {
    body = JSON.parse(body);
    const assetId = body._embedded['loc:referenced-object'].base.id;
    console.log('Asset ID: ', assetId);
    return assetId;
}).then(id => {
    const url = `https://${host}/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/assets/${id}`;
    return getRequest(url, accessToken);
}).then(body => {
    console.log(JSON.parse(body));
}).catch(function (err) {
    console.log(err);
});
