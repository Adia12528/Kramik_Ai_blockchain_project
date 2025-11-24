const jwt = require('jsonwebtoken');
try {
    const token = jwt.sign({ foo: 'bar' }, undefined);
    console.log('Token signed with undefined secret:', token);
} catch (e) {
    console.log('Sign error:', e.message);
}
