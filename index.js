const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const bodyParser = require('body-parser');
const _ = require('lodash');

function createApp() {
  const app = express();

  // Initialize routes
  app.use(bodyParser.json({ limit: '1mb' }));

  const postOrderSchema = {
    body: Joi.object({
      email: Joi.string().email().required(),
      currency: Joi.string().valid('EUR', 'USD').required(),
      // Other fields are omitted in the example
    }),
  };
  app.post('/api/orders', /* createOrderApiLimiter,*/ validate(postOrderSchema), (req, res, next) => {
    const clientOrder = _.merge({}, req.body, { ipAddress: req.ip });

    // Process order (not important what happens here)
    // await orderCore.createOrder(clientOrder);

    const newObj = {};
    console.log('newObj.admin', newObj.admin);

    res.json({
      // Normally this endpoint would echo back the created order
      status: 'ok',
    });
  });

  const getOrderSchema = {
    params: {
      orderId: Joi.string().regex(/^[0-9]{4}$/).required(),  // id shortened for this example
    },
  };
  app.get('/api/orders/:orderId', /* apiLimiter,*/ validate(getOrderSchema), (req, res, next) => {
    const newObj = {};
    console.log('newObj.admin:', newObj.admin);

    // Prototype attributes are overridden by default, so fortunately this doesn't work:
    // There are still multiple possible ways how this can be exploited.
    const newObj2 = { admin: false };
    console.log('newObj2.admin:', newObj2.admin);

    res.json({
      // Normally this endpoint would return the found order or 404
      status: 'ok',
    });
  });

  return app;
}

function main() {
  const app = createApp();
  app.listen(9999, () => {
    console.log('Express server listening on http://localhost:9999/')
  });
}

if (require.main === module) {
  main();
}
