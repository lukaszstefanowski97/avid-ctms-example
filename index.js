const request = require('request');

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

request.post(
    {
        url: `https://${host}/auth/sso/login/oauth2/ropc/ad`,
        form: formData,
        rejectUnauthorized: false,
        headers: {
            Authorization: ""
        }
    },
    function (err, httpResponse, body) {
        if (err) console.error(err);
        else console.log('\n\n', body);
        const accessToken = JSON.parse(body).access_token;
        returnAssetId(accessToken);
    }
);

function getRootService(accessToken){
    const url = `https://${host}/apis/avid.ctms.registry;version=0;realm=global/serviceroots`;
    request.get(
        {
            url: url,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            body = JSON.parse(body);
            if (err) console.error(err);
            else {
                const url = body.resources['loc:root-item'][0].href;
                return getLocations(accessToken, url);
            }
        }
    );
}

function getLocations(accessToken, rootServiceUrl){
    request.get(
        {
            url: rootServiceUrl,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else {
                body = JSON.parse(body);
                const url = chooseHref(body, 'Projects');
                return getProjectsDir(accessToken, url);
            }
        }
    );
}

function getProjectsDir(accessToken, dirUrl){
    request.get(
        {
            url: dirUrl,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else {
                body = JSON.parse(body);
                const url = chooseHref(body, 'DTK');
                return getDTKDir(accessToken, url);
            }
        }
    );
}

function getDTKDir(accessToken, dtkUrl){
    request.get(
        {
            url: dtkUrl,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else {
                body = JSON.parse(body);
                const url = chooseHref(body, 'https');
                return getAssetItem(accessToken, url);
            }
        }
    );
}

function getAssetItem(accessToken, assetUrl){
    request.get(
        {
            url: assetUrl,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else {
                body = JSON.parse(body);
                const id = body._embedded['loc:referenced-object'].base.id;
                console.log('\n\n', id);
                getAssetDetails(accessToken, id);
                return body;
            }
        }
    );
}

function chooseHref(body, containsString) {
    let url;
    body._embedded['loc:collection']._links['loc:item'].forEach(function (element) {
        if (element.href.includes(containsString)){
            url = element.href;
        }
    });
    return url;
}

function getAssetDetails(accessToken, id) {
    const url = `https://${host}/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/assets/${id}`;
    request.get(
        {
            url: url,
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Accept: 'application/hal+json',
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else {
                body = JSON.parse(body);
                console.log('\n\n', body);
                return body;
            }
        }
    );
}

function returnAssetId(accessToken) {
    getRootService(accessToken);
}
