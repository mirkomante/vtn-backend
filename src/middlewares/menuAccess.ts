import { Request, Response, NextFunction } from 'express';
import { isMenuEnabled as _isMenuEnabled, isMenuVisible as _isMenuVisible, menuConfig, MainMenuConfig } from '../config/menuConfig';

/**
 * Middleware per verificare l'accesso ai menu
 * Controlla se un menu è abilitato e visibile prima di permettere l'accesso
 */
export const checkMenuAccess = (menuName: keyof MainMenuConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const menu = menuConfig[menuName];
    
    // Verifica che il menu esista nella configurazione
    if (!menu) {
      console.warn(`Tentativo di accesso a menu non configurato: ${menuName}`);
      return res.status(404).render('pages/error', {
        title: 'Menu Non Trovato',
        message: 'Questo menu non è configurato nel sistema',
        layout: 'layouts/default'
      });
    }
    
    // Verifica che il menu sia abilitato
    if (!menu.enabled) {
      console.warn(`Tentativo di accesso a menu disabilitato: ${menuName}`);
      return res.status(404).render('pages/error', {
        title: 'Menu Non Disponibile',
        message: 'Questo menu è attualmente disabilitato',
        layout: 'layouts/default'
      });
    }
    
    // Verifica che il menu sia visibile (doppio controllo)
    if (!menu.visible) {
      console.warn(`Tentativo di accesso a menu nascosto: ${menuName}`);
      return res.status(404).render('pages/error', {
        title: 'Menu Non Disponibile',
        message: 'Questo menu non è attualmente visibile',
        layout: 'layouts/default'
      });
    }
    
    // Verifica se il menu è solo per sviluppo
    if (menu.developmentOnly && process.env.NODE_ENV === 'production') {
      console.warn(`Tentativo di accesso a menu di sviluppo in produzione: ${menuName}`);
      return res.status(404).render('pages/error', {
        title: 'Menu Non Disponibile',
        message: 'Questo menu è disponibile solo in ambiente di sviluppo',
        layout: 'layouts/default'
      });
    }
    
    // Verifica i ruoli se specificati
    if (menu.requiredRole && menu.requiredRole !== 'all') {
      if (!req.isAuthenticated()) {
        console.warn(`Tentativo di accesso a menu protetto senza autenticazione: ${menuName}`);
        return res.redirect('/auth/login');
      }
      
      if (menu.requiredRole === 'admin' && req.user && (req.user as any).role !== 'admin') {
        console.warn(`Tentativo di accesso a menu admin da utente non admin: ${menuName}`);
        return res.status(403).render('pages/error', {
          title: 'Accesso Negato',
          message: 'Non hai i permessi per accedere a questo menu',
          layout: 'layouts/default'
        });
      }
    }
    
    // Log dell'accesso riuscito (solo in sviluppo)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Accesso autorizzato al menu: ${menuName}`);
    }
    
    next();
  };
};

/**
 * Middleware per verificare l'accesso ai menu basato sul percorso
 * Analizza automaticamente il percorso per determinare il menu richiesto
 */
export const checkMenuAccessByPath = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Mappa dei percorsi ai menu
  const pathToMenuMap: Record<string, keyof MainMenuConfig> = {
    '/ristorante-menu': 'ristorante',
    '/admin': 'admin',
    '/analytics': 'analytics',
    '/reports': 'reports',
    '/settings': 'settings',
    '/dashboard': 'dashboard'
  };
  
  // Trova il menu corrispondente al percorso
  const menuName = pathToMenuMap[path];
  
  if (!menuName) {
    // Se il percorso non corrisponde a nessun menu, continua
    return next();
  }
  
  // Applica il controllo di accesso al menu
  return checkMenuAccess(menuName)(req, res, next);
};

/**
 * Middleware per verificare che almeno un menu sia abilitato
 * Da utilizzare nelle route principali per evitare errori se nessun menu è abilitato
 */
export const requireEnabledMenus = (_req: Request, res: Response, next: NextFunction) => {
  const enabledMenus = Object.values(menuConfig).filter(menu => menu.enabled && menu.visible);
  
  if (enabledMenus.length === 0) {
    console.error('Nessun menu è abilitato e visibile!');
    return res.status(503).render('pages/error', {
      title: 'Servizio Non Disponibile',
      message: 'Nessun menu è attualmente configurato. Contatta l\'amministratore.',
      layout: 'layouts/default'
    });
  }
  
  next();
};

/**
 * Middleware per loggare gli accessi ai menu (opzionale)
 * Utile per audit e debugging
 */
export const logMenuAccess = (req: Request, _res: Response, next: NextFunction) => {
  const originalUrl = req.originalUrl;
  const user = req.user ? `${(req.user as any).email} (${(req.user as any).role})` : 'Non autenticato';
  
  console.log(`🔍 Accesso menu: ${originalUrl} - Utente: ${user} - IP: ${req.ip}`);
  
  next();
};
