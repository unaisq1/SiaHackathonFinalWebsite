import mysql from 'mysql2/promise';

export default class DatabaseService {
	conn;

	constructor(conn) {
		this.conn = conn;
	}

	/* Establish database connection and return the instance */
	static async connect() {
		const conn = await mysql.createConnection({
			host: process.env.DATABASE_HOST || 'localhost',
			user: 'user',
			password: 'password',
			database: 'envirewards',
		});
		console.log("connect() executed sucessfully");
		return new DatabaseService(conn);
	}

	/* User Login */
	async Login(email, password) {
        try {
            const sql = `
                SELECT *
                FROM userinfo
                WHERE email = ? AND user_pass = ?
            `;
            const [rows] = await this.conn.execute(sql, [email, password]);
            console.log("login() executed successfully");
            return rows.length > 0;
        } catch (err) {
            console.error('email or password is wrong:', err);
            return false;
        }
    }

	async Get_tokens(email) {
        try {
            const sql = 'SELECT tokens FROM userinfo WHERE email = ?';
			
			const [rows] = await this.conn.execute(sql, [email]);
            console.log("Tokens succesfully fetched");
            return rows;
        } catch (error) {
            console.error('Error in Get_tokens:', error);
            throw error;  // Re-throw the error so it can be handled by the calling function
		}
	}

	
	async Add_tokens(more_tokens, email) {
		try {
			const sql = `
			UPDATE userinfo 
			SET tokens = tokens + ?
			WHERE email = ?; 
			`
			const [result] = await this.conn.execute(sql, [email, more_tokens]); // Pass the parameters properly
        console.log("Tokens added");
        return result;
		}
		catch (err) {
			console.error('cannot add tokens:', err);
			return [];
		}
	}

	async Add_Dev_tokens(email) {
		try {
			const sql = `
			UPDATE userinfo 
			SET tokens = tokens + 5000
			WHERE email = ?;
			`;

			// Execute the SQL query with proper parameter binding
			const [result] = await this.conn.execute(sql, [email]);

			// Log the success message
			console.log("5000 tokens added successfully for email:", email);
			
			return result; // Return the result
		} catch (err) {
			// Log the error message if any exception occurs
			console.error('Error while adding dev tokens:', err);
			throw err; // Re-throw the error to let the caller handle it
		}
	}


	async rm_tokens(less_tokens, email) {
		try {
			const sql = `
			UPDATE userinfo 
			SET tokens = tokens - ?
			WHERE email = ?;
			`;
			const [result] = await this.conn.execute(sql, [less_tokens, email]); // Pass the parameters properly
			console.log("Tokens deducted");
			return result;

		} catch (err) {
			console.error('Cannot remove tokens:', err);
			throw err;
		}
	}

	async add_User(email, password) {
		try {
			const sql = `
			INSERT INTO userinfo (email, user_pass, tokens, user_type)
			VALUES (?, ?, 0, "endUser")
			`
			const [result] = await this.conn.execute(sql, [email, password]); // Execute the query
			console.log("User added successfully");
			return result; // Return the result of the query execution
		} catch (err) {
			console.error('Cannot add user:', err);
			throw err; // Throw the error to be handled by the calling function
		}
	}

	async add_Admin(email, password) {
		try {
			const sql = `
			INSERT INTO userinfo (email, user_pass, tokens, user_type)
			VALUES ("${email}", "${password}", 0, "Admin")
			`
		}
		catch (err) {
			console.error('cannot add Admin:', err);
			return [];
		}
	}

	async del_User(email) {
		try {
			const sql = `
			DELETE
			FROM userinfo
			WHERE email = "${email}"
			`
		}
		catch (err) {
			console.error('cannot remove user:', err);
			return [];
		}
	}

	async Get_shop(ShopID) {
		try {
			const sql = `
			SELECT * 
			FROM store_info 
			WHERE Store_ID = '${ShopID}';
			`
		}
		catch (err) {
			console.error('cannot add tokens:', err);
			return [];
		}
	}

	async add_Shop(ShopID, Shop_name, voucherID, store_image, store_type) {
		try {
			const sql = `
			INSERT INTO store_info (Store_ID, Store_Name, Voucher_ID, store_image, Store_Type)
			VALUES ("${ShopID}", "${Shop_name}", "${voucherID}", "${store_image}", "${store_type}" )
			`
		}
		catch (err) {
			console.error('cannot add user:', err);
			return [];
		}
	}

}

