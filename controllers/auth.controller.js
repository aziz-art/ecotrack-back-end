const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');
const crypto = require('crypto');

function checkPassword(password, hash) {
  // WordPress phpass password verification implementation
  const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  function decode64(input, count) {
    let output = 0;
    let i = 0;
    let value = 0;
    let bits = 0;
    let result = 0;
    let j = 0;
    let c;

    for (i = 0; i < count; i++) {
      c = input.charAt(i);
      value = itoa64.indexOf(c);
      if (value < 0) {
        return -1;
      }
      result |= value << bits;
      bits += 6;
      if (bits >= 8) {
        output = (result & 0xff);
        result >>= 8;
        bits -= 8;
        j++;
      }
    }
    return output;
  }

  function cryptPrivate(password, setting) {
    const output = '*0';
    if (setting.substring(0, 3) !== '$P$' && setting.substring(0, 3) !== '$H$') {
      return output;
    }
    const count_log2 = itoa64.indexOf(setting.charAt(3));
    if (count_log2 < 7 || count_log2 > 30) {
      return output;
    }
    const count = 1 << count_log2;
    const salt = setting.substring(4, 12);
    if (salt.length !== 8) {
      return output;
    }
    let hash = crypto.createHash('md5').update(salt + password).digest();
    for (let i = 0; i < count; i++) {
      hash = crypto.createHash('md5').update(Buffer.concat([hash, Buffer.from(password)])).digest();
    }
    let outputHash = setting.substring(0, 12);
    let i = 0;
    let value;
    let count2 = 0;
    while (count2 < 16) {
      value = hash[count2++];
      outputHash += itoa64.charAt(value & 0x3f);
      if (count2 < 16) {
        value |= hash[count2] << 8;
      }
      outputHash += itoa64.charAt((value >> 6) & 0x3f);
      if (count2++ >= 16) {
        break;
      }
      if (count2 < 16) {
        value |= hash[count2] << 16;
      }
      outputHash += itoa64.charAt((value >> 12) & 0x3f);
      if (count2++ >= 16) {
        break;
      }
      outputHash += itoa64.charAt((value >> 18) & 0x3f);
    }
    return outputHash;
  }

  if (hash.length === 34) {
    return cryptPrivate(password, hash) === hash;
  } else {
    // Fallback to MD5 (not secure, but WordPress used it before)
    const md5hash = crypto.createHash('md5').update(password).digest('hex');
    return md5hash === hash;
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM wp_users WHERE user_login = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const validPassword = checkPassword(password, user.user_pass);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.ID, username: user.user_login },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  // For JWT, logout can be handled client-side by deleting token
  res.json({ message: 'Logout successful' });
};
