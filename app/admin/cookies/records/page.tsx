import { redirect } from 'next/navigation';

export default function CookieRecordsRedirectPage() {
  redirect('/admin/cookies');
}

