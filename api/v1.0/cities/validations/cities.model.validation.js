'use strict';

import Joi from 'joi';

let Schema = Joi.object().keys({
  name      : Joi.object(),
  username  : Joi.string(),
  password  : Joi.string()
});

export default Schema;
