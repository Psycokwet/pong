import { Request } from 'express';
import { CurrentUser } from 'shared/interfaces/CurrentUser';

interface RequestWithUser extends Request {
  user: CurrentUser;
}

export default RequestWithUser;
