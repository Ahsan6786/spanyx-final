import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          margin: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '460px',
          margin: '16px 0 32px',
          lineHeight: 1.5,
        }}
      >
        The page you are looking for does not exist or has been moved to a new destination.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          borderRadius: '999px',
          background: '#0066FF',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '14.5px',
          fontWeight: 600,
          transition: 'transform 0.2s, background 0.2s',
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}

