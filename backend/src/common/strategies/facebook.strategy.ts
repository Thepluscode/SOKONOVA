import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_APP_ID || '',
            clientSecret: process.env.FACEBOOK_APP_SECRET || '',
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:4000/auth/facebook/callback',
            scope: ['email'],
            profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: Record<string, unknown>) => void,
    ): Promise<void> {
        const { id, name, emails, photos, displayName } = profile;

        const user = {
            provider: 'facebook',
            providerId: id,
            email: emails?.[0]?.value,
            name: displayName || `${name?.givenName || ''} ${name?.familyName || ''}`.trim(),
            picture: photos?.[0]?.value,
            accessToken,
        };

        done(null, user);
    }
}
