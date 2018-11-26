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
        getAssetInfo(accessToken);
    }
);

function getAssetInfo(accessToken) {
    request.get(
        {
            url: 'https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796',
            rejectUnauthorized: false,
            auth: {
                bearer: accessToken
            },
            headers: {
                Authorization: accessToken
            }
        },
        function (err, httpResponse, body) {
            if (err) console.error(err);
            else console.log('\n\n', JSON.parse(body));
        }
    );

    request.get(
        {
            url: `https://10.42.24.55/apis/avid.pam;version=2;realm=B1C9D208-7A67-47BB-B392-6E307AC6F796/assets${id}`,
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
            else console.log('\n\n', JSON.parse(body));
        }
    );
}
