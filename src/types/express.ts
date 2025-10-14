export type User = {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role: string;
  googleId?: string;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
      query: any;
      body: any;
      params: any;
      isAuthenticated(): boolean;
      logout(callback: (err: any) => void): void;
      flash(type: string, message?: string): string | string[];
    }
    
    interface Response {
      render(view: string, locals?: any): void;
      redirect(url: string): void;
    }
  }
}

