import { accessToken, getCookie, login, refreshToken, setCookie } from '$lib/cookie.js';

export const apiUrl = `http://localhost:8080/api/v1`;

const accessTokenMaxAge = {
	'max-age': 60 * 60 // 1 hour (in prod use 15min)
};
const refreshTokenMaxAge = {
	'max-age': 60 * 60 * 24 * 30 * 3 // 3 month
};

export const responseCode = 417; // why 417? glitch in the head, need use 419

async function fetchSignIn(signInEmail, signInPassword) {
	const url = `${apiUrl}/auth/sign-in`;
	let data = {
		email: signInEmail,
		password: signInPassword
	};

	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	});

	const dataSignIn = await res.json();

	if (res.ok) {
		setCookie(accessToken, dataSignIn.data.aToken, accessTokenMaxAge);
		setCookie(refreshToken, dataSignIn.data.rToken, refreshTokenMaxAge);
		setCookie(login, 'on', refreshTokenMaxAge);
		return;
	}

	throw new Error(dataSignIn.desc);
}

async function fetchSignOn(signInName, signInEmail, signInPassword) {
	const url = `${apiUrl}/auth/sign-up`;
	let data = {
		email: signInEmail,
		password: signInPassword,
		username: signInName
	};

	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	});

	const dataSignOn = await res.json();

	if (res.ok) {
		setCookie(accessToken, dataSignOn.data.aToken, accessTokenMaxAge);
		setCookie(refreshToken, dataSignOn.data.rToken, refreshTokenMaxAge);
		setCookie(login, 'on', refreshTokenMaxAge);
		return;
	}

	throw new Error(dataSignOn.desc);
}

async function fetchShowBlog(ID) {
	const url = `${apiUrl}/blog/${ID}`;
	const res = await fetch(url, {
		method: 'GET'
	});

	const dataBlog = await res.json();
	if (res.ok) {
		return dataBlog;
	}

	throw new Error(dataBlog?.desc);
}

async function fetchCreateBlog(name, description) {
	const aToken = getCookie(accessToken);

	const url = `${apiUrl}/lk/blog`;
	let data = {
		name: name,
		description: description
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorizations: aToken
		},
		body: JSON.stringify(data)
	});

	const dataBlog = await res.json();
	if (res.ok) {
		return dataBlog.desc;
	}

	if (res.status === responseCode) {
		throw new Error(res.status);
	}

	throw new Error(dataBlog.desc);
}

async function fetchShowContent(ID, getConent) {
	const aToken = getCookie(accessToken);

	const url = `${apiUrl}/lk/content/${ID}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorizations: aToken
		}
	});

	if (res.status === responseCode) {
		throw new Error(res.status);
	}

	const dataContent = await res.json();
	if (res.ok) {
		getConent.id = dataContent.ID;
		getConent.name = dataContent.Name;
		getConent.description = dataContent.Description;
		getConent.userEmail = dataContent.UserEmail;
		return dataContent;
	}

	throw new Error(dataContent?.desc);
}

async function fetchCreateContent(name, description) {
	const aToken = getCookie(accessToken);

	const url = `${apiUrl}/lk/content`;
	let data = {
		name: name,
		description: description
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorizations: aToken
		},
		body: JSON.stringify(data)
	});

	const dataContent = await res.json();
	if (res.ok) {
		return dataContent.desc;
	}

	if (res.status === responseCode) {
		throw new Error(res.status);
	}

	throw new Error(dataContent.desc);
}

async function RefreshToken() {
	const refreshTokenValue = getCookie(refreshToken);

	if (typeof refreshTokenValue == 'undefined' || refreshTokenValue == null) {
		throw new Error(`not cookie ${refreshToken}`);
	}

	let data = {
		rtoken: refreshTokenValue
	};

	const url = `${apiUrl}/auth/refresh`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const Tokens = await response.json();
	if (response.ok) {
		setCookie(accessToken, Tokens.data.aToken, accessTokenMaxAge);
		setCookie(refreshToken, Tokens.data.rToken, refreshTokenMaxAge);
	} else {
		throw new Error('Please log in');
	}
}

const RefreshTokenDecorator = (f, ...params) => {
	return async function () {
		await f(...params)
			.then((data) => {
				return data;
			})
			.catch((error) => {
				if (error.message == responseCode) {
					// if the token is outdated, we are trying to update it
					RefreshToken() // trying to update the token
						.then(() => {
							f.call(this, ...params)
								.then((data) => {
									return data;
								})
								.catch((error) => {
									throw error;
								});
						})
						.catch(() => {
							throw new Error('Please log in');
						});
				}

				throw error;
			});
	};
};

// const TestRefreshToken = () => {
//     RefreshToken()
//         .then(()=>{ console.log("well")})
//         .catch((error) => {
//             console.log('Error:', error)
//         })
//
// }

export {
	RefreshTokenDecorator,
	fetchSignIn,
	fetchSignOn,
	fetchShowBlog,
	fetchCreateBlog,
	fetchShowContent,
	fetchCreateContent
};
