import { PassportSerializer } from '@nestjs/passport';
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }
  serializeUser(user: any, done) {
    done(null, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  deserializeUser(payload: any, done) {
    done(null, payload);
  }
}
