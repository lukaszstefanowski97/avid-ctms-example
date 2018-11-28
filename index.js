const request = require('request');

const headers = {
    Authorization: ""
};
headers['Content-Type'] = "application/x-www-form-urlencoded";
const serviceRoot = "https://10.42.24.55/apis/avid.ctms.registry;version=0;realm=global/serviceroots";

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
        returnAssetId(accessToken);
    }
);

function getRequest(url, accessToken, callback=0) {
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
                let url = 'https://10.42.24.55/apis/avid.ctms.registry;version=0;realm=global/serviceroots';
                console.log('\n\n', JSON.parse(body));
                if (body.systems.systemTypeName === 'MediaCentral | Production Management') url = body.resources['loc:root-item'][0].href;
                if (body.base.id === '/') url = chooseHref(body, 'Projects');
                if (body.base.id === '/Projects/') url = chooseHref(body, 'DTK');
                if (body.base.id === '/Projects/DTK/') url = chooseHref(body, 'https');
                if (body.base.type === 'folder-item') {
                    return body.base.id;
                }
                if (callback) {
                    callback(url, accessToken);
                }
            }
        }
    );
}

function chooseHref(body, containsString) {
    body._embedded._links['loc:item'].forEach(function (element) {
        if (body._embedded._links['loc:item'].contains(containsString)) return element;
    });
}

function returnAssetId(accessToken) {
    getRequest(serviceRoot, accessToken,
        getRequest(...args, getRequest(
            getRequest(...args, getRequest(
                getRequest(...args, getRequest(
                    getRequest(...args)
                    )
                )
                )
            )
            )
        )
    );
}
