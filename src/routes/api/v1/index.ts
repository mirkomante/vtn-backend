import express from 'express';
import menuFissoRoutes from './menu-fisso';
import piattiRoutes from './piatti';
import viniRoutes from './vini';
import birreRoutes from './birre';
import liquoriRoutes from './liquori';
import cocktailsRoutes from './cocktails';
import bevandeRoutes from './bevande';
import serviziRoutes from './servizi';
import categoriaMenuFissoRoutes from './categoria-menu-fisso';
// Nuovi endpoint lookup
import allergeniRoutes from './allergeni';
import nazioniRoutes from './nazioni';
import regioniRoutes from './regioni';
import zoneRoutes from './zone';
import tipologieVinoRoutes from './tipologie-vino';
import tipologieBirraRoutes from './tipologie-birra';
import tipologieLiquoreRoutes from './tipologie-liquore';
import tipologieCocktailRoutes from './tipologie-cocktail';
import tipologieBevandaRoutes from './tipologie-bevanda';
import categoriePiattiRoutes from './categorie-piatti';
// Middleware API
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { responseHandler } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// Middleware essenziali
router.use(jsonErrorHandler);

// Middleware di utilità
router.use(apiRequestLogger);
router.use(responseHandler);

// Mount delle risorse
router.use('/menu-fisso', menuFissoRoutes);
router.use('/piatti', piattiRoutes);
router.use('/vini', viniRoutes);
router.use('/birre', birreRoutes);
router.use('/liquori', liquoriRoutes);
router.use('/cocktails', cocktailsRoutes);
router.use('/bevande', bevandeRoutes);
router.use('/servizi', serviziRoutes);
router.use('/categoria-menu-fisso', categoriaMenuFissoRoutes);
// Nuovi endpoint lookup
router.use('/allergeni', allergeniRoutes);
router.use('/nazioni', nazioniRoutes);
router.use('/regioni', regioniRoutes);
router.use('/zone', zoneRoutes);
router.use('/tipologie-vino', tipologieVinoRoutes);
router.use('/tipologie-birra', tipologieBirraRoutes);
router.use('/tipologie-liquore', tipologieLiquoreRoutes);
router.use('/tipologie-cocktail', tipologieCocktailRoutes);
router.use('/tipologie-bevanda', tipologieBevandaRoutes);
router.use('/categorie-piatti', categoriePiattiRoutes);

// Endpoint di health check per l'API v1
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: 'v1',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1'
    }
  });
});

// Middleware per gestione errori
router.use(notFoundHandler);
router.use(apiErrorHandler);

export default router;
