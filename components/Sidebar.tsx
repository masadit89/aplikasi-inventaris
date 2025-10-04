import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const IconBox = () => (
    <svg className="w-10 h-10 text-slate-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H8V8H4V4Z" fill="currentColor"/>
        <path d="M4 10H8V14H4V10Z" fill="currentColor"/>
        <path d="M4 16H8V20H4V16Z" fill="currentColor"/>
        <path d="M10 4H14V8H10V4Z" fill="currentColor"/>
        <path d="M10 10H14V14H10V10Z" fill="currentColor"/>
        <path d="M10 16H14V20H10V16Z" fill="currentColor"/>
        <path d="M16 4H20V8H16V4Z" fill="currentColor"/>
        <path d="M16 10H20V14H16V10Z" fill="currentColor"/>
        <path d="M16 16H20V20H16V16Z" fill="currentColor"/>
    </svg>
);


// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const NavItem: React.FC<{ icon: React.ReactElement; label: View; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`
        flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      {icon}
      <span className="ml-4 text-sm font-medium">{label}</span>
    </li>
  );
};

const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
const ListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>);
const ReportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col p-4">
      <div className="flex items-center mb-8 p-3">
        <div className="bg-blue-500 p-2 rounded-lg">
            <IconBox />
        </div>
        <h1 className="text-xl font-bold ml-3">Inventaris Kantor</h1>
      </div>
      <nav>
        <ul>
          <NavItem
            icon={<DashboardIcon />}
            label={View.DASHBOARD}
            isActive={currentView === View.DASHBOARD}
            onClick={() => setCurrentView(View.DASHBOARD)}
          />
          <NavItem
            icon={<ListIcon />}
            label={View.ITEMS}
            isActive={currentView === View.ITEMS}
            onClick={() => setCurrentView(View.ITEMS)}
          />
          <NavItem
            icon={<ReportIcon />}
            label={View.REPORTS}
            isActive={currentView === View.REPORTS}
            onClick={() => setCurrentView(View.REPORTS)}
          />
        </ul>
      </nav>
      <div className="mt-auto p-3 text-center text-xs text-slate-500">
        <p>Powered by React & Gemini</p>
        <p>&copy; {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};