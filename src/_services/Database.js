export default class Database {

	static async auth(username, password) {
		const request = await fetch('http://localhost:5000/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: username, password: password })
		});

		return await request.json();
	}

}
