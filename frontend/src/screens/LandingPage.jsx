import React from 'react';
import config from '../constants.js';
import { BeakerIcon, MoonIcon } from '@heroicons/react/24/solid';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
                <MoonIcon className="h-12 w-12 text-indigo-400"/>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Lunar Primate Research</h1>
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Analyzing the effects of lunar gravity on primate behavior and physics. Powered by Newton's principles and a lot of bananas.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => onLogin('researcher@manifest.build', 'password')}
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login as Demo Researcher
              </button>
              <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">
                Admin Panel <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
