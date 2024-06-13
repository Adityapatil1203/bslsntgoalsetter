//------------------------------------------------------------------------------------

const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

//------------------------------------------------------------------------------------

const app = express();
const PORT = 8002;
// const baseUrl = 'http://test.bslcatgvid.in/images/';

//------------------------------------------------------------------------------------

app.use(express.json());
app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------------------------------------------------------------

dotenv.config();

//------------------------------------------------------------------------------------

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "wxyzyqcr_root",
//     password: "Root@1000",
//     database: "wxyzyqcr_project",
// });

// const db = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: '1234567890',
// 	database: 'wxyzyqcr_project',
// });

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root123',
	database: 'admin_task',
	insecureAuth: true
});

db.connect((err) => {
	if (err) {
	  console.error('Error connecting to MySQL:', err.message);
	  return;
	}
	console.log('Connected to MySQL database!');
  });

//------------------------------------------------------------------------------------

const generateAccessToken = (data) => {
	return (accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET));
};

//------------------------------------------------------------------------------------

const encryptData = (data) => {
	var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
	var mystr = mykey.update(data, 'utf8', 'hex');
	mystr += mykey.final('hex');
	return mystr;
};

const decryptPasswordData = (encryptedData) => {
	var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
	var mystr = mykey.update(encryptedData, 'hex', 'utf8');
	mystr += mykey.final('utf8');
	return mystr;
};
console.log(decryptPasswordData('2938d2e23631c66f67784b2eb341d875'));
//------------------------------------------------------------------------------------

let storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, './public/images/');
	},
	filename: (req, file, callBack) => {
		callBack(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

let upload = multer({
	storage: storage,
});

//------------------------------------------------------------------------------------

app.get('/', (req, res) => {
	res.send(`Server is listening to port ${PORT}`);
});

//------------------------------------------------------------------------------------

app.post('/n-admin/register', async (req, res) => {
	const q = 'SELECT COUNT(*) FROM wxyzyqcr_project.n_admin WHERE mobile = ?';
	const mobile = req.body.mobile;
	const password = req.body.password;

	db.query(q, [mobile], async (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			if (data[0]['COUNT(*)'] == 0) {
				let encryptedPassword = encryptData(password);

				const setQuery =
					'INSERT INTO wxyzyqcr_project.n_admin (`name`, `mobile`, `password`) VALUES (?)';

				const values = [
					req.body.name,
					req.body.mobile,
					encryptedPassword,
				];

				db.query(setQuery, [values], (err, data) => {
					if (err) {
						return res.json(err);
					} else {
						return res.send({
							id: data.insertId,
							message: true,
						});
					}
				});
			} else {
				return res.send({ message: false });
			}
		}
	});
});

app.post('/n-admin/login', async (req, res) => {
	const mobile = req.body.mobile;
	const password = req.body.password;
	const q = 'SELECT * FROM wxyzyqcr_project.n_admin WHERE mobile = ?';
	let result;
	let adminInfo;

	db.query(q, [mobile], async (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			adminInfo = data[0];
			if (data.length > 0) {
				result = data[0];

				let decryptedPass = decryptPasswordData(result.password);

				if (password == decryptedPass) {
					const getAdminInfo =
						'SELECT * FROM wxyzyqcr_project.n_admin WHERE id = ?';

					db.query(getAdminInfo, [result.id], (err, data) => {
						let admin = data[0];

						const accessToken = generateAccessToken({ ...admin });

						return res.send({
							id: admin.id,
							name: admin.name,
							accessToken: accessToken,
							message: true,
						});
					});
				} else {
					return res.send({
						message: false,
					});
				}
			} else {
				return res.send({ message: false });
			}
		}
	});
});

//------------------------------------------------------------------------------------

app.post('/n-employee/register', async (req, res) => {
	console.log("register working");
	const name = req.body.name
	const mobile = req.body.mobile;
	const password = req.body.password;
	console.log(name,mobile,password);
	const q =
		'SELECT COUNT(*) FROM wxyzyqcr_project.n_employee WHERE mobile = ?';
	
	db.query(q, [mobile], async (err, data) => {
		if (err) {
			console.log("error 1");
			return res.json(err);
		} else {
			if (data[0]['COUNT(*)'] == 0) {
				let encryptedPassword = encryptData(password);

				const setQuery =
					'INSERT INTO wxyzyqcr_project.n_employee (`name`, `mobile`, `password`) VALUES (?);';

				const values = [
					req.body.name,
					req.body.mobile,
					encryptData(req.body.password),
				];

				db.query(setQuery, [values], (err, data) => {
					if (err) {
						console.log("error 2");
						return res.json(err);
					} else {
						return res.status(200).send({ id: data.insertId });
					}
				});
			} else {
				console.log("error 3");
				return res.status(403).send({ message: false });
			}
		}
	});
});

app.post('/n-employee/login', async (req, res) => {
	const mobile = req.body.mobile;
	const password = req.body.password;
	const q = 'SELECT * FROM wxyzyqcr_project.n_employee WHERE mobile = ?';
	let result;
	let employeeInfo;

	db.query(q, [mobile], async (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			employeeInfo = data[0];
			if (data.length > 0) {
				result = data[0];

				let decryptedPass = decryptPasswordData(result.password);

				if (password == decryptedPass) {
					const getEmployeeInfo =
						'SELECT * FROM wxyzyqcr_project.n_employee WHERE id = ?';

					db.query(getEmployeeInfo, [result.id], (err, data) => {
						let employee = data[0];

						if (employee.isActive == 1) {
							const accessToken = generateAccessToken({
								...employee,
							});

							return res.status(200).send({
								id: employee.id,
								name: employee.name,
								accessToken: accessToken,
								message: true,
							});
						} else {
							return res.send(403).send({
								message: false,
							});
						}
					});
				} else {
					return res.status(403).send({
						message: false,
					});
				}
			} else {
				return res.send({ message: false });
			}
		}
	});
});

app.get('/n-employee/all', (req, res) => {
	const q = 'SELECT * FROM n_employee';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

app.post('/n-employee/changeStatus', async (req, res) => {
	const id = req.body.id;
	const status = req.body.status;

	const q = `UPDATE wxyzyqcr_project.n_employee SET isActive = ? WHERE id = ?`;

	db.query(q, [status, id], (err, data) => {
		if (err) return res.json(err);
		return res.send(true);
	});
});

//------------------------------------------------------------------------------------

// upload.array('image', 10)

app.post('/todays-reflection', (req, res) => {
	const { todaysReflection, tomorrowsPlanning, employeeId } = req.body;

	let getEmployeeInfo =
		'SELECT * FROM wxyzyqcr_project.n_employee WHERE id = ?';

		console.log("body ",todaysReflection,tomorrowsPlanning, req.body);

	db.query(getEmployeeInfo, [employeeId], (err, data) => {
		console.log(data);
		let thisEmployee = data[0];

		if (thisEmployee.isActive == 1) {
			const q =
				'INSERT INTO wxyzyqcr_project.todays_reflections (`todaysReflection`, `tomorrowsPlanning`, `datetime`, `addedByEmployee`, `image_1`, `image_2`, `image_3`, `image_4`, `image_5`,`image_6`, `image_7`, `image_8`, `image_9`, `image_10`) VALUES (?)';
			// const q = "INSERT INTO wxyzyqcr_project.todays_reflections (`todaysReflection`, `tomorrowsPlanning`, `datetime`, `addedByEmployee`, `image_1`, `image_2`, `image_3`, `image_4`, `image_5`,`image_6`, `image_7`, `image_8`, `image_9`, `image_10`) VALUES (?)";

			// const photoSrc_1 = req.files[0] ? `${baseUrl}` + req.files[0].filename : null;
			// const photoSrc_2 = req.files[1] ? `${baseUrl}` + req.files[1].filename : null;
			// const photoSrc_3 = req.files[2] ? `${baseUrl}` + req.files[2].filename : null;
			// const photoSrc_4 = req.files[3] ? `${baseUrl}` + req.files[3].filename : null;
			// const photoSrc_5 = req.files[4] ? `${baseUrl}` + req.files[4].filename : null;
			// const photoSrc_6 = req.files[5] ? `${baseUrl}` + req.files[5].filename : null;
			// const photoSrc_7 = req.files[6] ? `${baseUrl}` + req.files[6].filename : null;
			// const photoSrc_8 = req.files[7] ? `${baseUrl}` + req.files[7].filename : null;
			// const photoSrc_9 = req.files[8] ? `${baseUrl}` + req.files[8].filename : null;
			// const photoSrc_10 = req.files[9] ? `${baseUrl}` + req.files[9].filename : null;

			const values = [
				todaysReflection,
				tomorrowsPlanning,
				new Date(),
				thisEmployee.name,
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				// photoSrc_1,
				// photoSrc_2,
				// photoSrc_3,
				// photoSrc_4,
				// photoSrc_5,
				// photoSrc_6,
				// photoSrc_7,
				// photoSrc_8,
				// photoSrc_9,
				// photoSrc_10
			];

			db.query(q, [values], (err, data) => {
				if (err) {
					return res.json(err);
				} else {
					if (err) {
						res.json(err);
					} else {
						res.json({
							message: true,
							insertId: data.insertId,
						});
					}
				}
			});
		} else {
			res.json({ message: 'DISABLED' });
		}
	});
});

app.post('/todays-reflection/image', upload.single('image'), (req, res) => {
	const { insertId, employeeId } = req.body;

	let getEmployeeInfo =
		'SELECT * FROM wxyzyqcr_project.n_employee WHERE id = ?';

	db.query(getEmployeeInfo, [employeeId], (err, data) => {
		let thisEmployee = data[0];

		if (thisEmployee.isActive == 1) {
			let todaysReflectionInfo =
				'SELECT * FROM wxyzyqcr_project.todays_reflections WHERE id = ?';

			db.query(todaysReflectionInfo, [insertId], (err, data) => {
				const thisData = data[0];
				const photoSrc = req.file.filename
					? `${baseUrl}` + req.file.filename
					: null;
				let insertImage;

				if (thisData.image_1 == '' || thisData.image_1 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_1 = ? WHERE id = ?';
				} else if (thisData.image_2 == '' || thisData.image_2 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_2 = ? WHERE id = ?';
				} else if (thisData.image_3 == '' || thisData.image_3 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_3 = ? WHERE id = ?';
				} else if (thisData.image_4 == '' || thisData.image_4 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_4 = ? WHERE id = ?';
				} else if (thisData.image_5 == '' || thisData.image_5 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_5 = ? WHERE id = ?';
				} else if (thisData.image_6 == '' || thisData.image_6 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_6 = ? WHERE id = ?';
				} else if (thisData.image_7 == '' || thisData.image_7 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_7 = ? WHERE id = ?';
				} else if (thisData.image_8 == '' || thisData.image_8 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_8 = ? WHERE id = ?';
				} else if (thisData.image_9 == '' || thisData.image_9 == null) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_9 = ? WHERE id = ?';
				} else if (
					thisData.image_10 == '' ||
					thisData.image_10 == null
				) {
					insertImage =
						'UPDATE wxyzyqcr_project.todays_reflections SET image_10 = ? WHERE id = ?';
				} else {
					return res.json({ message: 'Daily Limit Exceed' });
				}

				db.query(insertImage, [photoSrc, insertId], (err, data) => {
					if (err) {
						return res.json(err);
					} else {
						return res.json({ message: true });
					}
				});
			});
		} else {
			res.status(403).json({ message: 'DISABLED' });
		}
	});
});

app.get('/todays-reflection', (req, res) => {
	const q = 'SELECT * FROM todays_reflections';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

app.post('/todays-reflection/sort-by-date', (req, res) => {
	const { from, to } = req.body;

	let toDate = to.split('-')[2];
	toDate = +toDate + 1;

	if (toDate < 10) {
		toDate = '0' + toDate;
	}

	toDate = `${to.split('-')[0]}-${to.split('-')[1]}-${toDate}`;

	const q = `SELECT * FROM todays_reflections WHERE (CAST(datetime AS DATETIME) BETWEEN CAST('${from}' AS DATETIME) AND CAST('${toDate}' AS DATETIME))`;

	db.query(q, [from, to], (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

//------------------------------------------------------------------------------------

app.post('/circular', upload.single('image'), (req, res) => {
	const q =
		'INSERT INTO wxyzyqcr_project.circular (`image`, `datetime`) VALUES (?);';

	const photoSrc = `${baseUrl}` + req.file.filename;

	const values = [photoSrc, new Date()];

	db.query(q, [values], (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			return res.json({ message: true });
		}
	});
});

app.get('/circular', (req, res) => {
	const q = 'SELECT * FROM wxyzyqcr_project.circular';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

//------------------------------------------------------------------------------------

app.post('/gallery/image/:caption', upload.single('image'), (req, res) => {
	const caption = req.params.caption;

	const q =
		'INSERT INTO wxyzyqcr_project.gallery (`image`, `caption`, `datetime`) VALUES (?);';

	const photoSrc = `${baseUrl}` + req.file.filename;

	const values = [photoSrc, caption, new Date()];

	db.query(q, [values], (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			return res.json({ message: true });
		}
	});
});

app.get('/gallery/image', (req, res) => {
	const q = 'SELECT * FROM wxyzyqcr_project.gallery';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

app.get('/gallery/image/paginated/:pageNumber', (req, res) => {
	const pageNumber = req.params.pageNumber;
	const q = 'SELECT * FROM wxyzyqcr_project.gallery';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			let gallery = [...data];
			let galleryLength = data.length;
			let itemsPerPage = 2;

			let cutArray = gallery.splice(
				(pageNumber - 1) * itemsPerPage,
				itemsPerPage
			);

			if (cutArray.length == 0) {
				return res.send({ message: false });
			}

			res.send({
				gallery: cutArray,
				info: {
					totalItems: galleryLength,
					itemsPerPage: itemsPerPage,
					pageNumber: pageNumber,
				},
			});
		}
	});
});

//------------------------------------------------------------------------------------

app.post('/caos', (req, res) => {
	const { link, title } = req.body;
	const q =
		'INSERT INTO wxyzyqcr_project.caos (`link`, `title`, `datetime`) VALUES (?);';

	const values = [link, title, new Date()];

	db.query(q, [values], (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			return res.json({ message: true });
		}
	});
});

app.get('/caos', (req, res) => {
	const q = 'SELECT * FROM wxyzyqcr_project.caos';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			res.send(data);
		}
	});
});

//------------------------------------------------------------------------------------

// admin task ...........................................................................



app.post('/api/tasks', async (req, res) => {
	const { station, todayTask, tomorrowPlan } = req.body;
  z
	// Validate data if needed (optional)

	// console.log(station , todayTask , tomorrowPlan);
  
	try {
	 
	  const query = `INSERT INTO admin_task.station (station, todayTask, tomorrowPlan) VALUES (?, ?, ?)`;
	  const values = [station, todayTask, tomorrowPlan];
  
	//   const [results] = await connection.query(query, values);
  
	  await connection.release();
  
	  res.json({ message: 'Task submitted successfully!' });
	} catch (error) {
	  console.error('Error submitting task:', error);
	  res.status(500).json({ message: 'Error creating task.' });
	}
  });


  app.get('/api/task/station', (req, res) => {
	const q = 'SELECT * FROM station';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			// console.log(data)
			res.send(data);
		}
	});
});

  app.post('/api/task/station', async (req, res) => {
	const { station_name } = req.body;

	// ... (rest of the code)
  
	try {
	  // Escape station_name to prevent SQL injection (important!)
	  const escapedStationName = db.escape(station_name);
  
	  // Insert station into the database
	   await db.query('INSERT INTO station (station_name) VALUES (?)', [escapedStationName]);
  
	  // Extract relevant data from the result
	
	  // Send success response with relevant data
	  res.status(201).json({ message: 'Station added successfully'});
	} catch (error) {
	  console.error(error.message);
	  res.status(500).json({ error: 'Failed to add station' });
	}
  });

//   app.get('/api/task/today', async (req, res) => {
// 	console.log("eeeee")
// 	try {
// 	  // Execute query to fetch all tasks from today_plan table
// 	  const tasks = await db.query('SELECT * FROM today_plan');

// 	   console.log(tasks)
// 		// for (const key in tasks) {
// 		//    console.log(key)
// 		// }
		
	 
// 	} catch (error) {
// 	  console.error(error.message);
// 	  res.status(500).json({ error: 'Failed to retrieve today\'s tasks' });
// 	}
//   });

  app.get('/api/task/today', (req, res) => {
	const q = 'SELECT * FROM today_plan';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			// console.log(data)
			res.send(data);
		}
	});
});



  app.post('/api/task/today', async (req, res) => {
	const { todayTask } = req.body;

	// ... (rest of the code)
  
	try {
	  // Escape station_name to prevent SQL injection (important!)
	  const escapedTodayTask = db.escape(todayTask);
  
	  // Insert station into the database
	   await db.query('INSERT INTO today_plan (today_plan) VALUES (?)', [escapedTodayTask]);
  
	  // Extract relevant data from the result
	
	  // Send success response with relevant data
	  res.status(201).json({ message: 'today task  added successfully'});
	} catch (error) {
	  console.error(error.message);
	  res.status(500).json({ error: 'Failed to add today task' });
	}
  });



  app.get('/api/task/tommorow', (req, res) => {
	const q = 'SELECT * FROM tommorow_plan';

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		} else {
			// console.log(data)
			res.send(data);
		}
	});
});


  app.post('/api/task/tommorow', async (req, res) => {
	const { tommorow_plan } = req.body;

	// ... (rest of the code)
  
	try {
	  // Escape station_name to prevent SQL injection (important!)
	  const escapedTomorrowPlan = db.escape(tommorow_plan);
  
	  // Insert station into the database
	   await db.query('INSERT INTO tommorow_plan (tommorow_plan) VALUES (?)', [escapedTomorrowPlan]);
  
	  // Extract relevant data from the result
	
	  // Send success response with relevant data
	  res.status(201).json({ message: 'Tommorow plan added successfully'});
	} catch (error) {
	  console.error(error.message);
	  res.status(500).json({ error: 'Failed to add Tommorow plan' });
	}
  });


//.....................................................................................


app.listen(PORT, (error) => {
	console.log(`Server is listening to port ${PORT}`);
});

//------------------------------------------------------------------------------------

// coac drive link position
// image/ with caption

