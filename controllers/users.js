const mongodb = require('../data/database');

// Custom findOrCreate function
const findCreateUser = async (profile, accessToken) => {
    //#swagger.tags=['Users']
    const userCollection = mongodb.getDatabase().db().collection('users');
    try {
        let user = await userCollection.findOne({ githubId: profile.id });
        if (user) {
            //User exists, Update accessToken if it has changed
            if (user.accessToken !== accessToken) {
                await userCollection.updateOne({ githubId: profile.id }, { $set: { accessToken, updatedAt: new Date() } });
            }
            return user;
        } else {
            // Create new user
            const newUser = {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                avatarUrl: profile.photos?.[0]?.value || null,
                accessToken,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await userCollection.insertOne(newUser);
            return { ...newUser, _id: result.insertedId };

        }
    } catch (err) {
        console.error('Error in User findOrCreate:', err);
        throw new Error('Database error in findCreateUser');
    }

}

const getProfile = async (req, res) => {
    //#swagger.tags=['Users']
    if (!req.session.user) return res.status(401).send('Unauthorized');

    res.setHeader('Content-Type', 'application/json');
    res.json({
        githubId: req.session.user.githubId,
        username: req.session.user.username,
        email: req.session.user.email
    });
};

module.exports = { findCreateUser, getProfile };