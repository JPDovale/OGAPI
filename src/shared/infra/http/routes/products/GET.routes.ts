import { Router } from 'express'

import { GetPricesController } from '@modules/products/controllers/GetPricesController/'

export const productsRoutesGet = Router()

const getPricesController = new GetPricesController()

productsRoutesGet.get('/prices', getPricesController.handle)
