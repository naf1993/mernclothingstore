import passport from 'passport';

export const requireJwtAuth = passport.authenticate('jwt', { session: false });


