const request = require('request');

const headers = {
    Authorization: ""
};
headers['Content-Type'] = "application/x-www-form-urlencoded";

const formData = {
    grant_type: "password",
    username: "",
    password: ""
};

request.post(
    {
        url: 'https://10.42.24.55/auth/sso/login/oauth2/ropc/ad',
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
        let id = returnAssetId(accessToken);
        console.log(id)
    }
);

function getRootService(accessToken){
    const url = 'https://10.42.24.55/apis/avid.ctms.registry;version=0;realm=global/serviceroots';
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
                return body.resources['loc:root-item'][0].href;
            }
        }
    );
}

function getLocations(accessToken){
    const url = 'https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/locations/fol' +
        'ders/%2F?offset=0&limit=25';
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
                chooseHref(body, 'Projects');
            }
        }
    );
}

function getProjectsDir(accessToken){
    const url = 'https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/locations/fol' +
        'ders/%2FProjects%2F?offset=0&limit=25';
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
                chooseHref(body, 'DTK');
            }
        }
    );
}


function getDTKDir(accessToken){
    const url = 'https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/locations/fol' +
        'ders/%2FProjects%2FDTK%2F?offset=0&limit=25';
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
                chooseHref(body, 'https');
            }
        }
    );
}

function getAssetItem(accessToken){
    const url = 'https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/locations/ite' +
        'ms/%2FProjects%2FDTK%2F060a2b340101010101010f0013-000000-5a8ee637566b03b4-060e2b347f7f-2a80';
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
                return body;
            }
        }
    );
}

function chooseHref(body, containsString) {
    body._embedded._links['loc:item'].forEach(function (element) {
        if (body._embedded._links['loc:item'].contains(containsString)) console.log(element);
    });
}

function returnAssetId(accessToken) {
    getRootService(accessToken);
    getLocations(accessToken);
    getProjectsDir(accessToken);
    getDTKDir(accessToken);
    let asset = getAssetItem(accessToken);
    return asset.base.id;
}
