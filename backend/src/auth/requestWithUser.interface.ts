import { Request } from 'express';
import { CurrentUser } from 'src/user/CurrentUser';

interface RequestWithUser extends Request {
  user: CurrentUser;
}

export default RequestWithUser;
