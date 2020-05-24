const hostname = "https://217.160.60.183:5000";

export default class Database {
	static async auth(username, password) {
		const request = await fetch(`${hostname}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username: username, password: password })
		});

		return await request.json();
	}

	static async createImageGroup(token, groupName, groupType) {
		const request = await fetch(`${hostname}/endpoint/groups`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				groupName: groupName,
				groupType: groupType
			})
		});

		return await request.json();
	}

	static async getImageGroups(token) {
		const request = await fetch(`${hostname}/endpoint/groups`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async getCategories(token) {
		const request = await fetch(`${hostname}/endpoint/categories`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async getImages(token, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		return await request.json();
	}

	static async uploadImages(token, imageGroupId, files) {
		const formData = new FormData();

		for (const file of files) {
			formData.append("images", file, file.name);
		}

		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/images`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			}
		);

		return await request.json();
	}

	static async getImage(token, imageId) {
		const request = await fetch(`${hostname}/endpoint/images/${imageId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return await request.json();
	}

	static async createLabel(token, labelName, labelColor, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/labels`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					labelName: labelName,
					labelColor: labelColor
				})
			}
		);

		return await request.json();
	}

	static async getLabels(token, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/labels`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		return await request.json();
	}

	static async deleteLabel(token, labelId, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/labels/${labelId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		return await request.json();
	}

	static async createLabeling(
		token,
		start,
		end,
		labelId,
		imageId,
		imageGroupId
	) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/images/${imageId}/labels/${labelId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					start: start,
					end: end
				})
			}
		);

		return await request.json();
	}

	static async deleteLabeling(token, labelingId, imageId, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/images/${imageId}/labels/${labelingId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		return await request.json();
	}

	static async getLabelings(token, imageId, imageGroupId) {
		const request = await fetch(
			`${hostname}/endpoint/imageGroups/${imageGroupId}/images/${imageId}/labels`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		return await request.json();
	}
}
