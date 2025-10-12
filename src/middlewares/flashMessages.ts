import { Request, Response, NextFunction } from 'express';

// Estendiamo l'interfaccia Session per includere flash
declare module 'express-session' {
  interface SessionData {
    flash?: { [key: string]: string[] };
  }
}

// Estendiamo l'interfaccia Request per includere i metodi flash
declare global {
  namespace Express {
    interface Request {
      flash(type: string, message?: string): string | string[];
      flash(): { [key: string]: string[] };
    }
  }
}

/**
 * Middleware personalizzato per gestire i messaggi flash
 * Sostituisce express-flash per evitare il warning util.isArray deprecato
 */
export const flashMessages = (req: Request, res: Response, next: NextFunction) => {
  // Inizializza l'oggetto flash se non esiste
  if (!req.session) {
    throw new Error('express-session middleware deve essere configurato prima di flashMessages');
  }

  if (!req.session.flash) {
    req.session.flash = {};
  }

  // Implementa il metodo flash
  req.flash = ((type?: string, message?: string): string | string[] | { [key: string]: string[] } => {
    if (type === undefined) {
      // Getter: restituisce tutti i messaggi flash
      return req.session!.flash || {};
    }
    if (!req.session!.flash) {
      req.session!.flash = {};
    }

    if (message !== undefined) {
      // Setter: aggiunge un messaggio
      if (!req.session!.flash![type]) {
        req.session!.flash![type] = [];
      }
      req.session!.flash![type].push(message);
      return message;
    } else {
      // Getter: restituisce e cancella i messaggi
      const messages = req.session!.flash![type] || [];
      delete req.session!.flash![type];
      return messages;
    }
  }) as any;

  // Rende disponibili i messaggi flash nelle viste
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.info = req.flash('info');
  res.locals.warning = req.flash('warning');

  next();
};
