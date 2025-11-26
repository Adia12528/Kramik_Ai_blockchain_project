const jwt = require('jsonwebtoken');
try {
    const token = jwt.sign({ foo: 'bar' }, 'A12528@as');
    console.log('Token signed with undefined secret:', token);
} catch (e) {
    console.log('Sign error:', e.message);
}
