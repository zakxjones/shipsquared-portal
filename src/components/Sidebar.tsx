'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Package, 
  ClipboardList, 
  Users, 
  Send, 
  ChevronDown, 
  Home as HomeIcon,
  CreditCard,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Package },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

const shipmentsSubmenu = [
  { name: 'Create Shipment', href: '/dashboard/shipments/create' },
  { name: 'Shipment History', href: '/dashboard/shipments' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isShipmentsRoute = pathname.startsWith('/dashboard/shipments');
  const [shipmentsOpen, setShipmentsOpen] = useState(isShipmentsRoute);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email ?? null);
      }
    };
    getUserEmail();
  }, [supabase.auth]);

  // Open submenu if navigating to a shipments route
  if (isShipmentsRoute && !shipmentsOpen) setShipmentsOpen(true);

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800" style={{ backgroundColor: '#fff' }}>
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/shipsquared-logo.svg"
            alt="ShipSquared"
            width={150}
            height={40}
            priority
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
        {/* Shipments row with text and dropdown arrow */}
        <div className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer ${
          isShipmentsRoute ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}>
          <Send className={`mr-3 h-5 w-5 flex-shrink-0 ${isShipmentsRoute ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
          <Link
            href="/dashboard/shipments/create"
            className="flex-1"
            onClick={() => setShipmentsOpen(true)}
          >
            Shipments
          </Link>
          <button
            type="button"
            aria-label={shipmentsOpen ? 'Collapse Shipments menu' : 'Expand Shipments menu'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShipmentsOpen((open) => !open);
            }}
            className="ml-2 focus:outline-none"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${shipmentsOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {shipmentsOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {shipmentsSubmenu.map((sub) => {
              const isActive = pathname === sub.href;
              return (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className={`block rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
      {userEmail && (
        <div className="border-t border-gray-800 p-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">{userEmail}</p>
          <button
            aria-label="Settings"
            onClick={() => router.push('/dashboard/settings')}
            className="ml-2 text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
} 