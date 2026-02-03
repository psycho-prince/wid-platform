
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Asset Vault', href: '/assets' },
  { name: 'Inheritance Rules', href: '/inheritance' },
  { name: 'Account & Security', href: '/account' },
];

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0 bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">WID</h1>
        <nav className="mt-8">
          <ul>
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-md px-3 py-2 text-base font-medium',
                      isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
