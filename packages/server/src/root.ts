import { Router } from 'express';

import answer from './routes/answer';
import application from './routes/application';
import applicant from './routes/applicationSubmission';
import applicationSubmission from './routes/applicationSubmission';
import club from './routes/club';
import clubMember from './routes/clubMember';
import clubProfile from './routes/clubProfile';
import s3fileStorage from './routes/s3FileStorage';
import user from './routes/user';

const rootRouter = Router();
//Whenever you create a new route you need to import it here and add it our api
// For example if we want to add a new route called example:
rootRouter.use('/api', applicant);
rootRouter.use('/api', application);
rootRouter.use('/api', applicationSubmission);
rootRouter.use('/api', answer);
rootRouter.use('/api', club);
rootRouter.use('/api', clubProfile);
rootRouter.use('/api', user);
rootRouter.use('/api', clubMember);
rootRouter.use('/api', s3fileStorage);

export default rootRouter;
