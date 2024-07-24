"use client";

import { Icons } from "./icons"

import React, { useState } from 'react';

export function SDKBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-white relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">
          <strong className="font-semibold">🚀 New Chatbot SDK</strong>
          <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline h-0.5 w-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          Discover our new Open Source SDK for building chatbots.
        </p>
        <a
          href="https://sdk.openassistantgpt.io/"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Read about our SDK <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button 
          type="button" 
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          onClick={handleDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <Icons.close className="h-6 w-6 text-gray-900" />
        </button>
      </div>
    </div>
  );
};

