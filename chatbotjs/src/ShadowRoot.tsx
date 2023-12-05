import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

type ShadowRootComponentProps = {
    children: React.ReactNode;
    styleUrl?: string;
};

const ShadowRootComponent: React.FC<ShadowRootComponentProps> = ({ children, styleUrl }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current && !shadowRoot) {
            const shadow = hostRef.current.attachShadow({ mode: 'open' });
            setShadowRoot(shadow);

            if (styleUrl) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = styleUrl;
                shadow.appendChild(link);
            }
        }
    }, [styleUrl, shadowRoot]);

    return (
        <div ref={hostRef}>
            {shadowRoot && ReactDOM.createPortal(children, shadowRoot)}
        </div>
    );
};

export default ShadowRootComponent;
