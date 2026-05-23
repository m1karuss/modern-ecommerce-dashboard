import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertTriangle, ShoppingBag } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const isUnexpected = !isRouteErrorResponse(error);

  const title = is404 ? 'Page not found' : 'Something went wrong';
  const message = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : 'An unexpected error occurred. Please try refreshing the page.';
  const code = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative text-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <ShoppingBag className="h-6 w-6 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Code */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isUnexpected ? (
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-20 w-20 text-yellow-500" />
            </div>
          ) : (
            <h1 className="text-[8rem] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-violet-400 to-primary/40 bg-clip-text text-transparent select-none">
              {code}
            </h1>
          )}
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2 mb-8"
        >
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">{message}</p>

          {/* Show technical details in dev mode */}
          {isUnexpected && error instanceof Error && (
            <details className="mt-4 text-left max-w-md mx-auto">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Technical details
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-muted text-xs overflow-auto text-left max-h-40">
                {error.message}
              </pre>
            </details>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
