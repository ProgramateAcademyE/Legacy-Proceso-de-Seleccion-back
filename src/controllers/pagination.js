const pagination = async () => {
  try {
		const perPage = 20;
		const page = req.params.page || 1;
		const [ users, total ] = await Promise.all([
			User.find()
			.select("-password")
			.select("-passwordHash")
			.skip((perPage * page) - perPage)
			.limit(perPage),
			User.countDocuments()
		]);

		res.json({
			users,
			page: {
				page,
				perPage,
				total
			}
		});
	} catch (err) {
		return res.status(500).send({ msg: err.message });
	}
}