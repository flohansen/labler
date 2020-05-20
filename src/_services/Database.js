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

	static async createImageGroup(token, groupName, groupType) {
		const request = await fetch('http://localhost:5000/endpoint/groups', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				groupName: groupName,
				groupType: groupType
			})
		});

		return await request.json();
	}

	static async getImageGroups(token) {
		const request = await fetch('http://localhost:5000/endpoint/groups', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async getCategories(token) {
		const request = await fetch('http://localhost:5000/endpoint/categories', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async getImages(token, imageGroupId) {
		const request = await fetch(`http://localhost:5000/endpoint/imageGroups/${imageGroupId}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async uploadImages(token, imageGroupId, files) {
		const formData = new FormData();

		for (const file of files) {
			formData.append('images', file, file.name);
		}

		const request = await fetch(`http://localhost:5000/endpoint/imageGroups/${imageGroupId}/images`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		});

		return await request.json();
	}

	static async getImage(token, imageId) {
		const request = await fetch(`http://localhost:5000/endpoint/images/${imageId}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return await request.json();
	}

}
